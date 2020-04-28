import React, { useState, useEffect } from 'react'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import * as BackgroundFetch from 'expo-background-fetch'
import { BACKGROUND_TRACKING_TASK_NAME } from './../global/backgroundLocationTracking'
import { BACKGROUND_SYNC_TASK_NAME } from './../global/backgroundSync'

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
  await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK_NAME, {
    minimumInterval: 1 * 60 * 60, // 1 hour 
    stopOnTerminate: false,
    startOnBoot: true,
  })
}

export async function hasPermission() {
  let hasPermissions
  await askRequiredPermissions().then(status => {
    hasPermissions = status
  })
  return hasPermissions
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


/*
  Permission status:
    - -1: blocked
    -  0: denied
    -  1: granted
*/
export async function LocationPermissionStatus() {
  const { status, canAskAgain } = await Permissions.getAsync(Permissions.LOCATION)
  if (status === "granted") {
    return 1
  } else if (canAskAgain) {
    return 0
  } else {
    return -1
  }
}

export async function NotificationsPermissionStatus() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
  if (status === "granted") {
    return 1
  } else if (canAskAgain) {
    return 2
  } else {
    return -1
  }
}

// Not implemented yet
export async function BluetoothPermissionStatus() {
  return 1
}

export async function GetAllPermissionStatus() {
  const status = await Promise.all([
    LocationPermissionStatus(),
    NotificationsPermissionStatus(),
    BluetoothPermissionStatus()
  ])
  return status
}


export async function GetLocationPermission() {
  const { status, canAskAgain } = await Permissions.askAsync(Permissions.LOCATION)
  if (status === "granted") {
    return 1
  } else if (canAskAgain) {
    return 2
  } else {
    return -1
  }
}

export async function GetNotificationsPermission() {
  const { status, canAskAgain } = await Permissions.askAsync(Permissions.NOTIFICATIONS, Permissions.USER_FACING_NOTIFICATIONS)
  if (status === "granted") {
    return 1
  } else if (canAskAgain) {
    return 2
  } else {
    return -1
  }
}

// TODO: NOT IMPLEMENTED YET
export async function GetBluetoothPermission() {
  return 1
}