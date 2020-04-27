import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/Colors'
import SIZES from '../../constants/Sizes'

export default props => {
  let color = props.focused ? COLORS.tabItemActive : COLORS.tabItemInactive;
  return (
    <Icon name="add-alert" size={SIZES.tabIconSize} color={color} rounded />
  )
}
