import React from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from './../constants/Colors'
import SIZES from './../constants/Sizes'

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: COLORS.altTintColor,
    borderRadius: 10,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: SIZES.buttonFontSize,
    color: COLORS.altTextColor,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.2,
  },
})

const Button = props => {
  if (props.icon === undefined) {
    return(
      <TouchableOpacity 
        onPress={props.onPress}
        disabled={props.disabled} 
        style={[
          styles.button,
          props.disabled ? styles.disabled : undefined,
        ]}
      >
        <Text style={styles.text}>{props.title}</Text>
      </TouchableOpacity>
    );
  } else {
    return(
      <TouchableOpacity 
        onPress={props.onPress}
        disabled={props.disabled} 
        style={[
          styles.button,
          props.disabled ? styles.disabled : undefined,
        ]}
      >
        <Text style={styles.text}>{props.title} </Text><Icon name={props.icon} color={COLORS.altTextColor} size={SIZES.buttonFontSize} />
      </TouchableOpacity>
    );
  }
}

export default Button
