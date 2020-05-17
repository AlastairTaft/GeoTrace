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
import * as risk from './risk'
import * as blocks from './blocks'

export const BACKGROUND_SYNC_TASK_NAME = 'COVID19_RISK_SYNC'

const backgroundTaskFunc = async (...args) => {

  var storedLocations = await storage.getStoredLocationData()
  // Clear all data that's older than a couple hours
  purgeStaleLocations(
    storedLocations, 
    (new Date()) - (1000 * 60 * 60 * 2),
  )

  var timeBlockSize = 1000 * 60 * 5
  var locations = Object.keys(storedLocations[timeBlockSize])
    .map(key => storedLocations[timeBlockSize][key])

  // Filter out home sensitive location data, e.g. their home address
  // TODO Will need to store elsewhere location history that has been processed
  // because will need at least 24 hours of location data to figure out 
  // the likely home location
  locations = scrambleSensitiveLocations(locations)
  // Clear out locations
  await setStoredLocationData({})

  var hashFunction = str => Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    str + 'Add some random text ⚽️☕️🍰',
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    },
  )

  var hashedRiskPoints = await Promise.all(locations.map(
    l => risk.convertLocationToHashedRiskPoints(l, { hashFunction })
  ))

  // Add timestamp value for backwards compatibility and so code has the
  // value to send to the salt server
  hashedRiskPoints = hashedRiskPoints.map(dto => {
    return {
      ...dto,
      timestamp: blocks.getTimestampFromBlock(dto.timeBlockId, dto.timeBlockSize),
    }
  })
  
  // Wrapping/abstracting this code, as we know it works
  var func = createBackgroundSyncFunction({
    popStoredRiskData: () => hashedRiskPoints,
    getSalts: saltAPI.getSalts,
    getDeviceId,
    submitRiskMap: centralAPI.submitRiskMap,
    onError: error => {
      if (__DEV__)
        console.error(error)
      Sentry.captureMessage(error)
    },
    hashFunction,
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

