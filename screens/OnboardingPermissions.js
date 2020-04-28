import React, { useState } from "react"
import { AsyncStorage, ImageBackground, StyleSheet, View } from "react-native"

import Button from "./../components/Button"
import HeaderText from "./../components/HeaderText"
import EmphasizedText from "./../components/EmphasizedText"
import PermissionIndicator from "./../components/PermissionIndicator"

import HeaderStyleOnboarding from "./../styles/HeaderStyleOnboarding"
import EmphasizedStyleOnboarding from "./../styles/EmphasizedStyleOnboarding"

import { GetAllPermissionStatus, GetLocationPermission, GetNotificationsPermission, GetBluetoothPermission } from "./../global/permissions"

import COLORS from "./../constants/Colors"
import Images from "./../constants/Images"
import { DefaultMargin } from "./../constants/Layout"

// WARNING! BLUETOOTH PERMISSION REQUEST NOT IMPLEMENTED YET

export default function OnboardingPermissions(props) {
  /*
  Permission status:
    - -1: blocked
    -  0: didn't ask
    -  1: granted
    -  2: denied
  */
  var [locationPermissionStatus, setLocationPermissionStatus] = useState(0)
  var [notificationsPermissionStatus, setNotificationsPermissionStatus] = useState(0)
  var [bluetoothPermissionStatus, setBluetoothPermissionStatus] = useState(0)

  GetAllPermissionStatus().then((result) => {
    setLocationPermissionStatus(result[0])
    setNotificationsPermissionStatus(result[1])
    setBluetoothPermissionStatus(result[2])
  })

  function progress() {
    if (locationPermissionStatus === 0) {
      GetLocationPermission().then((result) => {
        setLocationPermissionStatus(result)
      })
    } else if (notificationsPermissionStatus === 0) {
      GetNotificationsPermission().then((result) => {
        setNotificationsPermissionStatus(result)
      })
    } else if (bluetoothPermissionStatus === 0) {
      GetBluetoothPermission().then((result) => {
        setBluetoothPermissionStatus(result)
      })
    } else {
        AsyncStorage.setItem("firstRun", "false").then(() => props.navigation.navigate("Main")).catch(() => console.log("Error saving data"))
    }
  }

  return(
    <View style={styles.container}>
      <ImageBackground source={Images.HomeBackground} style={Images.BackgroundStyle}>

        <View style={styles.contentContainer}>

          <HeaderText style={HeaderStyleOnboarding}>
            To protect you, I will need to save your location
          </HeaderText>

          <EmphasizedText style={EmphasizedStyleOnboarding}>
          Don’t worry — information never leaves your phone unless you explicitly decide to share.
          </EmphasizedText>

          <View style={styles.permissionContainer}>
            <PermissionIndicator title="Location permission" status={locationPermissionStatus} />
            <PermissionIndicator title="Allow notifications" status={notificationsPermissionStatus} />
            {/* Not implemented yet */}
            {/* <PermissionIndicator title="Bluetooth access" status={0} /> */}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title={
                locationPermissionStatus === 0 ? "Enable location":
                notificationsPermissionStatus === 0 ? "Enable notifications":
                bluetoothPermissionStatus === 0 ? "Enable bluetooth":
                "Next"
              }
              onPress={() => progress()}
            />
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
  },

  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
    marginHorizontal: DefaultMargin
  },

  permissionContainer: {
    width: "100%",
    marginTop: 40
  },

  buttonContainer: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    paddingHorizontal: "7%"
  }
});
