import { AsyncStorage } from 'react-native'
import { validateRiskDataPoint } from './risk'

/**
 * Returns a hash map of RiskDataPoint where the key is the hash.
 * @return {object}
 *//*
export const getStoredRiskData = async function(){
  const riskPointDTOsStr = await AsyncStorage.getItem('riskPoints')
  if (riskPointDTOsStr === null) return {}
  try {
    return JSON.parse(riskPointDTOsStr)
  } catch (err){
    // The only scenario ^ where it is acceptable to eat an error
    return {}
  }
}*/

/**
 * Pops all the stored risk data points as a hashmap, i.e. retrieves them and 
 * clears them from local storage.
 * @return {Promise<object>}
 *//*
export const popStoredRiskData = async function(){
  var data = await getStoredRiskData()
  await AsyncStorage.setItem('riskPoints',  JSON.stringify({}))
  return data
}*/


/**
 * Stores risk points in local storage, this operation is destructive it will
 * override any existing stored data points
 * @param {Array<RiskDataPoint>} riskPoints
 *//*
export const setStoredRiskData = async function(riskPoints){
  await AsyncStorage.setItem('riskPoints', JSON.stringify(riskPoints))
}*/

/**
 * Purges old data thats older than the purgeTimeout.
 * risk data must be in order of oldest to newest. 
 * @param {Array<RiskDataPoint>} riskData
 * @param {number} nowTimestamp a UNIX epoch of what the current time is
 * @param {number} purgeTimeout
 *//*
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
}*/

/**
 * Adds new risk points to existing stored risk points
 * @param {Array<RiskDataPoint>} newRiskPoints
 *//*
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
  riskPoints.forEach(rp => {
    validateRiskDataPoint(rp)
    newRiskPointsHash[rp.hash] = rp
  })
  await setStoredRiskData(newRiskPointsHash)
}*/

/**
 * Returns the status of the user
 * @return {object}
 */
export const getStoredUserData = async function(){
  const userStr = await AsyncStorage.getItem('user')
  if (userStr === null) return {}
  try {
    return JSON.parse(userStr)
  } catch (err){
    // The only scenario ^ where it is acceptable to eat an error
    return {}
  }
}

/**
 * Stores user data
 * @param {object} user
 */
export const setStoredUserData = async function(user){
  await AsyncStorage.setItem('user', JSON.stringify(user))
}

export const getStoredLocationData = async function(){
  var storedLocationsStr = await AsyncStorage.getItem('storedLocations')
  try {
    return JSON.parse(storedLocationsStr)
  } catch (err){
    return {}
  }
}

export const setStoredLocationData = async function(data){
  await AsyncStorage.setItem(
    'storedLocations',
    JSON.stringify(data),
  )
}