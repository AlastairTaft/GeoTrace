import React, { useState } from 'react'
import { Image, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native'

import Icon from "react-native-vector-icons/FontAwesome"
import { useHeaderHeight } from '@react-navigation/stack'

import HeaderText from "../components/HeaderText"
import Button from './../components/Button'
import EmphasizedText from "../components/EmphasizedText"
import AdjustableText from "../components/AdjustableText"

import { Consumer as UserStatusConsumer } from './../global/userStatus'
import * as centralAPI from './../global/centralAPI'
import { getDeviceId } from './../global/deviceId'

import SIZES from "./../constants/Sizes"
import COLORS from "./../constants/Colors"
import IMAGES from "./../constants/Images"
import { DefaultMargin } from "./../constants/Layout"

const ratio = 1149/157
const imageHeight = 36

export default ({ navigation: { goBack } }) => {

  const headerHeight = useHeaderHeight()

  // Stores the button selected - 0 = negative, 1 = positive, -1 = no button selected
  var [buttonSelected, setButtonSelected] = useState(-1)

  return (
    <ImageBackground source={IMAGES.Background} style={IMAGES.BackgroundStyle}>
      <View style={{marginTop: headerHeight}}>
        <View style={styles.container}>

            <View style={styles.logoContainer}>
              <Image source={IMAGES.LogoText} resizeMode={"cover"} resizeMethod={"resize"} style={styles.logoStyle} />
            </View>

            <HeaderText style={styles.headerText}>
              Self-Reporting
            </HeaderText>

            <EmphasizedText style={styles.pinVerified}>
              Your PIN has been verified <Icon name="certificate" color={COLORS.verified} size={SIZES.verified} />
            </EmphasizedText>
            
            <View style={styles.radioBoxContainer}>
              <View style={styles.radioContainer}>
                <TouchableOpacity onPress={() => setButtonSelected(0)} style={[styles.radio, buttonSelected === 0 ? styles.radioActive : undefined]}>
                  <Text style={[styles.radioTextSmall, buttonSelected === 0 ? styles.radioTextActive : undefined]}>My result was</Text>
                  <AdjustableText style={[styles.radioText, buttonSelected === 0 ? styles.radioTextActive : undefined]} fontSize={SIZES.selfReportButton} numberOfLines={1}>Negative</AdjustableText>
                </TouchableOpacity>
              </View>
              <View style={[styles.radioContainer]}>
                <TouchableOpacity onPress={() => setButtonSelected(1)} style={[styles.radio, buttonSelected === 1 ? styles.radioActive : undefined]}>
                  <Text style={[styles.radioTextSmall, buttonSelected === 1 ? styles.radioTextActive : undefined]}>My result was</Text>
                  <AdjustableText style={[styles.radioText, buttonSelected === 1 ? styles.radioTextActive : undefined]} fontSize={SIZES.selfReportButton} numberOfLines={1}>Positive</AdjustableText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.confirmContainer}>
              <Button
                disabled={buttonSelected === -1}
                title="Confirm"
                // TODO: hook up confirm function (code needs to be sent to the server)
                onPress={() => {console.warn("Hook me up!")}}
              />
            </View>

        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginHorizontal: DefaultMargin,
    marginTop: 20
  },

  logoContainer: {
    marginBottom: "5%"
  },

  logoStyle: {
    height: imageHeight,
    width: imageHeight * ratio
  },

  headerText: {
    fontSize: SIZES.selfReportHeader,
    color: COLORS.altTintColor,
    textAlign: "left"
  },

  pinVerified: {
    color: COLORS.verified,
    fontSize: SIZES.verified,
    textAlign: "left",
    marginTop: "10%"
  },

  radioBoxContainer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-between"
  },

  radioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 145
  },

  radio: {
    paddingVertical: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: COLORS.radioInactive,
    width: "95%",
    height: "100%",
    borderRadius: 10
  },

  radioActive: {
    backgroundColor: COLORS.altTintColor
  },

  radioTextSmall: {
    color: COLORS.radioInactiveText,
    textAlign: "center",
    fontSize: SIZES.selfReportButtonSmall
  },

  radioText: {
    color: COLORS.radioInactiveText,
    textAlign: "center",
    
    fontWeight: "bold"
  },

  radioTextActive: {
    color: COLORS.radioActiveText
  },

  confirmContainer: {
    marginTop: 50
  }
  
})
