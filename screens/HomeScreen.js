import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react'
import { 
  Image, 
  Platform, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Modal, 
  TextInput,  
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import * as TaskManager from 'expo-task-manager'
import * as Updates from 'expo-updates'
import CheckBox from './../components/CheckBox'
import Button from './../components/Button'
import CloseButton from './../components/CloseButton'
import Colors from './../constants/Colors'
import { Consumer as PermissionsConsumer } from './../global/permissions'
import { Consumer as BackgroundTrackingConsumer } from './../global/backgroundLocationTracking'

export default function HomeScreen() {

  var [showModal, setShowModal] = useState(false)
  var [tasksString, setTasksString] = useState('')

  var getRegisteredTasks = () => {
    TaskManager.getRegisteredTasksAsync()
    .then(tasks => {
      setTasksString(JSON.stringify(tasks, null, 2))
    })
  }

  useEffect(getRegisteredTasks)

  return (
    <View style={styles.container}>

      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <ConfirmInfected 
          onRequestClose={() => setShowModal(false)}
        />
      </Modal>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.welcomeContainer}>
          <Image
            source={
              require('../assets/images/logo.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <View style={styles.getStartedContainer}>
          <PermissionsConsumer>
            {permissionsOk => {
              console.log('PermissionsContext.Consumer#permissionsOk', permissionsOk)
              if (permissionsOk){
                return <BackgroundTrackingConsumer>
                  {trackingScriptInstalled => {
                    if (trackingScriptInstalled)
                      return <Text style={styles.getStartedText}>
                        You location is being tracked. You will be notified here if you 
                        have been in close contact with someone who has been diagnosed 
                        with COVID-19.
                      </Text>
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
        </View>


        {/*<View style={styles.helpContainer}>
          <Button 
            onPress={() => setShowModal(true)}
            title="Report, I have COVID-19"
          />
        </View>*/}

      </ScrollView>
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};


const ConfirmInfected = props => {

  var [confirmed, setConfirmed] = useState(false)
  console.log('ConfirmInfected#confirmed', confirmed)

  return <View 
    style={styles.modalOuter}
  >
    <View style={styles.modalInner}>
      <Text>How many days ago did you start showing symptoms?</Text>
      <TextInput  
        placeholder="Enter number of days"   
        keyboardType={'numeric'} 
        style={styles.input}
      />  

      <View style={styles.confirmContainer}>
        <View style={{width: '20%'}}>
          <CheckBox 
            checked={confirmed}
            onPress={() => setConfirmed(!confirmed)}
          />
        </View>
        <View style={{width: '80%', paddingLeft: 10, boxSizing: 'border-box'}}>
          <Text>
            I acknowledge that I have officially tested positive for COVID-19. 
            By tapping 'Confirm' I will be helping others avoid infection and I will no
            longer receive notifications.
          </Text>
        </View>
      </View>


      <Button
        title="Confirm"
        disabled={!confirmed}
      />

      <CloseButton 
        style={styles.closeButton} 
        onPress={props.onRequestClose}
      />
    </View>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
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
  modalOuter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modalInner: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    height: 400,
    borderRadius: 3,
  },
  input: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    fontSize: 26,
    color: Colors.tintColor,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 3,
  },
  confirmContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: 5,
    width: 50,
    height: 50,
    borderWidth: 0,
  },
});
