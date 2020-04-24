/**
 * @fileOverview This is a little cheat so we can fetch and store the infected 
 * status on the App root and not have to figure out / refactor how to pass it
 * down to our HomeScreen component and at the same time have the splash screen
 * shown while we're fetching.
 */
import React, { useState, useEffect } from 'react'
import { getDeviceId } from './deviceId'
import * as trackAPI from './centralAPI'

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

var reportInfected = async (code) => {
  var uniqueId = await getDeviceId()
  await trackAPI.reportInfected(uniqueId, code) 
}

const PermissionsContext = React.createContext()

export const { Provider, Consumer } = PermissionsContext

/**
 * Askes for background tracking location permission and passes a boolean down 
 * through the context on whether the user has given the required permissions.
 */
export var UserStatusWrapper = props => {
  
  var [status, setStatus] = useState(null)
  useEffect(() => {
    getStatus()
    .then(status => {
      status = {
        ...status,
        reportInfected: (...args) => {
          setStatus({
            ...status,
            infected: true,
          })
          return reportInfected(...args)
        }
      }
      setStatus(status)
    })
  }, [])

  return (
    <Provider value={status}>
      {props.children}
    </Provider>
  )
}
