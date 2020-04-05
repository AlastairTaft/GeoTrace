import React, { useState, useEffect } from 'react'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import { BACKGROUND_TRACKING_TASK_NAME } from './../global/backgroundLocationTracking'

const PermissionsContext = React.createContext()

export const { Provider, Consumer } = PermissionsContext

/**
 * Ask the user for location permission to do background tracking.
 */
const askRequiredPermissions = async () => {
  var result = await Permissions.askAsync(Permissions.LOCATION)
  if (!result.granted){
    return false
  }
  const options = {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 10,
    timeInterval: 5 * 60000, // 5 minute
    mayShowUserSettingsDialog: false,
    activityType: Location.ActivityType.Fitness,
  }
  await Location.startLocationUpdatesAsync(BACKGROUND_TRACKING_TASK_NAME, options)
}

/**
 * Askes for background tracking location permission and passes a boolean down 
 * through the context on whether the user has given the required permissions.
 */
export var PermissionsWrapper = props => {
  
  var [hasPermissions, setHasPermissions] = useState()

  useEffect(() => {
    askRequiredPermissions()
    .then(ok => {
      if (ok === false)
        setHasPermissions(false)
      else
        setHasPermissions(true)
    })
  })

  return (
    <Provider value={hasPermissions}>
      {props.children}
    </Provider>
  )
}


