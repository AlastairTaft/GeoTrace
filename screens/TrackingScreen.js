import React from 'react'
import { View, StyleSheet } from 'react-native'
import StyledText from './../components/StyledText'

const TrackingScreen = props => {
  return <View style={styles.content}>
    <StyledText>You have not crossed paths with with anyone who has self
      identified as having COVID-19.
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
})

