import React from 'react'
import { StyleSheet, Text } from 'react-native'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

const HeaderText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default HeaderText


var styles = StyleSheet.create({
  regularText: {
    fontSize: SIZES.headerSize,
    color: COLORS.headerText,
    textAlign: 'center',
    fontFamily: 'Niveau-Grotesk',
    fontWeight: 'bold'
  }
})
