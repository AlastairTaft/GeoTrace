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