import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import HomeScreen from '../screens/HomeScreen';
import GuideScreen from '../screens/GuideScreen';
import { ReportNavigator } from './../screens/ReportInfectedScreen'
import HomeIcon from '../assets/icons/Home'
import AlertIcon from '../assets/icons/Alert';
import GuideIcon from '../assets/icons/Guide'
import TabBar from './TabBar'

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  // navigation.setOptions({ headerTitle: getHeaderTitle(route) });

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
          tabBarIcon: ({ focused }) => <HomeIcon focused={focused} />,
        }}
      />
      <BottomTab.Screen
        name="Guide"
        component={GuideScreen}
        options={{
          title: 'Guide',
          tabBarIcon: ({ focused }) => <GuideIcon focused={focused} />,
        }}
      />
      <BottomTab.Screen
        name="Alert"
        component={ReportNavigator}
        options={{
          title: "Alert",
          tabBarIcon: ({ focused }) => <AlertIcon focused={focused} />,
        }}
      />

    </BottomTab.Navigator>
  );
}
