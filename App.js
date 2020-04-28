import React, { useEffect, useState } from 'react'
import { AsyncStorage, Platform, StatusBar, StyleSheet, View, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { SplashScreen } from 'expo';
import * as Font from 'expo-font'

import StackNavigator from './navigation/StackNavigator'
import useLinking from './navigation/useLinking'

import { PermissionsWrapper, Consumer as PermissionsConsumer } from './global/permissions'
import { UserStatusWrapper } from './global/userStatus'
import './global/bugTracking' // Bug tracking

import { BackgroundScriptWrapper } from './screens/BackgroundScriptWrapper' // Background location tracking
// Fire off the background scripts
import './global/backgroundLocationTracking'

import COLORS from './constants/Colors'

const Tab = createBottomTabNavigator();

function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [isFirstRun, setIsFirstRun] = React.useState(true);
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  let customFonts = {
    'Niveau-Grotesk': require('./assets/fonts/Niveau-Grotesk-Regular.otf'),
    'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
  }

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      SplashScreen.preventAutoHide()
      // Load our initial navigation state
      setInitialNavigationState(await getInitialState())
      // Do the work while the splash screen is showing

      // TODO: UNPATCH
      // await getStatus()
      await Font.loadAsync(customFonts)
      
      // Check if the app is started for the first time
      setIsFirstRun((await AsyncStorage.getItem("firstRun")) === null)

      setLoadingComplete(true)
      SplashScreen.hide()
    }
    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <StackNavigator initialRoute={isFirstRun ? "OnboardingMain" : "Main"} />
        </NavigationContainer>
      </View>
    );
  }
}

export default props => <UserStatusWrapper>
  {/* TODO: implement background tracking script */}
  {/* <PermissionsWrapper>
    <PermissionsConsumer>
      {permissionsOk => <BackgroundScriptWrapper>
        <App {...props} />
      </BackgroundScriptWrapper>}
    </PermissionsConsumer>
  </PermissionsWrapper> */}
  <App {...props} />
</UserStatusWrapper>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground
  },
});
