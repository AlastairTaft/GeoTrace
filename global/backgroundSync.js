import * as TaskManager from 'expo-task-manager'
import * as Crypto from 'expo-crypto'
import * as storage from './storage'
import * as saltAPI from './saltAPI'
import * as centralAPI from './centralAPI'
import { getDeviceId } from './deviceId'
import * as Sentry from 'sentry-expo'
import { 
  createBackgroundSyncFunction,
  purgeStaleLocations, 
} from './backgroundSyncUtil'

export const BACKGROUND_SYNC_TASK_NAME = 'COVID19_RISK_SYNC'

const backgroundTaskFunc = async (...args) => {

  var storedLocations = await storage.getStoredLocationData()
  // Clear all data that's older than 2 weeks
  purgeStaleLocations(
    storedLocations, 
    (new Date()) - (1000 * 60 * 60 * 24 * 14),
  )

  var timeBlockSize = 1000 * 60 * 5
  var locations = Object.keys(storedLocations[timeBlockSize])
    .map(key => storedLocations[timeBlockSize][key])

  // Filter out home sensitive location data, e.g. their home address
  locations = scrambleSensitiveLocations(locations)

  var riskPoints = []
  // We need to map each location to its respective grid block
  await Promise.all(locations.map(async l => {
    // Location type info here 
    // https://docs.expo.io/versions/latest/sdk/location/#location

    // The current time right now is 10:06 AEST, we don't care about anything
    // before then so let's remove that time from the EPOCH.
    var elapsed = Math.round(l.timestamp) - RELATIVE_EPOCH_START
    
    // Not specific geographic block the user is in, used to get the salt
    var nonSpecificGeoBlock = getBlockIdentifierForLocation(
      {
        latitude: l.latitude,
        longitude: l.longitude,
      },
      1000 * 50 // Will represent a 50km squared block
    )
    var preSaltHash = await hashFunction(`
      This block, if reverse hashed identifies that somebody with a certain 
      IP was somewhere within a 50 square meter block at a certain time.`
      .replace(/\s+/g, ' ') + 
      nonSpecificGeoBlock.id.latitudeBlockNumber + '-' + 
      nonSpecificGeoBlock.id.longitudeBlockNumber
    )

    var localRiskPoints = getRiskPoints(l.coords, elapsed)
    await Promise.all(localRiskPoints.map(
      async dto => {
        var hash = await hashRiskPoint(dto)
        riskPoints.push({
          timePassedSinceExposure: dto.timePassedSinceExposure,
          hash,
          preSaltHash,
          timestamp: Math.round(l.timestamp),
        })
      }
    ))      
  }))


  
  var func = createBackgroundSyncFunction({
    popStoredRiskData: storage.popStoredRiskData,
    getSalts: saltAPI.getSalts,
    getDeviceId,
    submitRiskMap: centralAPI.submitRiskMap,
    onError: error => {
      if (__DEV__)
        console.error(error)
      Sentry.captureMessage(error)
    },
    hashFunction: str => Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      str,
      {
        encoding: Crypto.CryptoEncoding.BASE64,
      },
    ),
    getStoredUserData: storage.getStoredUserData,
    setStoredUserData: storage.setStoredUserData,
    warnAtRisk: async () => {
      await Notifications.presentLocalNotificationAsync({
        title: 'Possible exposure detected.',
        body: 'This does not mean you are infected, but it is recommended you stay at home.',
        ios: {
          sound: true,
          _displayInForeground: true,
        }
      })
    },
  })
  await func(...args)
}

TaskManager.defineTask(BACKGROUND_SYNC_TASK_NAME, backgroundTaskFunc)

