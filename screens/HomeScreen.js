import React, { Fragment } from 'react'
import NotInfectedHomeScreen from './NotInfectedHomeScreen'
import InfectedHomeScreen from './InfectedHomeScreen'
import { 
  Image, 
  Platform, 
  StyleSheet, 
  Text, 
  View, 
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import * as Updates from 'expo-updates'
import Button from './../components/Button'
import Colors from './../constants/Colors'
import { Consumer as PermissionsConsumer } from './../global/permissions'
import { Consumer as BackgroundTrackingConsumer } from './../global/backgroundLocationTracking'
import * as trackAPI from './../global/trackAPI'
import { getDeviceId } from './../global/deviceId'
import AtRiskInfo from './../components/AtRiskInfo'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import Modal from './../components/Modal'
import TextLogo from './../assets/images/TextLogo'
import Divider from './../components/Divider'
import Neighbourhood from './../assets/images/Neighbourhood'

export default function HomeScreen() {


  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.logoContainer}>
          <Image
            source={
              require('../assets/images/logo.png')
            }
            style={styles.logoImage}
          />
          <TextLogo />
        </View>

        <View style={styles.innerContentContainer}>
          <Divider style={{width: 231, marginTop: 50, marginBottom: 50,}} />
          <PermissionsConsumer>
            {permissionsOk => {
              if (permissionsOk){
                return <BackgroundTrackingConsumer>
                  {trackingScriptInstalled => {
                    if (trackingScriptInstalled)
                      return <Fragment>
                        <StyledText>
                          Your location is being <HighlightText>anonymously</HighlightText> tracked. 
                        
                        </StyledText>
                        <Text />
                        <StyledText>
                          You will be notified here if you 
                          have been in close contact with someone who has been diagnosed 
                          with COVID-19.
                        </StyledText>
                      </Fragment>
                    return <View>
                      <Text style={styles.errorMessage}>
                        Background tracking not yet running...
                      </Text>
                      <Text />
                      <Button 
                        onPress={Updates.reloadAsync}
                        title="Reload"
                      />
                    </View>

                  }}
                </BackgroundTrackingConsumer>
              }
              return <Text style={styles.errorMessage}>
                Unable to get required location tracking permissions from your
                device.
              </Text>
            }}
          </PermissionsConsumer>
          <Neighbourhood />
        </View>
      </ScrollView>
    </View>
  )
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  innerContentContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  errorMessage: {
    fontSize: 17,
    color: Colors.errorText,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: Colors.errorBackground,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: Colors.tintColor,
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  primaryButton: {
    paddingVertical: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
  },
  helpLinkText: {
    fontSize: 14,
    color: 'white',
  },
  atRiskContainer: {
    marginTop: 40,
  },
});