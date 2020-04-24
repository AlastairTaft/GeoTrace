import * as TaskManager from 'expo-task-manager'
import * as Sentry from 'sentry-expo'
import * as Crypto from 'expo-crypto'
import './bugTracking'
import * as trackAPI from './centralAPI'
import { getDeviceId } from './deviceId'
import { getRiskPoints } from './risk'
import { getBlockIdentifierForLocation } from './blocks'
import { RELATIVE_EPOCH_START } from './constants'
import { pushRiskPoints } from './storage'
import { hashRiskPoint } from './risk'

export const BACKGROUND_TRACKING_TASK_NAME = 'COVID19_LOCATION_TRACKING'

TaskManager.defineTask(
  BACKGROUND_TRACKING_TASK_NAME, 
  async ({ data: { locations }, error }) => {
    if (error) {
      // check `error.message` for more details.
      Sentry.captureException(error)
      return;
    }

    // If the accuracy is less than 10 meters, discard it
    locations = locations.filter(l => l.coords.accuracy <= 10)
    // Won't track if moving faster than 30 meters per second, assuming they 
    // are in a car, where this kind of data isn't all that useful
    locations = locations.filter(l => l.coords.speed <= 30000)

    // Filter out home sensitive location data, e.g. their home address
    locations = scrambleSensitiveLocations(locations)

    // We need to map each location to its respective grid block
    var riskPoints = await Promise.all(locations.map(async l => {
      // Location type info here 
      // https://docs.expo.io/versions/latest/sdk/location/#location

      
      // The current time right now is 10:06 AEST, we don't care about anything
      // before then so let's remove that time from the EPOCH.
      var elapsed = Math.round(l.timestamp) - RELATIVE_EPOCH_START
     
      var riskPoints = getRiskPoints(l.coords, elapsed)
      var hashedRiskPoints = await Promise.all(riskPoints.map(
        async dto => {
          var hash = await hashRiskPoint(dto)
          return {
            timePassedSinceExposure: dto.timePassedSinceExposure,
            hash,
          }
        }
      ))

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

      return {
        preSaltHash,
        hashedRiskPoints,
        timestamp: Math.round(l.timestamp),
      }
      
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
