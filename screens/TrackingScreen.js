import React from 'react'
import { View, StyleSheet } from 'react-native'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import './../global/saltAPI'

const TrackingScreen = props => {
  return <View style={styles.content}>
    <StyledText><HighlightText>No</HighlightText> exposure detected.
    </StyledText>
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

