import React, { useState, useEffect } from 'react'
import * as TaskManager from 'expo-task-manager'
import * as Sentry from 'sentry-expo'
import './bugTracking'
import * as trackAPI from './trackAPI'
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

    var deviceId = await getDeviceId()

    // Convert each location into GeoJSON
    var features = locations.map(l => ({
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          l.coords.longitude, 
          l.coords.latitude, 
          l.coords.altitude,
        ]
      },
      "properties": {
        "accuracy": l.coords.accuracy,
        "altitudeAccuracy": l.coords.altitudeAccuracy,
        "heading": l.coords.heading,
        "speed": l.coords.speed,
        "timestamp": l.timestamp,
        "uniqueId": deviceId,
      },
    }))
    
    await trackAPI.trackPositions(features)
  
  }
)


const BackgroundScriptContext = React.createContext()

export const { Provider, Consumer } = BackgroundScriptContext


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