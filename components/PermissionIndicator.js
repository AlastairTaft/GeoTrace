import React from "react"

import { StyleSheet, Text, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome5"

import Divider from "../components/Divider"

import SIZES from "../constants/Sizes"
import COLORS from "../constants/Colors"


export default PermissionIndicator = props => {
  const { title, status } = props
  return (
    <View style={styles.indicatorContainer}>
      <View style={styles.contentContainer}>
        <Text style={styles.textItem}>{title}</Text>
        {status === 1 ? <Icon name="check-circle" size={SIZES.onboardingIconSize} color={COLORS.tintOnboarding} solid />
          : status === 0 ? <Icon name="circle" size={SIZES.onboardingIconSize} color={COLORS.onboardingIconInactive} />
          : <Icon name="times-circle" size={SIZES.onboardingIconSize} color={COLORS.onboardingIconInactive} solid />
        }
      </View>
      <Divider style={styles.divider} />
    </View>
  )
}

const styles = StyleSheet.create({
  indicatorContainer: {
    width: "100%"
  },

  contentContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flex: 0,
    width: "100%",
    marginBottom: 10
  },

  textItem: {
    fontSize: SIZES.onboardingSmallSize,
    color: COLORS.tintOnboarding,
  },

  divider: {
    width: "100%",
    marginBottom: 10
  }
})