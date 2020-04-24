import React, { useState, useEffect } from 'react'
import { BACKGROUND_SYNC_TASK_NAME } from './../global/backgroundSync'
import { BACKGROUND_TRACKING_TASK_NAME } from './../global/backgroundLocationTracking'
import * as TaskManager from 'expo-task-manager'
import * as BackgroundFetch from 'expo-background-fetch'

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
      var existsSync = tasks.some(
        t => t['taskName'] == BACKGROUND_SYNC_TASK_NAME)
      var existsTrack = tasks.some(
        t => t['taskName'] == BACKGROUND_TRACKING_TASK_NAME)
      setLocationTrackingInstalled(existsSync && existsTrack)
    })
  })

  return (
    <Provider value={locationTrackingInstalled}>
      {props.children}
    </Provider>
  )
}