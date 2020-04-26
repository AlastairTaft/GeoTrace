import React from 'react'

import { createStackNavigator } from '@react-navigation/stack'
import StackHeaderText from '../components/StackHeaderText'
import ScanQRCodeScreen from '../screens/ScanQRCode'
import Icon from 'react-native-vector-icons/MaterialIcons'
import SIZES from '../constants/Sizes'
import BottomTabNavigator from './BottomTabNavigator'
import ReportThankYouScreen from '../screens/ReportThankYouScreen'
import ReportFailedScreen from '../screens/ReportFailedScreen'

const Stack = createStackNavigator();
export default () => {
  const options = ({navigation}) => ({
    headerTransparent: true,
    title: "",
    headerLeft: () =>
      <StackHeaderText onPress={ () => navigation.goBack() }>
        <Icon name="keyboard-arrow-left" size={SIZES.stackHeaderSize} />
        Back
      </StackHeaderText>
  })

  return(
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen options={{headerShown: false}} name="Main" component={BottomTabNavigator} />
      <Stack.Screen options={options} name="Scan" component={ScanQRCodeScreen}/>
      <Stack.Screen options={options} name="ReportThankYou" component={ReportThankYouScreen} />
      <Stack.Screen options={options} name="ReportFailed" component={ReportFailedScreen} />
    </Stack.Navigator>
  )
}
