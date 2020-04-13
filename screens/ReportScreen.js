import React, { useState, useEffect } from 'react'
import {  
  Text, 
  View, 
  TextInput,  
  StyleSheet,
} from 'react-native'
import COLORS from './../constants/Colors'
import { getDeviceId } from './../global/deviceId'
import * as trackAPI from './../global/trackAPI'
import ReportThankyouScreen from './ReportThankyouScreen'
import { Consumer as UserStatusConsumer } from './../global/userStatus'
import ReportInfectedScreen from './ReportInfectedScreen'

const ReportInfected = props => {


  var [infected, setInfected] = useState(false)


  if (infected)
    return <ReportThankyouScreen />

  return <UserStatusConsumer>
    {status => {
      // TODO Report 
      return <ReportInfectedScreen />
    }}
  </UserStatusConsumer>
}

export default ReportInfected

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  content: {
    marginTop: 40,
    marginLeft: 20,
    marginRight: 20,
  }, 
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 40,
    marginBottom: 40,
    paddingBottom: 30,
  },
  confirmCheckbox: {
  },
  confirmText: {
    paddingLeft: 20,
    paddingRight: 20,
    color: COLORS.warningText,
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    fontSize: 17,
    color: 'black',
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 3,
    width: 60,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  confirmContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  }
})
