import React, { useEffect, useState } from 'react'
import NotInfectedHomeScreen from './NotInfectedHomeScreen'
import InfectedHomeScreen from './InfectedHomeScreen'
import { getStatus } from './../global/userStatus'

export default function HomeScreen() {

  var [infected, setInfected] = useState(false)
  var [status, setStatus] = useState(null)

  useEffect(() => {
    getStatus()
    .then(status => {
      setInfected(status.infected)
      setStatus(status)
    })
  })

  if (status === null)
    return null

  return infected ? 
    <InfectedHomeScreen /> : 
    <NotInfectedHomeScreen setInfected={setInfected} />
}

HomeScreen.navigationOptions = {
  header: null,
};
