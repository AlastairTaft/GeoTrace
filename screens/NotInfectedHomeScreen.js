import React, { useEffect, useState } from 'react'
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
import ReportInfected from './ReportInfected'
import Modal from './../components/Modal'


var getAtRiskLocationHistory = async () => {
  var uniqueId = await getDeviceId()
  return trackAPI.getAtRiskHistoricPositions(uniqueId)
}

var onReportInfected = async (timestampShowingSymptoms) => {
  var uniqueId = await getDeviceId()
  await trackAPI.reportInfected(uniqueId, timestampShowingSymptoms) 
}

const NotInfectedHomeScreen = props => {

  var [showModal, setShowModal] = useState(false)
  var [atRiskHistoricData, setAtRiskHistoricData] = useState([])

  var getAtRiskData = () => {
    getAtRiskLocationHistory()
    .then(atRiskData => {
      // TODO Would be better to figure this out before rendering the screen
      var infected = atRiskData.features.some(f => f.properties['infected'])
      if (infected)
        props.setInfected(true)
      setAtRiskHistoricData(atRiskData.features)
    })
  }

  useEffect(getAtRiskData, [])

  return (
    <View style={styles.container}>

      <Modal
        onRequestClose={() => setShowModal(false)}
        visible={showModal}
      >
        <ReportInfected 
          onReportInfected={(timestampShowingSymptoms) => {
            props.setInfected(true)
            onReportInfected(timestampShowingSymptoms)
          }}
        />
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={
              require('../assets/images/logo.png')
            }
            style={styles.logoImage}
          />
        </View>

        <View style={styles.innerContentContainer}>
          <PermissionsConsumer>
            {permissionsOk => {
              console.log('PermissionsContext.Consumer#permissionsOk', permissionsOk)
              if (permissionsOk){
                return <BackgroundTrackingConsumer>
                  {trackingScriptInstalled => {
                    if (trackingScriptInstalled)
                      return <StyledText>
                        Your location is being anonymously tracked. You will be notified here if you 
                        have been in close contact with someone who has been diagnosed 
                        with COVID-19.
                      </StyledText>
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

          <View style={styles.helpContainer}>
            <Button 
              onPress={() => setShowModal(true)}
              title="Report, I have COVID-19"
            />
          </View>

          <View style={styles.atRiskContainer}>
            {atRiskHistoricData.length ? <AtRiskInfo atRiskLocationData={atRiskHistoricData} /> : null}
          </View>
        </View>


        

      </ScrollView>
    </View>
  )
}

export default NotInfectedHomeScreen


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
    backgroundColor: '#fbfbfb',
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


