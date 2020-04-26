import React from 'react'
import { View, Text } from 'react-native'

import COLORS from '../constants/Colors'
import SIZES from '../constants/Sizes'

export default props => {
  return(
  <View style={{flexDirection: 'row'}}>
    <View style={{backgroundColor: props.lineColor ?? COLORS.line, height: 2, flex: 1, alignSelf: "center", marginLeft: "10%"}} />
    <Text style={{ alignSelf: "center", color: props.fontColor ?? COLORS.lineText, paddingHorizontal:5, fontSize: props.fontSize ?? SIZES.reportAltHeaderSize}}>{props.title}</Text>
    <View style={{backgroundColor: props.lineColor ?? COLORS.line, height: 2, flex: 1, alignSelf: "center", marginRight: "10%"}} />
  </View>
  )
}