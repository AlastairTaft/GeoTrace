import * as Sentry from 'sentry-expo'
//const API_URL = 'https://au-tas-api.trackcovid19spread.com/'
const API_URL = 'http://localhost:3000/dev/'

/**
 * Submits location data to the server
 * @param {Array<GeoJSONFeature>} features
 * @returns {Promise}
 */
export const trackPositions = async function(features){
  var response = await fetch(API_URL + 'submit-location-history', {
    method: 'post',
    body: JSON.stringify({
      "type": "FeatureCollection",
      "features": features,
    }),
  })
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to track position.')
  }
  return result
}

/**
 * Get the list of points that the user was at risk.
 * @param {string} uniqueId
 * @returns {Promise<GeoJSONFeatureCollection>}
 */
export const getAtRiskHistoricPositions = async function(uniqueId){
  var response = await fetch(`
    ${API_URL}location-history
    ?unique-id=${uniqueId}
    &at-risk=true
  `.replace(/\s+/g, ''))
  var result = await response.json()
  if (response.status != 200){
    Sentry.captureMessage(JSON.stringify(result))
    throw new Error('Unable to retrieve historic data.')
  }
  return result
}

/**
 * Report the user has been diagnosed with COVID-19.
 * @param {string} uniqueId
 * @param {number} timestampShowingSymptoms
 * @returns {Promise}
 */
export const reportInfected = async function(uniqueId, timestampShowingSymptoms){
  var response = await fetch(API_URL + 'report-infected', {
    method: 'put',
    body: JSON.stringify({
      "uniqueId": uniqueId,
      "timestampShowingSymptoms": timestampShowingSymptoms,
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