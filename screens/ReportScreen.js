import React, { useState, useEffect } from 'react'
import {  
  Text, 
  View, 
  TextInput,  
  StyleSheet,
} from 'react-native'
import CheckBox from './../components/CheckBox'
import COLORS from './../constants/Colors'
import Button from './../components/Button'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import { getDeviceId } from './../global/deviceId'
import * as trackAPI from './../global/trackAPI'
import ReportThankyouScreen from './ReportThankyouScreen'

import { getStatus } from './../global/userStatus'

var onReportInfectedToAPI = async (timestampShowingSymptoms) => {
  var uniqueId = await getDeviceId()
  await trackAPI.reportInfected(uniqueId, timestampShowingSymptoms) 
}

const ReportInfected = props => {
  var [confirmed, setConfirmed] = useState(false)
  var [daysStr, setDaysStr] = useState('')
  var days = daysStr === '' ? Number('NaN') : Number(daysStr)


  var [infected, setInfected] = useState(false)
  var [status, setStatus] = useState(null)

  useEffect(() => {
    getStatus()
    .then(status => {
      setInfected(status.infected)
      setStatus(status)
    })
  })

  var onReportInfected = () => {
    var showingSymptomsTime = new Date()
    showingSymptomsTime.setDate(showingSymptomsTime.getDate() - days)
    onReportInfectedToAPI(showingSymptomsTime.valueOf())
    setInfected(true)
  }

  console.log('ReportInfected#infected', infected)
  if (infected)
    return <ReportThankyouScreen />

  return <View style={styles.container}>
    <View style={styles.content}>
      <StyledText>Report: I have <HighlightText>COVID-19</HighlightText></StyledText>
      <Text />
      <StyledText>Number of days since symptoms started showing.</StyledText>
      
      <TextInput  
        placeholder="Days"   
        keyboardType="numeric"
        style={styles.input}
        value={daysStr}
        onChangeText={value => setDaysStr(value)}
      />  

      <View style={styles.confirmContainer}>
        <CheckBox 
          checked={confirmed}
          onPress={() => setConfirmed(!confirmed)}
          style={styles.confirmCheckbox}
        />
        <Text style={styles.confirmText}>
          I acknowledge that I have officially tested positive for COVID-19. 
          By tapping 'Confirm' I will be helping others avoid infection and I will no
          longer receive notifications.
        </Text>
      </View>

      <Button
        title="Confirm"
        disabled={!confirmed || !Number.isInteger(days) || days < 0}
        onPress={onReportInfected}
      />
    </View>

    

  </View>
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
