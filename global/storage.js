import { AsyncStorage } from 'react-native'
import { RELATIVE_EPOCH_START } from './constants'

export const getStoredRiskData = async function(){
  const riskPointDTOsStr = await AsyncStorage.getItem('riskPoints')
  const riskPointDTOs = JSON.parse(riskPointDTOsStr)
  return riskPointDTOs
}


/**
 * @param {number} riskData[0].timestamp
 * @param {object} riskData[0].riskPoint
 */
export const setStoredRiskData = async function(riskData){
  await AsyncStorage.setItem('riskPoints', JSON.stringify(riskData))
}

/**
 * Purges old data thats older than the purgeTimeout.
 * risk data must be in order of oldest to newest.
 * @param {number} riskData[0].timestamp
 * @param {object} riskData[0].riskPoint
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
export const addRiskPoints = function(riskPoints){

}