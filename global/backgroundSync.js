import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import * as Crypto from 'expo-crypto'
import { popStoredRiskData } from './storage'
import * as saltAPI from './saltAPI'
import * as centralAPI from './centralAPI'
import { getDeviceId } from './deviceId'
import * as Sentry from 'sentry-expo'

export const BACKGROUND_SYNC_TASK_NAME = 'COVID19_RISK_SYNC'

const taskFunc = async () => {
  var riskPointsHash = await popStoredRiskData()
  /**
   * @type {Array<RiskDataPoint>}
   */
  var riskPoints = Object.values(riskPointsHash)
  if (!riskPoints.length)
    return BackgroundFetch.Result.NoData
  var finalHashes = []
  // Group risk points by pre salt hashes
  var saltGroups = groupBy(riskPoints, 'preSaltHash')
  await Promise.all(Object.keys(saltGroups).map(async preSaltHash => {
    // Grab the last few characters that we'll use to figure out a modulus and
    // get the salt
    var val = base64ToBase10(preSaltHash.slice(-8, -2))
    var saltServerUrl = saltAPI.SALT_SERVERS[val % saltAPI.SALT_SERVERS.length]
    var saltDtos = saltGroups[preSaltHash]
    var salts = await saltAPI.getSalts(saltServerUrl, saltDtos) 
    await Promise.all(saltDtos.map(async (dto, i) => {
      var { success, hash: salt, error } = salts[i]
      if (!success){
        Sentry.captureMessage(Sentry.captureMessage(error))
        return
      }
      var { timePassedSinceExposure, hash } = dto
      var saltedHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        hash + '-' + salt,
        {
          encoding: Crypto.CryptoEncoding.BASE64,
        },
      )
      finalHashes.push({ hash: saltedHash, timePassedSinceExposure })
    }))
  }))
  var deviceId = await getDeviceId()
  try {
    await centralAPI.submitRiskMap(deviceId, finalHashes)
    return BackgroundFetch.Result.NewData
  } catch (error) {
    if (__DEV__)
      console.error(error)
    Sentry.captureMessage(error)
    return BackgroundFetch.Result.Failed
  }
}

TaskManager.defineTask(BACKGROUND_SYNC_TASK_NAME, taskFunc);
taskFunc()

function groupBy(arr, key) {
  var obj = {}
  arr.forEach(a => {
    var val = a[key]
    obj[val] = obj[val] || []
    obj[val].push(a)
  })
  return obj
}


/**
 * Stolen with <3 from 
 * https://slavik.meltser.info/convert-base-10-to-base-64-and-vise-versa-using-javascript/
 * @param {string}
 * @return {number}
 */
function base64ToBase10(str) {
  var order = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-"
  var base = order.length
  var num = 0, r
  while (str.length) {
    r = order.indexOf(str.charAt(0))
    str = str.substr(1)
    num *= base
    num += r
  }
  return num
}


