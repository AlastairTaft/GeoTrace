import * as Sentry from 'sentry-expo'

if (__DEV__)
  var API_URL = 'http://localhost:3000/dev/'
else 
  var API_URL = 'https://au-tas-api.trackcovid19spread.com/'

/**
 * Submits location data to the server
 * @param {string} deviceId
 * @param {string} riskPoints[0].hash
 * @param {number} riskPoints[0].timePassedSinceExposure
 * @returns {Promise}
 */
export const submitRiskMap = async function(deviceId, riskPoints){
  console.log('submitRiskMap#riskPoints', riskPoints)
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
 * @returns {Promise}
 */
export const reportInfected = async function(uniqueId, code) {
  await new Promise(accept => setTimeout(() => accept(), 5000))

 // TODO

  return true
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

/**
 * Check if the analysis report is genuine.
 * @param {number} code A code to validate the result came from a health authority
 * @returns {Promise}
 */
export const checkAnalysisReport = async (code) => {
  const response = await fetch(`${API_URL}check-analysis-report?uuid=${code}`)
  const result = await response.json()
  if (response.status !== 200) {
    throw new Error('Unable to check the analysis report.')
  }
  return result
}
