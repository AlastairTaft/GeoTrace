import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import COLORS from '../constants/Colors'
import SIZES from '../constants/Sizes'

export default props => {
  return(
  <View style={styles.container}>
    <Text style={[{color: props.fontColor ?? COLORS.lineText, fontSize: props.fontSize ?? SIZES.reportAltHeaderSize}, styles.text]}>{props.title}</Text>
    <View style={[{backgroundColor: props.lineColor ?? COLORS.line}, styles.line]} />
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10
  },
  text: {
    alignSelf: "center",
    paddingHorizontal: 5
  },
  line: {
    height: 2,
    flex: 1,
    alignSelf: "center",
    marginLeft: 10
  }
})