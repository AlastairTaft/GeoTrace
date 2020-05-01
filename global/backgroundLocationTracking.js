import * as TaskManager from 'expo-task-manager'
import * as Sentry from 'sentry-expo'
import * as Crypto from 'expo-crypto'
import './bugTracking'
import { getRiskPoints } from './risk'
import { getBlockIdentifierForLocation } from './blocks'
import { RELATIVE_EPOCH_START } from './constants'
import { pushRiskPoints } from './storage'
import { hashRiskPoint } from './risk'
import { AsyncStorage } from 'react-native'

export const BACKGROUND_TRACKING_TASK_NAME = 'COVID19_LOCATION_TRACKING'

//TaskManager.unregisterAllTasksAsync()
//AsyncStorage.setItem('riskPoints',  JSON.stringify({}))

TaskManager.defineTask(
  BACKGROUND_TRACKING_TASK_NAME, 
  async ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      Sentry.captureException(error)
      return;
    }

    // Must manually limit the data points we store because iOS will fire this
    // everytime the user's location significantly changes
    var lastTrackTime = await AsyncStorage.getItem('lastTrackTime')
    //var t5MinsAgo = (new Date()).valueOf() - (1000 * 60 * 5)
    var t5MinsAgo = (new Date()).valueOf() - (1000 * 10)
    if (lastTrackTime && Number(lastTrackTime) > t5MinsAgo){
      // Don't track another data point if the last one was less
      // than 5 minutes ago
      return
    }
    await AsyncStorage.setItem('lastTrackTime', '' + (new Date()).valueOf())

    // If the accuracy is less than 10 meters, discard it
    locations = locations.filter(l => l.coords.accuracy <= 10)
    // Won't track if moving faster than 30 meters per second, assuming they 
    // are in a car, where this kind of data isn't all that useful
    locations = locations.filter(l => l.coords.speed <= 30000)

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
      var preSaltHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        `This block, if reverse hashed identifies that somebody with a certain 
         IP was somewhere within a 50 square meter block at a certain time.` + 
         nonSpecificGeoBlock.id.latitudeBlockNumber + '-' + 
         nonSpecificGeoBlock.id.longitudeBlockNumber,
        {
          encoding: Crypto.CryptoEncoding.BASE64,
        }
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

    // Puts the hashed risk points in local storage
    await pushRiskPoints(riskPoints)

  }
)

/**
 * Scrambles all sensitive location data, e.g. the users home address.
 * @param {Array<Location>}
 * @returns {Array<Location>}
 */
function scrambleSensitiveLocations(locations){
  // TODO
  // We scramble rather than remove so that its harder to infer the user is
  // near to their home if there is a gap in data
  // TODO Must scramble in a way that won't cause fake collisions to be 
  // detected
  return locations
}
