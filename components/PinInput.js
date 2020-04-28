import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import COLORS from '../constants/Colors'

const PinInput = props => {
  const { children, style, onChangeText, onValidation, ...otherProps } = props;

  function onChange(value) {
    onValidation && onValidation(value.match(/^[0-9]{4}-[0-9]{4}-[0-9]{4}/g));
    onChangeText && onChangeText(value);
  }

  return (
    <TextInput
      style={[styles.textInputPin, style]}
      placeholder="3423-3234-3256"
      autoCorrect={false}
      autoCompleteType={"off"}
      onChangeText={value => onChange(value)}
      maxLength={14}
      {...otherProps}
    >
      {children}
    </TextInput>
  );
}

export default PinInput

const styles = StyleSheet.create({
  textInputPin: {
    borderRadius: 10,
    backgroundColor: COLORS.textInputBackground,
    height: 65,
    textAlign: "center",
    fontSize: 27,
    fontWeight: "bold"
  }
})
