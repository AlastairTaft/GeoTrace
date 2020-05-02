import * as TaskManager from 'expo-task-manager'
import * as Crypto from 'expo-crypto'
import * as storage from './storage'
import * as saltAPI from './saltAPI'
import * as centralAPI from './centralAPI'
import { getDeviceId } from './deviceId'
import * as Sentry from 'sentry-expo'
import { createBackgroundSyncFunction } from './backgroundSyncUtil'

export const BACKGROUND_SYNC_TASK_NAME = 'COVID19_RISK_SYNC'

const backgroundTaskFunc = createBackgroundSyncFunction({
  popStoredRiskData: storage.popStoredRiskData,
  getSalts: saltAPI.getSalts,
  getDeviceId,
  submitRiskMap: centralAPI.submitRiskMap,
  onError: error => {
    if (__DEV__)
      console.error(error)
    Sentry.captureMessage(error)
  },
  hashFunction: str => Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    str,
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    },
  ),
  getStoredUserData: storage.getStoredUserData,
  setStoredUserData: storage.setStoredUserData,
  warnAtRisk: async () => {
    await Notifications.presentLocalNotificationAsync({
      title: 'Possible exposure detected.',
      body: 'This does not mean you are infected, but it is recommended you stay at home.',
      ios: {
        sound: true,
        _displayInForeground: true,
      }
    })
  },
})

TaskManager.defineTask(BACKGROUND_SYNC_TASK_NAME, backgroundTaskFunc)

