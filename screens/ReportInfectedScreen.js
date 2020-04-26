import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Button from './../components/Button'
import HeaderText from './../components/HeaderText'
import LineText from '../components/LineText'
import Modal from './../components/Modal'
import { Consumer as UserStatusConsumer } from './../global/userStatus'
import { verifyPinRegex } from './../global/verifyPinRegex'
import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

// Used to calculate image dimensions
const deviceWidth = Dimensions.get('window').width;
const ratio = 365/771;

export const ReportInfectedScreen = (props) => {
  var [hasPermission, setHasPermission] = useState(null)
  var [showBarCodeScanner, setShowBarCodeScanner] = useState(false)
  var [scanned, setScanned] = useState(false)
  var [errorMessage, setErrorMessage] = useState(null)
  var [modalVisible, setModalVisible] = useState(false)
  var [pinSubmitEnabled, setPinSubmitEnabled] = useState(false)

  function showBarcodeScanner() {
    setScanned(false)
    props.navigation.navigate("Scan")
  }

  return <UserStatusConsumer>
    {status => {
      // if (status.infected)
      //   return <ReportThankYouScreen />
        return(
          <View style={styles.container}>

            <Modal visible={errorMessage} onRequestClose={() => {setModalVisible(false);setErrorMessage(null)}}>
              <Text>{errorMessage}</Text>
            </Modal>

            <HeaderText style={styles.headerText}>
              Share your COVID-19 test results anonymously.
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

            <TextInput
              style={styles.textInputPin}
              placeholder="3423 - 3234 - 3256"
              autoCorrect={false}
              autoCompleteType={"off"}
              autoCapitalize={"characters"}
              onChangeText={(pin) => {
                setPinSubmitEnabled(verifyPinRegex(pin))
              }}
            />

            <View style={styles.submitContainer}>
              <Button
                disabled={!pinSubmitEnabled}
                title="Submit"
                // TODO: hook up submit function (check if pin is (in)valid)
                onPress={() => {console.warn("Hook me up!")}}
              />
            </View>
          </View>
        )
      }
    }
  </UserStatusConsumer>
}

export default ReportInfectedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.appBackground,
  },

  headerText: {
    flex: 0,
    flexDirection: "row",
    marginTop: "15%",
    fontSize: SIZES.reportHeaderSize,
    color: COLORS.reportHeaderText,
    textAlign: "left",
    paddingBottom: 30
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

  textInputPin: {
    borderRadius: 10,
    backgroundColor: COLORS.textInputBackground,
    height: 65,
    marginHorizontal: "10%",
    marginTop: 22,
    textAlign: "center",
    fontSize: 27,
    fontWeight: "bold"
  },

  imageContainer: {
    height: deviceWidth * 0.8 * ratio,
    width: deviceWidth * 0.8,
    marginHorizontal: "10%",
    marginVertical: 10
  },

  submitContainer: {
    marginHorizontal: "15%",
    marginTop: "10%"
  },

}) 
