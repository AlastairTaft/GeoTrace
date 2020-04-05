import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Svg, { Path } from 'react-native-svg'
import COLORS from './../constants/Colors'

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 3,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
  },
})

const CloseButton = props => {
  return <TouchableOpacity 
    onPress={props.onPress}
    style={[styles.container, props.style]}
  >
    <CrossIcon />
  </TouchableOpacity>
}

export default CloseButton

const CrossIcon = props => <Svg 
  viewBox="0 0 24 24" 
  fill={COLORS.altTintColor} 
  width="100%" 
  height="100%"
>
  <Path d="M0 0h24v24H0V0z" fill="none" />
  <Path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
</Svg>
