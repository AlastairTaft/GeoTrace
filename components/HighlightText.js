import React from 'react'
import { StyleSheet, Text } from 'react-native'

const HighlightText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default HighlightText


var styles = StyleSheet.create({
  regularText: {
    fontSize: 17,
    color: '#627EEE',
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Niveau-Grotesk',
    fontWeight: 'bold',
  }
})
