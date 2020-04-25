import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { headerSize, headerColor } from '../styles/text'

const HeaderText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default HeaderText


var styles = StyleSheet.create({
  regularText: {
    fontSize: headerSize,
    color: headerColor,
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
    fontWeight: 'bold',
  }
})