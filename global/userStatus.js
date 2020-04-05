/**
 * @fileOverview This is a little cheat so we can fetch and store the infected 
 * status on the App root and not have to figure out / refactor how to pass it
 * down to our HomeScreen component and at the same time have the splash screen
 * shown while we're fetching.
 */
import { getDeviceId } from './deviceId'
import * as trackAPI from './trackAPI'

var getStatusResolver

/**
 * Get the user status
 * @returns {Promise<object>}
 */
export const getStatus = () => {
  if (getStatusResolver)
    return getStatusResolver
  return getDeviceId()
  .then(deviceId => trackAPI.getStatus(deviceId))
}
