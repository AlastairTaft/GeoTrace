import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import ReportScreen from './../screens/ReportScreen'
import TrackingScreen from './../screens/TrackingScreen'
import TrackingIcon from './../assets/icons/Tracking'
import ReportIcon from './../assets/icons/Report'
import ResourcesIcon from './../assets/icons/Resources'
import TabBar from './TabBar'
import DebugScreen from './../screens/DebugScreen'

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator 
      initialRouteName={INITIAL_ROUTE_NAME}
      tabBar={props => <TabBar {...props} />}
    >

      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
        }}
      />
      <BottomTab.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          title: 'Tracking',
          tabBarIcon: ({ focused }) => <TrackingIcon />,
        }}
      />
      <BottomTab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Report',
          tabBarIcon: ({ focused }) => <ReportIcon />,
        }}
      />
      {/*<BottomTab.Screen
        name="Resources"
        component={LinksScreen}
        options={{
          title: 'Resources',
          tabBarIcon: ({ focused }) => <ResourcesIcon />,
        }}
      />*/}
      {(__DEV__ || Constants.manifest.releaseChannel == 'debug') ? <BottomTab.Screen
        name="Debug"
        component={DebugScreen}
        options={{
          title: 'Debug',
          tabBarIcon: ({ focused }) => <ResourcesIcon />,
        }}
      /> : null}
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Tracking': return 'Tracking'
    case 'Report': return 'Report'
    case 'Resources': return 'Resources'
  }
}