import React from 'react'
import { StyleSheet, Text } from 'react-native'

const StyledText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default StyledText


var styles = StyleSheet.create({
  regularText: {
    fontSize: 16,
    color: '#172150',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
    fontWeight: 'bold',
  }
})