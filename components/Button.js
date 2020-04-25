import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import COLORS from './../constants/Colors'
import { headerColor } from '../styles/text'

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: COLORS.altTintColor,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: headerColor,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.2,
  }, 
})

const Button = props => {

  return <TouchableOpacity 
    onPress={props.onPress}
    disabled={props.disabled} 
    style={[
      styles.button,
      props.disabled ? styles.disabled : undefined,
    ]}
  >
    <Text style={styles.text}>{props.title}</Text>
  </TouchableOpacity>
}

export default Button
