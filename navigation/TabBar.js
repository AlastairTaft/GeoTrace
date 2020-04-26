import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import COLORS from '../constants/Colors'
import TabBarText from '../navigation/TabBarText'
import { Vibration } from "react-native"

function TabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBar}>
      {state.routes
      // Only render those with tab bar icons
      .map((route, index) => {
        const descriptor = descriptors[route.key];
        const { options } = descriptor
        if (!options.tabBarIcon)
          return null
        var { title, tabBarIcon: TabBarIcon } = options

        const isFocused = state.index === index;

        const onPress = () => {
          Vibration.vibrate(10)
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.navItem
            ]}
            key={title}
          >
            <View style={[
              styles.iconContainer,
            ]}>
              <TabBarIcon focused={isFocused} />
            </View>
            <TabBarText focused={isFocused}>{title}</TabBarText>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.tabBackground,
    flexDirection: 'row',
    shadowRadius: 2,
    shadowOffset: { width: 0, height: -3 },
    shadowColor: '#000000',
    elevation: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 6,
  },
  navText: {
    fontFamily: 'Niveau-Grotesk',
    color: COLORS.tabItemInactive
  },
  navTextActive: {
    color: COLORS.tabItemActive
  },
  iconContainer: {
    height: 36,
  }
})
