import { AsyncStorage } from 'react-native'
import { RELATIVE_EPOCH_START } from './constants'

/**
 * Returns a hash map of RiskDataPoint where the key is the hash.
 * @return {object}
 */
export const getStoredRiskData = async function(){
  const riskPointDTOsStr = await AsyncStorage.getItem('riskPoints')
  if (riskPointDTOsStr === null) return {}
  try {
    return JSON.parse(riskPointDTOsStr)
  } catch (err){
    // The only scenario ^ where it is acceptable to eat an error
    return {}
  }
}

/**
 * Pops all the stored risk data points as a hashmap, i.e. retrieves them and 
 * clears them from local storage.
 * @return {Promise<object>}
 */
export const popStoredRiskData = async function(){
  var data = await getStoredRiskData()
  await AsyncStorage.setItem('riskPoints',  JSON.stringify({}))
  return data
}


/**
 * Stores risk points in local storage, this operation is destructive it will
 * override any existing stored data points
 * @param {Array<RiskDataPoint>} riskPoints
 */
export const setStoredRiskData = async function(riskPoints){
  console.log('setStoredRiskData#riskPoints', riskPoints)
  await AsyncStorage.setItem('riskPoints', JSON.stringify(riskPoints))
}

/**
 * Purges old data thats older than the purgeTimeout.
 * risk data must be in order of oldest to newest. 
 * @param {Array<RiskDataPoint>} riskData
 * @param {number} nowTimestamp a UNIX epoch of what the current time is
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
 * @typedef RiskDataPoint
 * @property {string} hash The simple device location/time hash. 
 * @property {number} timePassedSinceExposure This is for future projecting, so 
 * when the user visits X location, this is the hash for the same location Y 
 * time in the future. So that if this user becomes infected, we know a risk
 * point for a point in time in the future at the same location. e.g. if this
 * user is likely to touch surfaces, someone who visits here later is at risk
 * @property {string} preSaltHash This is a hash of a 50 kilometer squared block
 * this location point is in. The idea is it is not specific enough to identify
 * any one person but it will be used to determine which salt server to ask for 
 * a salt from.
 * @property {number} timestamp Purely used locally to prune old data
 */

/**
 * Adds new risk points to existing stored risk points
 * @param {Array<RiskDataPoint>} newRiskPoints
 */
export const pushRiskPoints = async function(newRiskPoints){
  var existingRiskPointsHash = await getStoredRiskData()
  var existingRiskPoints = Object.values(existingRiskPointsHash)
  existingRiskPoints = purgeStaleRiskPoints(
    existingRiskPoints, 
    (new Date()).valueOf(), 
    // We'll keep only 1 hour 30 of data, salt servers will error if the data
    // is too stale
    1000 * 60 * 60 * 1.5,
  )
  var riskPoints = existingRiskPoints.concat(newRiskPoints)
  var newRiskPointsHash = {}
  riskPoints.forEach(rp => newRiskPointsHash[rp.hash] = rp)
  await setStoredRiskData(newRiskPointsHash)
}