import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import Button from './../components/Button'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import CheckBox from './../components/CheckBox'
import DaysSelectControl from './../components/DaysSelectControl'

const ReportInfectedScreen = props => {


  var [confirmed, setConfirmed] = useState(false)
  var [days, setDays] = useState(0)

  var onReportInfected = () => {
    var showingSymptomsTime = new Date()
    showingSymptomsTime.setDate(showingSymptomsTime.getDate() - days)
    onReportInfectedToAPI(showingSymptomsTime.valueOf())
    setInfected(true)
  }

  return <View style={styles.container}>
    <View style={styles.explanationText}>
      <StyledText style={{fontSize: 20}}>
        Report: I have <HighlightText>COVID-19</HighlightText>
      
        {'\n'}{'\n'}
        Number of days since symptoms started showing.
      </StyledText>
    </View>
    <View style={styles.daysControlContainer}>
      <DaysSelectControl 
        value={days}
        onChange={setDays}
        height={400}
        style={{height: 400}}
      />
    </View>

    <View style={styles.confirmContainer}>
      <View style={styles.confirmCheckboxContainer}>
        <CheckBox 
          checked={confirmed}
          onPress={() => setConfirmed(!confirmed)}
          style={styles.confirmCheckbox}
        />
      </View>
      <View style={styles.confirmTextContainer}>
        <Text style={styles.confirmText}>
          I confirm that I have officially tested positive for COVID-19.
        </Text>
      </View>
    </View>

    <View style={styles.confirmButtonContainer}>
      
      <Button
        title="Confirm"
        disabled={!confirmed}
        onPress={onReportInfected}
      />
    </View>
  </View>
}

export default ReportInfectedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  explanationText: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    flexDirection: 'row',
  },
  daysControlContainer: {
    flex: 3,
  },
  confirmContainer: {
    flex: 0.7,
    flexDirection: 'row',
  },
  confirmButtonContainer: {
    flex: 0.8,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  confirmCheckboxContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmCheckbox: {
  },
  confirmTextContainer: {
    paddingRight: 20,
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmText: {
    color: '#3750B5',
    fontSize: 17,
    fontFamily: 'Avenir-Roman',
  },
}) 
