import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import { AsyncStorage } from 'react-native'
import './../global/saltAPI'

const TrackingScreen = props => {

  var [riskPoints, setRiskPoints] = useState(null)


  AsyncStorage.getItem('riskPoints').then(str => {
    //console.log('TrackingScreen#riskPoints', str)
    setRiskPoints(str.slice(0, 500))
  })

  return <View style={styles.content}>
    <StyledText><HighlightText>No</HighlightText> exposure detected.
    </StyledText>
    <ScrollView style={styles.testView}>
      <View>
        <Text>
          {riskPoints}
        </Text>
      </View>
    </ScrollView>
  </View>
}

export default TrackingScreen

const styles = StyleSheet.create({
  content: {
    paddingTop: 50,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: 'white',
    minHeight: '100%',
  }, 
  testView: {
    backgroundColor: 'orange',
  },
})

