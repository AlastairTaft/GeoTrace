import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import StackHeaderText from '../components/StackHeaderText'

import ScanQRCodeScreen from '../screens/ScanQRCode'
import SelfReportScreen from '../screens/SelfReportScreen'

import Icon from 'react-native-vector-icons/MaterialIcons'

import SIZES from '../constants/Sizes'

import BottomTabNavigator from './BottomTabNavigator'

const Stack = createStackNavigator();

function StackScreenOptions({navigation}) {
    return({
        headerTransparent: true,
        title: "",
        headerLeft: () => (
          <StackHeaderText onPress={ () => navigation.goBack() } ><Icon name="keyboard-arrow-left" size={SIZES.stackHeaderSize} />Back</StackHeaderText>
        ),
    })
}

export default () => {
  return(
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen options={{headerShown: false}} name="Main" component={BottomTabNavigator} />
      <Stack.Screen
        options={StackScreenOptions}
        name="Scan"
        component={ScanQRCodeScreen} />
      <Stack.Screen
        options={StackScreenOptions}
        name="SelfReport"
        component={SelfReportScreen} />
    </Stack.Navigator>
  )
}