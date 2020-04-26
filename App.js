import React, { useEffect, useState } from 'react'
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native'
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import './global/bugTracking' // Bug tracking
import { BackgroundScriptWrapper } from './screens/BackgroundScriptWrapper' // Background location tracking
import BottomTabNavigator from './navigation/BottomTabNavigator'
import useLinking from './navigation/useLinking'
import { PermissionsWrapper, Consumer as PermissionsConsumer } from './global/permissions'
import * as Font from 'expo-font'
import { UserStatusWrapper } from './global/userStatus'
// Fire off the background scripts
import './global/backgroundLocationTracking'
import { useFonts } from '@use-expo/font'
import COLORS from './constants/Colors'

const Tab = createBottomTabNavigator();

function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
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
      setInitialNavigationState(await getInitialState());
      // Do the work while the splash screen is showing

      // TODO: UNPATCH
      // await getStatus()
      await Font.loadAsync(customFonts);

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
          <BottomTabNavigator />
        </NavigationContainer>
      </View>
    );
  }
}

export default props => <UserStatusWrapper>
  <PermissionsWrapper>
    <PermissionsConsumer>
      {permissionsOk => <BackgroundScriptWrapper>
        <App {...props} />
      </BackgroundScriptWrapper>}
    </PermissionsConsumer>
  </PermissionsWrapper>
</UserStatusWrapper>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground
  },
});
