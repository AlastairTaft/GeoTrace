import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { itemInactive, itemActive, iconSize } from '../../styles/navigation';

export default props => {
    let color = props.focused ? itemActive : itemInactive;
    return(
        <Icon name="home" size={iconSize} color={color} rounded />
    )
}