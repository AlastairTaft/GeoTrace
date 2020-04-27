import React from "react"

import { StyleSheet, Text, View } from "react-native"

import SIZES from "../constants/Sizes"
import COLORS from "../constants/Colors"

const GuideSelectorComponent = props => {
  const { title, active, onPressCallback } = props
  return (
    <View style={[styles.parentView, active ? styles.parentViewActive : undefined]}>
      <Text style={[styles.textItem, active ? styles.textActive : undefined]} onPress={onPressCallback}>{title}</Text>
    </View>
  )
}

export default GuideSelectorComponent

const styles = StyleSheet.create({
  parentView: {
    marginRight: 20
  },
  parentViewActive: {
    borderBottomColor: COLORS.guideSelectorActive,
    borderBottomWidth: SIZES.guideUnderlineThicnkess
  },
  textItem: {
    fontSize: SIZES.guideSelectorText,
    color: COLORS.guideSelectorInactive,
    fontWeight: "bold"
  },
  textActive: {
    color: COLORS.guideSelectorActive
  }
})