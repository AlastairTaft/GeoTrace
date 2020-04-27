import React from "react"

import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import { StyleSheet, Text, View } from "react-native"

import COLORS from "../constants/Colors"
import SIZES from "../constants/Sizes"

export const GuideAppScreen = props => {
  return (
    <View>
      <Text style={[styles.text, styles.emphasized]}><Text style={styles.textWorkaround}>l</Text><Icon name="numeric-1-circle" size={SIZES.guideText} color={COLORS.altTintColor} />If you have not been infected with COVID-19, the app will never upload your location data.</Text>
      <Text style={[styles.text]}><Text style={styles.textWorkaround}>l</Text><Icon name="numeric-2-circle" size={SIZES.guideText} color={COLORS.guideText} />If you have been infected with COVID-19, the app will anonymously upload a 14 day record of your movements. This data cannot be uniquely identified back to you.</Text>
      <Text style={[styles.text]}><Text style={styles.textWorkaround}>l</Text><Icon name="numeric-3-circle" size={SIZES.guideText} color={COLORS.guideText} />Using anonymous location data collected only from COVID-19 positive individuals, our algorithm generates a heat-map of COVID-19 exposure risk.</Text>
      <Text style={[styles.text]}><Text style={styles.textWorkaround}>l</Text><Icon name="numeric-4-circle" size={SIZES.guideText} color={COLORS.guideText} />Your phone will keep this heat-map updated in the background during the course of your day.</Text>
      <Text style={[styles.text]}><Text style={styles.textWorkaround}>l</Text><Icon name="numeric-5-circle" size={SIZES.guideText} color={COLORS.guideText} />If someone has tested positive near where you live, your phone can retroactively match the last 7 days of your anonymised location data with the latest results from the heat-map.</Text>
      <Text style={[styles.text]}><Text style={styles.textWorkaround}>l</Text><Icon name="numeric-6-circle" size={SIZES.guideText} color={COLORS.guideText} />You will be alerted if there is a match — indicating you may have been exposed — and guided though what steps to take next.</Text>
    </View>
  );
}

export default GuideAppScreen

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