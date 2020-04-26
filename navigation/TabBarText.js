import React from 'react'
import { StyleSheet, Text } from 'react-native'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

const TabBarText = props => {
  // let color = props.focused ?  : COLORS.tabItemInactive;
  return(
    <Text 
        {...props} 
        style={[styles.regularText, props.style, props.focused ? styles.focusedItem : undefined]}
    />
  )
}

export default TabBarText


var styles = StyleSheet.create({
  regularText: {
    fontSize: SIZES.tabBarTextSize,
    textAlign: 'center',
    fontFamily: 'Niveau-Grotesk',
    marginHorizontal: 20,
    color: COLORS.tabItemInactive
  },

  focusedItem: {
    color: COLORS.tabItemActive
  }
})
