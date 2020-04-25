import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { linkSize, linkColor } from '../styles/text'

const LinkText = props => <Text 
  {...props} 
  style={[styles.regularText, props.style]}
/>

export default LinkText


var styles = StyleSheet.create({
  regularText: {
    fontSize: linkSize,
    color: linkColor,
    textAlign: 'left',
    fontFamily: 'Avenir-Medium',
  }
})