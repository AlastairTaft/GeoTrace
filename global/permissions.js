import React, { useState, useEffect } from 'react'
import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'
import * as BackgroundFetch from 'expo-background-fetch'
import Constants from 'expo-constants'
import { Notifications } from 'expo'
import * as Sentry from 'sentry-expo'
import { Alert } from 'react-native'
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
  try {
    await Location.startLocationUpdatesAsync(BACKGROUND_TRACKING_TASK_NAME, options)
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK_NAME, {
      //minimumInterval: 1 * 60 * 60, // 1 hour 
      stopOnTerminate: false,
      startOnBoot: true,
    })
  } catch (err){
    Sentry.captureException(error)
    Alert.alert(
      "Error",
      "Unable to start background sync.",
      [
        { text: "OK" }
      ],
      { cancelable: false }
    )
    throw err
  }

  // We need to notify when there's possible exposure detected
  if (Constants.isDevice) {
    var { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') {
      var { status: status2 } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
      status = status2
    }
    if (status !== 'granted') {
      return false
    }
  } else {
    //alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.createChannelAndroidAsync('default', {
      name: 'default',
      sound: true,
      priority: 'max',
      vibrate: [0, 250, 250, 250],
    });
  }
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


