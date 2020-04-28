import React from 'react'
import { View } from 'react-native'

import COLORS from "./../constants/Colors"

export default props => <View 
  style={[{
    height: 1,
    backgroundColor: COLORS.line
  }, props.style]}
/>
