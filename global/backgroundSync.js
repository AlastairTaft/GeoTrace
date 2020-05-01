import * as TaskManager from 'expo-task-manager'
import * as Crypto from 'expo-crypto'
import { popStoredRiskData } from './storage'
import * as saltAPI from './saltAPI'
import * as centralAPI from './centralAPI'
import { getDeviceId } from './deviceId'
import * as Sentry from 'sentry-expo'
import { createBackgroundSyncFunction } from './backgroundSyncUtil'

export const BACKGROUND_SYNC_TASK_NAME = 'COVID19_RISK_SYNC'

const backgroundTaskFunc = createBackgroundSyncFunction({
  popStoredRiskData,
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
  )
})

TaskManager.defineTask(BACKGROUND_SYNC_TASK_NAME, backgroundTaskFunc)
backgroundTaskFunc()

