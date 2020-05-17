import * as TaskManager from 'expo-task-manager'
import * as Sentry from 'sentry-expo'
import * as Crypto from 'expo-crypto'
import { AsyncStorage } from 'react-native'
import './bugTracking'
import { getStoredLocationData, setStoredLocationData } from './storage'
import { hashRiskPoint, getRiskPoints } from './risk'
import { createBackgroundTrackFunction } from './backgroundLocationUtil'

export const BACKGROUND_TRACKING_TASK_NAME = 'COVID19_LOCATION_TRACKING'

var backgroundLocationTrackFunc = async (...args) => {
  // Handle the reading and writing to storage in bulk to avoid any race
  // conditions and prevent complicating the core logic
  var storedLocations = await getStoredLocationData()
  var func = createBackgroundTrackFunction({
    getStoredLocation: key => storedLocations[key],
    setStoredLocation: (key, value) => storedLocations[key] = value,
    timeBlockSize: 1000 * 60 * 5,
    onError: error => {
      if (__DEV__)
        console.error(error)
      Sentry.captureMessage(error)
    },
  })
  await func(...args)
  await setStoredLocationData(storedLocations)
}

TaskManager.defineTask(
  BACKGROUND_TRACKING_TASK_NAME, 
  backgroundLocationTrackFunc,
)


    /*onError: Sentry.captureException,
    setItem: AsyncStorage.setItem,
    getItem: AsyncStorage.getItem,
    hashFunction: str => Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      str,
      {
        encoding: Crypto.CryptoEncoding.BASE64,
      }
    ),
    hashRiskPoint,
    pushRiskPoints,
    getRiskPoints,*/