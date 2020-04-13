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
        
      <View style={styles.logoContainer}>
        <Image
          source={
            require('../assets/images/logo.png')
          }
          style={styles.logoImage}
        />
        <TextLogo />
      </View>
      <View style={styles.dividerContainer}>
        <Divider style={{width: 231}} />
      </View>
      <View style={styles.contentContainer}>
        <TrackingMessage />
        <Text />
        <StyledText>
          You will be notified here if you 
          have been in close contact with someone who has been diagnosed 
          with COVID-19.
        </StyledText>
      </View>
      <View style={styles.illustrationContainer}>
        <Neighbourhood />
      </View>
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

  logoContainer: {
    flex: 2.6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dividerContainer: {
    flex: 0.8,
    alignItems: 'center',
  },
  contentContainer: {
    flex: 3,
    paddingLeft: 30,
    paddingRight: 30,
  },
  illustrationContainer: {
    flex: 3,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  errorMessage: {
    fontSize: 17,
    color: Colors.errorText,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: Colors.errorBackground,
  },
});

const TrackingMessage = props => <PermissionsConsumer>
  {permissionsOk => {
    if (permissionsOk){
      return <BackgroundTrackingConsumer>
        {trackingScriptInstalled => {
          if (trackingScriptInstalled)
            return <Fragment>
              <StyledText>
                Your location is being <HighlightText>anonymously</HighlightText> tracked. 
              
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