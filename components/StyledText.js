import React from 'react'
import { StyleSheet, Text } from 'react-native'

import COLORS from "../constants/Colors"

const StyledText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default StyledText


var styles = StyleSheet.create({
  regularText: {
    fontSize: 16,
    color: COLORS.headerText,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Niveau-Grotesk',
    fontWeight: 'bold',
  }
})
