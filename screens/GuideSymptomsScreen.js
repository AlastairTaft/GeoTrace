import React from "react"

import { StyleSheet, Text, View } from "react-native"

import COLORS from "../constants/Colors"
import SIZES from "../constants/Sizes"

export const GuideSymptomsScreen = props => {
  return (
    <View>
      <Text style={[styles.text, styles.emphasized]}>The main symptoms of coronavirus (COVID-19) are a high temperature and a new, continuous cough.</Text>
      <Text style={styles.text}>A high temperature – this means you feel hot to touch on your chest or back (you do not need to measure your temperature)</Text>
      <Text style={styles.text}>A new, continuous cough – this means coughing a lot for more than an hour, or 3 or more coughing episodes in 24 hours (if you usually have a cough, it may be worse than usual)</Text>
      <Text style={styles.text}>To protect others, do not go to places like a GP surgery, pharmacy or hospital if you have these symptoms. Stay at home.</Text>
    </View>
  );
}

export default GuideSymptomsScreen

const styles = StyleSheet.create({
  textWorkaround: {
    color: "transparent"
  },
  text: {
    fontSize: SIZES.guideText,
    color: COLORS.guideText,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 10
  },
  emphasized: {
    color: COLORS.altTintColor
  }
})