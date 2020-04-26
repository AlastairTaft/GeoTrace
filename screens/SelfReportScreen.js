import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'

import Icon from "react-native-vector-icons/FontAwesome"

import Logo from "../components/Logo"
import HeaderText from "../components/HeaderText"
import Button from './../components/Button'
import EmphasizedText from "../components/EmphasizedText"

import { Consumer as UserStatusConsumer } from './../global/userStatus'
import * as centralAPI from './../global/centralAPI'
import { getDeviceId } from './../global/deviceId'

import { useHeaderHeight } from '@react-navigation/stack'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

export default ({ navigation: { goBack } }) => {

  const headerHeight = useHeaderHeight()

  // Stores the button selected - 0 = negative, 1 = positive, -1 = no button selected
  var [buttonSelected, setButtonSelected] = useState(-1)

  return (
    <View style={{marginTop: headerHeight}}>
      <View style={styles.container}>

          <View style={styles.logoContainer}>
            <Logo />
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
                <Text style={[styles.radioText, buttonSelected === 0 ? styles.radioTextActive : undefined]} adjustsFontSizeToFit={"yes"}>Negative</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.radioContainer]}>
              <TouchableOpacity onPress={() => setButtonSelected(1)} style={[styles.radio, buttonSelected === 1 ? styles.radioActive : undefined]}>
                <Text style={[styles.radioTextSmall, buttonSelected === 1 ? styles.radioTextActive : undefined]}>My result was</Text>
                <Text style={[styles.radioText, buttonSelected === 1 ? styles.radioTextActive : undefined]} adjustsFontSizeToFit={"yes"}>Positive</Text>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },

  logoContainer: {
  },

  headerText: {
    fontSize: SIZES.selfReportHeader,
    color: COLORS.altTintColor,
    textAlign: "left",
  },

  pinVerified: {
    color: COLORS.verified,
    fontSize: SIZES.verified,
    textAlign: "left",
    marginHorizontal: "5%",
    marginTop: "10%"
  },

  radioBoxContainer: {
    marginHorizontal: "5%",
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
    fontSize: SIZES.selfReportButton,
    fontWeight: "bold"
  },

  radioTextActive: {
    color: COLORS.radioActiveText
  },

  confirmContainer: {
    marginTop: 50,
    marginHorizontal: "5%"
  }
  
})
