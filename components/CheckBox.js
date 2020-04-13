import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Svg, { Path } from 'react-native-svg'

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderRadius: 7,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#3750B5',
    borderStyle: 'solid',
    backgroundColor: '#E7EBFF',
  },
})

const CheckBox = props => {
  return <TouchableOpacity 
    onPress={props.onPress}
    style={[styles.container, props.style]}
  >
    {props.checked ? <CheckIcon /> : null}
  </TouchableOpacity>
}

export default CheckBox


const CheckIcon = () => <Svg 
  viewBox="0 0 24 24" 
  fill="black" 
  width="100%" height="100%"
>
  <Path d="M0 0h24v24H0V0z" fill="none" />
  <Path d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z" />
</Svg>