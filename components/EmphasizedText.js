import React from 'react'
import { StyleSheet, Text } from 'react-native'

import SIZES from "../constants/Sizes"
import COLORS from "../constants/Colors"

const EmphasizedText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default EmphasizedText


var styles = StyleSheet.create({
  regularText: {
    fontSize: SIZES.emphasizedSize,
    color: COLORS.emphasizedColor,
    textAlign: 'center',
    fontFamily: 'Niveau-Grotesk',
    fontWeight: 'bold'
  }
})
