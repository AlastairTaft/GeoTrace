import React from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'

import HeaderText from './../components/HeaderText'
import EmphasizedText from '../components/EmphasizedText'
import { useHeaderHeight } from '@react-navigation/stack'

import COLORS from '../constants/Colors'
import IMAGES from '../constants/Images'
import SIZES from '../constants/Sizes'

const ReportThankYouScreen = () => {
  const headerHeight = useHeaderHeight()

  return (
    <ImageBackground source={IMAGES.HomeBackground} style={IMAGES.BackgroundStyle}>
      <View style={[StyleSheet.create({paddingTop: headerHeight}), styles.container]}>
        <View style={styles.contentContainer}>
          <View>
            <Icon name="verified-user" color={COLORS.headerText} size={SIZES.headerSize} />
          </View>
          <HeaderText>
            You are a hero
          </HeaderText>
          <EmphasizedText style={styles.emphasized}>
            Your anonymous location data will help prevent further spread.
          </EmphasizedText>
          <EmphasizedText style={styles.emphasized}>
            Your kindness will save lives. Thank you for protecting your family, friends and neighbours.
          </EmphasizedText>
        </View>
      </View>
    </ImageBackground>
  )
}

export default ReportThankYouScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  emphasized: {
    paddingTop: "5%",
    marginHorizontal: "10%"
  },
})
