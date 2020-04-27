import React, { Fragment } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { ImageBackground, StyleSheet, View} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import * as Updates from 'expo-updates'

import { Consumer as PermissionsConsumer, HasPermissions } from './../global/permissions'

import Button from './../components/Button'
import HeaderText from './../components/HeaderText'
import EmphasizedText from './../components/EmphasizedText'

import { Consumer as BackgroundTrackingConsumer } from './BackgroundScriptWrapper'

import COLORS from './../constants/Colors'
import SIZES from './../constants/Sizes'
import IMAGES from '../constants/Images'

export default function HomeScreen() {

  // Figure out which variant of home screen to show
  const HomeScreenStyle = () => {
    // TODO: logic to detect if a person is infected/exposed
    // TODO: logic to detect if we have enough info
    let hasEnoughInfo = true
    let isPossibleExposure = false
    let isInfected = false
    if (isInfected) {
      return (
        <View style={styles.contentContainer}>
          <View>
            <Icon name="verified-user" color={COLORS.headerText} size={SIZES.headerSize} />
          </View>
          <HeaderText style={styles.headerText}>
            You are a hero
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            Your anonymous location data will help prevent further spread.
          </EmphasizedText>
          <EmphasizedText style={styles.emphasized}>
            Your kindness will save lives. Thank you for protecting your family, friends and neighbours. 
          </EmphasizedText>
        </View>
      )
    }

    if (!hasEnoughInfo) {
      return (
        <View style={styles.contentContainer}>
          <View>
            <Icon name="help" color={COLORS.unknownColor} size={SIZES.headerSize} />
          </View>
          <HeaderText style={styles.unknownHeader}>
            Not enough data
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            You do not have enough location data to detect exposure.
          </EmphasizedText>
          <View style={styles.buttonContainer}>
            <Button title="Import past locations" style={styles.buttonContainer} />
          </View>
        </View>
      )
    }

    if (isPossibleExposure) {
      return (
        <View style={styles.contentContainer}>
          <View>
            <Icon name="flare" color={COLORS.warningText} size={SIZES.headerSize} />
          </View>
          <HeaderText style={styles.warningHeader}>
            Possible exposure detected
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            Based on available location data, you may have come into contact with COVID-19.
          </EmphasizedText>
          <View style={styles.buttonContainer}>
            <Button title="Next steps" style={styles.buttonContainer} icon="keyboard-arrow-right" />
          </View>
        </View>
      )
    }

    if (HasPermissions()) {
      return (
        <View style={styles.contentContainer}>
          <View>
            <Icon name="verified-user" color={COLORS.headerText} size={SIZES.headerSize} />
          </View>
          <HeaderText>
            No exposure detected
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            Based on available location data, you have not been in contact with COVID-19.
          </EmphasizedText>
        </View>
      )
    } else {
      return (
        <View style={styles.contentContainer}>
          <View>
            <Icon name="error" color={COLORS.errorText} size={SIZES.headerSize} />
          </View>
          <HeaderText style={styles.errorHeader}>
            Unknown
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            I can’t tell if you’ve been in contact unless you enable the app to access your location.
          </EmphasizedText>
          <View style={styles.buttonContainer}>
            <Button title="Enable location data" style={styles.buttonContainer} icon="keyboard-arrow-right" />
          </View>
        </View>
      )
    }
  }

  return(
    <View style={styles.container}>
      <ImageBackground source={IMAGES.HomeBackground} style={IMAGES.BackgroundStyle}>
        <HomeScreenStyle />
      </ImageBackground>
    </View>
  )
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },

  errorHeader: {
    color: COLORS.errorText,
  },

  unknownHeader: {
    color: COLORS.unknownColor,
  },

  warningHeader: {
    color: COLORS.warningText,
  },

  contentContainer: {
    flex: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  emphasized: {
    paddingTop: "5%",
    marginHorizontal: "5%"
  },

  dividerContainer: {
    flex: 0.8,
    alignItems: 'center',
  },

  buttonContainer: {
    position: "relative",
    top: "10%"
  }
});
