import { AsyncStorage } from 'react-native'

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
    return JSON.parse(storedLocationsStr) || {}
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