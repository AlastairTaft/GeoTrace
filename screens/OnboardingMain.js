import React from "react"
import { Dimensions, Image, ImageBackground, StyleSheet, View } from "react-native"

import Button from "./../components/Button"

import COLORS from "./../constants/Colors"
import Images from "../constants/Images"

/* 
NAVIGATION FLOW:
  - OnboardingMain
  - OnboardingHeader
  - OnboardingPermissions
*/

const deviceWidth = Dimensions.get("screen").width;

export default function OnboardingMain(props) {
  return(
    <View style={styles.container}>
      <ImageBackground source={Images.HomeBackground} style={Images.BackgroundStyle}>
        <View style={styles.contentContainer}>
          <Image source={Images.LogoFull} style={styles.logo} resizeMode={"contain"} />
          <View style={styles.buttonContainer}>
            <Button title="Next" onPress={() => props.navigation.navigate("OnboardingHeader")} />
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

  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    marginHorizontal: "5%"
  },

  logo: {
    height: deviceWidth * 0.8,
    width: deviceWidth * 0.8,
    marginHorizontal: "5%"
  },

  buttonContainer: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    paddingHorizontal: "7%"
  }
});
