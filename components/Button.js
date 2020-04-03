import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#4896ec',
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
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
