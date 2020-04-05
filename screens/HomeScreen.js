import React, { useEffect, useState } from 'react'
import NotInfectedHomeScreen from './NotInfectedHomeScreen'
import InfectedHomeScreen from './InfectedHomeScreen'

export default function HomeScreen() {

  var [infected, setInfected] = useState(false)

  return infected ? 
    <InfectedHomeScreen /> : 
    <NotInfectedHomeScreen setInfected={setInfected} />
}

HomeScreen.navigationOptions = {
  header: null,
};
