import * as Sentry from 'sentry-expo'
import { Platform } from 'react-native'



if (__DEV__){
  var API_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/dev/'
    : 'http://localhost:3000/dev/'
} else { 
  var API_URL = 'https://api.geotrace.io/'
}
/**
 * Submits location data to the server
 * @param {string} deviceId
 * @param {string} riskPoints[0].hash
 * @param {number} riskPoints[0].timePassedSinceExposure
 * @returns {Promise}
 */
export const submitRiskMap = async function(deviceId, riskPoints){
  var response = await fetch(API_URL + 'submit-risk-map', {
    method: 'post',
    body: JSON.stringify({
      uniqueId: deviceId,
      hashes: riskPoints.map(rp => ({
        timePassedSinceExposure: rp.timePassedSinceExposure,
        hash: rp.hash,
      })),
    }),
  })
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to submit risk map.')
  }
  return result
}

/**
 * Report the user has been diagnosed with COVID-19.
 * @param {string} uniqueId
 * @param {number} code A code to validate the result came from a health 
 * authority
 * @returns {Promise}
 */
export const reportInfected = async function(uniqueId, code){
  var response = await fetch(API_URL + 'report-infected', {
    method: 'put',
    body: JSON.stringify({
      "uniqueId": uniqueId,
      "code": code,
    }),
  })
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to report user has been diagnosed with COVID-19.')
  }
  return result
}

/**
 * @typedef UserStatus
 * @property {boolean} infected True if the user has been diagnosed with 
 * COVID-19.
 * 
 * Get the user's status
 * @param {string} uniqueId
 * @returns {Promise<UserStatus>}
 */
export const getStatus = async function(uniqueId){
  var response = await fetch(`${API_URL}status?unique-id=${uniqueId}`)
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to get user status.')
  }
  return result
}