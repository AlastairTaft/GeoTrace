import React, { useState } from "react";
import { StyleSheet, TextInput, Alert } from "react-native";
import COLORS from '../constants/Colors'

const PinInput = props => {
  const { children, style } = props;

  function onChange(value) {
    const { onChangeText, onValidation } = props;

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
      {...props}
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
    marginHorizontal: "10%",
    marginTop: 22,
    textAlign: "center",
    fontSize: 27,
    fontWeight: "bold"
  }
})
