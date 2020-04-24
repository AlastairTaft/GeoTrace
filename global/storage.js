import { AsyncStorage } from 'react-native'
import { RELATIVE_EPOCH_START } from './constants'

export const getStoredRiskData = async function(){
  const riskPointDTOsStr = await AsyncStorage.getItem('riskPoints')
  if (riskPointDTOsStr === null) return []
  try {
    return JSON.parse(riskPointDTOsStr)
  } catch (err){
    // The only scenario ^ where it is acceptable to eat an error
    return []
  }
}

export const popStoredRiskData = async function(){
  var data = await getStoredRiskData()
  await AsyncStorage.setItem('riskPoints',  JSON.stringify([]))
  return data
}


/**
 * @param {object} riskPoints[0].preSaltHash
 * @param {object} riskPoints[0].hashedRiskPoints
 * @param {string} riskPoints[0].hashedRiskPoints[0].hash
 * @param {number} riskPoints[0].hashedRiskPoints[0].timePassedSinceExposure     
 * @param {object} riskPoints[0].timestamp
 */
export const setStoredRiskData = async function(riskPoints){
  await AsyncStorage.setItem('riskPoints', JSON.stringify(riskPoints))
}

/**
 * Purges old data thats older than the purgeTimeout.
 * risk data must be in order of oldest to newest.
 * @param {number} riskData[0].timestamp
 * @param {number} nowTimestamp
 * @param {number} purgeTimeout
 */
export const purgeStaleRiskPoints = function(
  riskData, 
  nowTimestamp, 
  purgeTimeout,
){
  while (riskData.length){
    var { timestamp } = riskData.slice(0, 1)[0]
    if (timestamp < (nowTimestamp - purgeTimeout))
      riskData = riskData.slice(1)
    else
      break;
  }
  return riskData
}

/**
 * Adds new risk points to existing stored risk points
 * @param {object} newRiskPoints[0].preSaltHash
 * @param {object} newRiskPoints[0].hashedRiskPoints
 * @param {string} newRiskPoints[0].hashedRiskPoints[0].hash
 * @param {number} newRiskPoints[0].hashedRiskPoints[0].timePassedSinceExposure     
 * @param {object} newRiskPoints[0].timestamp
 */
export const pushRiskPoints = async function(newRiskPoints){
  var existingRiskPoints = await getStoredRiskData()
  var now = (new Date()).valueOf() - RELATIVE_EPOCH_START
  existingRiskPoints = purgeStaleRiskPoints(
    existingRiskPoints, 
    now, 
    // We'll keep only up to 14 days of data locally
    1000 * 60 * 60 * 24 * 14,
  )
  var riskPoints = existingRiskPoints.concat(newRiskPoints)
  await setStoredRiskData(riskPoints)
}