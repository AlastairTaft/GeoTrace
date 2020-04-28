import React from "react"

import { createStackNavigator } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/MaterialIcons"

import StackHeaderText from "../components/StackHeaderText"

import ScanQRCodeScreen from "../screens/ScanQRCode"
import SelfReportScreen from "../screens/SelfReportScreen"
import ReportThankYouScreen from "../screens/ReportThankYouScreen"
import ReportFailedScreen from "../screens/ReportFailedScreen"

import OnboardingMain from "../screens/OnboardingMain"
import OnboardingHeader from "../screens/OnboardingHeader"
import OnboardingPermissions from "../screens/OnboardingPermissions"

import BottomTabNavigator from "./BottomTabNavigator"

import SIZES from "../constants/Sizes"

const Stack = createStackNavigator();

export default (props) => {
  // Custom header design
  const StackScreenBackHeader = ({navigation}) => ({
    headerTransparent: true,
    title: "",
    headerLeft: () =>
      <StackHeaderText onPress={ () => navigation.goBack() }>
        <Icon name="keyboard-arrow-left" size={SIZES.stackHeaderSize} />
        Back
      </StackHeaderText>
  })

  const StackScreenNoHeader = () => ({
    headerShown: false
  })

  return(
    <Stack.Navigator initialRouteName={props.initialRoute}>
      <Stack.Screen options={StackScreenNoHeader} name="Main" component={BottomTabNavigator} />

      <Stack.Screen options={StackScreenNoHeader} name="OnboardingMain" component={OnboardingMain} />
      <Stack.Screen options={StackScreenNoHeader} name="OnboardingHeader" component={OnboardingHeader} />
      <Stack.Screen options={StackScreenNoHeader} name="OnboardingPermissions" component={OnboardingPermissions} />

      <Stack.Screen options={StackScreenBackHeader} name="SelfReport" component={SelfReportScreen} />
      <Stack.Screen options={StackScreenBackHeader} name="Scan" component={ScanQRCodeScreen}/>
      <Stack.Screen options={StackScreenBackHeader} name="ReportThankYou" component={ReportThankYouScreen} />
      <Stack.Screen options={StackScreenBackHeader} name="ReportFailed" component={ReportFailedScreen} />
    </Stack.Navigator>
  )
}
