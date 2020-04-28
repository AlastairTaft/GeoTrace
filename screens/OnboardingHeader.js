import React from "react"
import { ImageBackground, StyleSheet, View } from "react-native"

import Button from "./../components/Button"
import HeaderText from "./../components/HeaderText"
import HeaderStyle from "../styles/HeaderStyleOnboarding"

import COLORS from "./../constants/Colors"
import Images from "../constants/Images"

export default function OnboardingHeader(props) {
  return(
    <View style={styles.container}>
      <ImageBackground source={Images.HomeBackground} style={Images.BackgroundStyle}>
        <View style={styles.contentContainer}>
          <HeaderText style={HeaderStyle}>
            Get notified if you may have come into contact with COVID-19.
          </HeaderText>
          <View style={styles.buttonContainer}>
            <Button title="Next" onPress={() => props.navigation.navigate("OnboardingPermissions")} />
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.appBackground,
  },

  headerStyle: {
    marginHorizontal: "0%"
  },

  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    marginHorizontal: "7%"
  },

  buttonContainer: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    paddingHorizontal: "7%"
  }
});
