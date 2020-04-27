import React from 'react'

import { StyleSheet, Text, View } from 'react-native'

import COLORS from "../constants/Colors"
import SIZES from "../constants/Sizes"

export const GuidePreventionScreen = props => {
  return (
    <View>
      <Text style={[styles.text, styles.emphasized]}>Wash your hands with soap and water often – for at least 20 seconds.</Text>
      <Text style={styles.text}>Wash your hands as soon as you get home.</Text>
      <Text style={styles.text}>Don’t touch your face if your hands are not clean.</Text>
      <Text style={styles.text}>To stop the spread of coronavirus, you should only leave the house for very limited purposes:</Text>
      <Text style={styles.text}>Shopping for basic necessities, for example food and medicine, which must be as infrequent as possible</Text>
      <Text style={styles.text}>One form of exercise a day, for example a run, walk, or cycle – alone or with members of your household</Text>
      <Text style={styles.text}>Any medical need, including to donate blood, avoid or escape risk of injury or harm, or to provide care or to help a vulnerable person travelling for work purposes, but only where you cannot work from home</Text>
      <Text style={styles.text}>These reasons are exceptions. Even when doing these activities, you should minimise time spent outside of the home and ensure you are 2 metres apart from anyone outside of your household.</Text>
      <Text style={styles.text}>Cover your mouth and nose with a tissue when you cough or sneeze</Text>
      <Text style={styles.text}>Put used tissues in the bin immediately and wash your hands</Text>
    </View>
  );
}

export default GuidePreventionScreen

const styles = StyleSheet.create({
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