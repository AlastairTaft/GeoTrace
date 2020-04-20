import React, { useState, useEffect } from 'react'
import * as TaskManager from 'expo-task-manager'
import * as Sentry from 'sentry-expo'
import './bugTracking'
import * as trackAPI from './centralAPI'
import { getDeviceId } from './deviceId'

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
    var blocks = locations.map(l => {
      // Location type info here 
      // https://docs.expo.io/versions/latest/sdk/location/#location

      // Here we shift the grid by a third of the block size. So that if users
      // are at the very edge of a block we have a different frame that's closer
      // to centering them in it
      var totalBlocksAtLatitude = getNoLongitudeBlocks(l.coords.latitude)
      var longitudeBlockSize = 180 / totalBlocksAtLatitude
      var layerABlock = getBlockIdentifierForLocation(l.coords)
      var layerBBlock = getBlockIdentifierForLocation({
        latitude: l.latitude + (LATITUDE_BLOCK_SIZE * 1 / 3),
        longitude: l.longitude + (longitudeBlockSize * 1 / 3),
      })
      var layerCBlock = getBlockIdentifierForLocation({
        latitude: l.latitude + (LATITUDE_BLOCK_SIZE * 2 / 3),
        longitude: l.longitude + (longitudeBlockSize * 2 / 3),
      })
      // The current time right now is 10:06 AEST, we don't care about anything
      // before then so let's remove that time from the EPOCH.
      var elapsed = l.timestamp - 1587384430649

      // Gets logarithmic points up to 52 hours after. This results in 
      // 9 data points of increasing time apart
      for (var i = 1; i <= 5; i += 0.5){
        // Block size in minutes.
        var timestampBlockSizeMins = Math.floow(Math.pow(Math.E, 1.6095 * i))
        var timestampBlockSize = timestampBlockSizeMins * 60 * 1000
        var timeBlockA = getBlockIdentifierForTimestamp(
          elapsed, timestampBlockSize)
        var timeBlockB = getBlockIdentifierForTimestamp(
          elapsed + Math.floor(timestampBlockSize / 2), 
          timestampBlockSize
        )
      }
    })


    var deviceId = await getDeviceId()

    
    try {
      await trackAPI.trackPositions(features)
    } catch (err){
      if (__DEV__)
        throw err
      else 
        Sentry.captureException(error)
    }
  }
)


const BackgroundScriptContext = React.createContext()

export const { Provider, Consumer } = BackgroundScriptContext


/**
 * Ensures the background tracking script is installed and pases a boolean value
 * down through the context.
 */
export var BackgroundScriptWrapper = props => {
  
  var [locationTrackingInstalled, setLocationTrackingInstalled] = useState()

  useEffect(() => {
    TaskManager.getRegisteredTasksAsync()
    .then(tasks => {
      setLocationTrackingInstalled(tasks.some(
        t => t['taskName'] == BACKGROUND_TRACKING_TASK_NAME))
    })
  })

  return (
    <Provider value={locationTrackingInstalled}>
      {props.children}
    </Provider>
  )
}



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