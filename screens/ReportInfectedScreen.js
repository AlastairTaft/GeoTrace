import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, Image, Dimensions, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'

import Button from './../components/Button'
import HeaderText from './../components/HeaderText'
import LineText from '../components/LineText'
import Modal from './../components/Modal'
import PinInput from '../components/PinInput'

import HeaderStyle from "../styles/HeaderStyle"

import { Consumer as UserStatusConsumer } from './../global/userStatus'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'
import IMAGES from '../constants/Images'

// Used to calculate image dimensions
const deviceWidth = Dimensions.get('window').width;
const ratio = 365/771;

export const ReportInfectedScreen = (props) => {
  var [hasPermission, setHasPermission] = useState(null)
  var [showBarCodeScanner, setShowBarCodeScanner] = useState(false)
  var [errorMessage, setErrorMessage] = useState(null)
  var [modalVisible, setModalVisible] = useState(false)
  var [pinSubmitEnabled, setPinSubmitEnabled] = useState(false)
  var [pin, setPin] = useState('')

  function showBarcodeScanner() {
    props.navigation.navigate("Scan")
  }

  return (
    <ImageBackground source={IMAGES.Background} style={IMAGES.BackgroundStyle}>
      <UserStatusConsumer>
        {status => {
          // if (status.infected)
          //   return <ReportThankYouScreen />
            return(
              <KeyboardAvoidingView behavior="height" style={styles.container}>
                <ScrollView>
                  <Modal visible={errorMessage} onRequestClose={() => {setModalVisible(false);setErrorMessage(null)}}>
                    <Text>{errorMessage}</Text>
                  </Modal>

                  <HeaderText style={HeaderStyle}>
                    Anonymous COVID-19 Alert
                  </HeaderText>

                  <HeaderText style={styles.subheaderText}>
                    QR Scan
                  </HeaderText>

                  <TouchableOpacity
                    style={styles.imageContainer}
                    onPress={async () => {
                      const { status } = await BarCodeScanner.requestPermissionsAsync();
                      setHasPermission(status === "granted")
                      if (status === "granted")
                        showBarcodeScanner()
                    }}
                  >
                    <Image source={require("../assets/images/qrscan.png")} resizeMode={"contain"} style={styles.qrImage} />
                  </TouchableOpacity>

                  <LineText title="Or" />

                  <HeaderText style={styles.subheaderText}>
                    Type PIN Code
                  </HeaderText>

                  <PinInput
                    onValidation={(valid) => setPinSubmitEnabled(valid)}
                    value={pin}
                    onChangeText={(value) => setPin(value)}
                  />

                  <View style={styles.submitContainer}>
                    <UserStatusConsumer>
                      {status => (
                        <Button
                          disabled={!pinSubmitEnabled}
                          title="Submit"
                          onPress={async () => {
                            setPin('')
                            setPinSubmitEnabled(false)
                            const success = await status.reportInfected(pin)
                            props.navigation.navigate(success ? 'ReportThankYou' : 'ReportFailed')
                          }}
                        />
                      )}
                    </UserStatusConsumer>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            )
          }
        }
      </UserStatusConsumer>
    </ImageBackground>
  )
}

export default ReportInfectedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  subheaderText: {
    color: COLORS.altTintColor,
    fontSize: SIZES.reportAltHeaderSize,
    textAlign: "left"
  },
  
  qrImage: {
    flex: 1,
    height: undefined,
    width: undefined
  },

  imageContainer: {
    height: deviceWidth * 0.9 * ratio,
    width: deviceWidth * 0.9,
    marginHorizontal: "5%",
    marginVertical: 10
  },

  submitContainer: {
    marginHorizontal: "15%",
    margin: 20
  },

}) 
