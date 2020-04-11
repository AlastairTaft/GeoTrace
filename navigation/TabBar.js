import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

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
            style={styles.navItem}
            key={title}
          >
            <View style={styles.iconContainer}>
              <TabBarIcon focused={isFocused} />
            </View>
            <Text style={[styles.navText, { color: isFocused ? '#673ab7' : '#222' }]}>
              {title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  )
}

export default TabBar

const styles = StyleSheet.create({
  tabBar: {
    borderTopColor: '#00000032',
    borderWidth: 1,
    borderStyle: 'solid', 
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navText: {
    //fontFamily: 'Avenir-Roman',
  },
  iconContainer: {
    height: 48,
  },
})
