import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import StyledText from './../components/StyledText'
import COLORS from '../constants/Colors'

const InfectedHomeScreen = props => {

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.logoContainer}>
          <Image
            source={
              require('../assets/images/logo.png')
            }
            style={styles.logoImage}
          />
        </View>
        <View style={styles.innerContentContainer}>
          <StyledText>
            Thankyou for reporting your diagnosis.
    
            Your location is being anonymously tracked to inform others who may
            be at risk.
          </StyledText>
        </View>
      </ScrollView>
    </View>
  )
}

export default InfectedHomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },
  contentContainer: {
    paddingTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  innerContentContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
})
