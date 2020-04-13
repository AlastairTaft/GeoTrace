import React, { useEffect, useState } from 'react'
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native'
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import './global/bugTracking' // Bug tracking
import { BackgroundScriptWrapper } from './global/backgroundLocationTracking' // Background location tracking
import BottomTabNavigator from './navigation/BottomTabNavigator'
import useLinking from './navigation/useLinking'
import { PermissionsWrapper, Consumer as PermissionsConsumer } from './global/permissions'
import { getStatus } from './global/userStatus'
import { useFonts } from '@use-expo/font'
import { UserStatusWrapper } from './global/userStatus'

const Stack = createStackNavigator();

function App(props) {

  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);
  let [fontsLoaded] = useFonts({
    'Avenir-Roman': require('./assets/fonts/AvenirLTStd-Roman.otf'),
    'Avenir-Book': require('./assets/fonts/AvenirLTStd-Book.otf'),
    'Avenir-Medium': require('./assets/fonts/AvenirLTStd-Medium.otf'),
    'SpaceMono-Regular': require('./assets/fonts/SpaceMono-Regular.ttf'),
  });
  

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      SplashScreen.preventAutoHide()
      // Load our initial navigation state
      setInitialNavigationState(await getInitialState());
      // Do the work while the splash screen is showing
      await getStatus()
      setLoadingComplete(true)
      SplashScreen.hide()
    }
    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return <Text>Test</Text>;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Home" component={BottomTabNavigator} />
          </Stack.Navigator>
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
    backgroundColor: '#fff',
    
  },
});
