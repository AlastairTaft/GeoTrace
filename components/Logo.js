import React from "react"
import { StyleSheet, Text, View } from "react-native"

import COLORS from "../constants/Colors"
import SIZES from "../constants/Sizes"

const Logo = () => {
    return(
          <Text style={styles.container}>
            <Text style={styles.textThin}>Corona</Text> <Text style={styles.textBold}>Check</Text><Text style={styles.circle}>°</Text>
          </Text>
    )
}

export default Logo

const styles = StyleSheet.create({
  container: {
    marginHorizontal: "5%"
  },

  textThin: {
    fontFamily: 'Niveau-Grotesk',
    color: COLORS.logo,
    fontSize: SIZES.logo,
    letterSpacing: -1.6,
    textAlign: "left"
  },
  textBold: {
    fontFamily: 'Niveau-Grotesk',
    color: COLORS.logo,
    fontSize: SIZES.logo,
    textAlign: "left",
    letterSpacing: -0.31,
    fontWeight: "bold"
  },
  circle: {
    color: COLORS.logoTint,
    fontSize: SIZES.logo,
    letterSpacing: -1,
  }
})