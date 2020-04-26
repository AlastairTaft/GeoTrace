import React from 'react';
import LinksScreen from './LinksScreen';
import GoogleTakeoutsScreen from './GoogleTakeoutsScreen'
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import StyledText from './../components/StyledText'


export default function ResourcesViewScreen({ navigation }) {
    return (
        <View>
            <View style={styles.topMargin} />
            <View style={styles.header}>
                <StyledText>
                    Resources
                </StyledText>
            </View>
            <View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.options}/>
                    <View style={styles.buttonLayer}>
                        <View style={styles.squasher}></View>
                        <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    navigation.navigate('Links')}
                        >
                            <StyledText>
                                Useful Resources
                            </StyledText>
                        </TouchableOpacity>
                        <View style={styles.squasher}></View>
                    </View>
                    <View style={styles.options}/>
                    <View style={styles.buttonLayer}>
                        <View style={styles.squasher}></View>
                        <TouchableOpacity 
                                style={styles.button}
                                onPress={() =>
                                    navigation.navigate('GoogleTakeouts')}
                        >
                            <StyledText>
                                Import Location
                            </StyledText>
                        </TouchableOpacity>
                        <View style={styles.squasher}></View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#FFFFFF',
    },
    options: {
        height: 30
    },
    button: {
        alignItems: "center",
        borderColor: "#add8e6",
        borderWidth: 2,
        padding: 10,
        flex: 3
      },
      buttonLayer: {
          flex: 1,
          flexDirection: 'row'
      },
      squasher: {
        flex: 1
      },
    primaryButtonText: {
        fontFamily: 'Avenir-Medium',
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#ffffff'
    },
    topMargin: {
        backgroundColor: '#FFFFFF',
        height: 40,
        width: '100%',
      },
      header: {
          textAlign: 'center',
          fontFamily: 'Avenir-Medium',
          fontSize: 22,
          backgroundColor: '#FFFFFF'
      }
  });