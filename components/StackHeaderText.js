import React from 'react'
import { StyleSheet, Text } from 'react-native'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

const StackHeaderText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default StackHeaderText


var styles = StyleSheet.create({
  regularText: {
    fontSize: SIZES.stackHeaderSize,
    color: COLORS.altTintColor,
    textAlign: 'left',
    fontFamily: 'Niveau-Grotesk',
    fontWeight: 'bold',
    marginHorizontal: 20
  }
})
