import React from 'react'
import { View } from 'react-native'

export default props => <View 
  style={[{
    borderSizeTop: 1, 
    borderWidth: 1, 
    borderColor: '#46586048', 
    borderStyle: 'solid',
  }, props.style]}
/>
