import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { emphasizedSize, emphasizedColor } from '../styles/text'

const EmphasizedText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default EmphasizedText


var styles = StyleSheet.create({
  regularText: {
    fontSize: emphasizedSize,
    color: emphasizedColor,
    textAlign: 'center',
    fontFamily: 'Niveau-Grotesk',
    fontWeight: 'bold',
  }
})
