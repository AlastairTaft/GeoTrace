import React from 'react'
import { StyleSheet, Text } from 'react-native'

const StyledText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default StyledText


var styles = StyleSheet.create({
  regularText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  }
})