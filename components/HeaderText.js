import React from 'react'
import { StyleSheet, Text } from 'react-native'

const HeaderText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default HeaderText


var styles = StyleSheet.create({
  regularText: {
    fontSize: 26,
    color: '#627EEE',
    textAlign: 'center',
    fontFamily: 'Avenir-Medium',
    fontWeight: 'bold',
  }
})