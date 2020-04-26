import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import StyledText from './../components/StyledText';
import GoogleMapsIcon from './../assets/images/GoogleMapsIcon';
import { SvgXml } from 'react-native-svg';



export default function GoogleTakeoutsScreen({ navigation }) {
    return (
        <View style={styles.section}>
          <View style={styles.banner}/>
            <View style={styles.rowContainer}>
            <SvgXml xml={GoogleMapsIcon} style={{ alignSelf: 'center' }} />
            <StyledText style={{fontSize: 22}}>
                Google Maps
            </StyledText>
            </View>
            <View style={styles.sectionRowContainer}>
            <StyledText>
              You can download your previous location data if you wish to use your past locations as an initial estimation of risk.
            </StyledText>
          </View>
            <View style={styles.buttonContainer}>
                <Button title="Import Past Locations"
                        onPress={() =>
                            navigation.navigate('ImportScreen')}
                />
            </View>
        </View>
        );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff'
    },
    banner: {
      height: 30,
      backgroundColor: 'white'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    primaryButtonText: {
        fontFamily: 'Avenir-Medium',
        fontSize: 16,
        lineHeight: 19,
        letterSpacing: 0,
        textAlign: 'center',
        color: '#fff'
    },
    rowContainer: {
      flexDirection: 'row',
      paddingTop: '4%',
    },
    section: {
      flexDirection: 'column',
      alignSelf: 'center',
      backgroundColor: '#fff'
    },
    sectionRowContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingVertical: '5%',
      backgroundColor: 'white',
    },

  });