import React, { useEffect, useState } from 'react'
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import * as Sentry from 'sentry-expo'
import Constants from 'expo-constants'

import BottomTabNavigator from './navigation/BottomTabNavigator'
import useLinking from './navigation/useLinking'
import { PermissionsWrapper } from './global/permissions'



Sentry.init({
  dsn: 'https://6daaa6e11e0642caac142e2b7eceaec5@sentry.io/5188341',
  enableInExpoDevelopment: true,
  debug: true
})
Sentry.setRelease(Constants.manifest.revisionId)


const Stack = createStackNavigator();

function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

export default props => <PermissionsWrapper>
  <App {...props} />
</PermissionsWrapper>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
