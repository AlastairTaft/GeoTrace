import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Button from './../components/Button'
import HeaderText from './../components/HeaderText'
import LineText from '../components/LineText'
import Modal from './../components/Modal'
import DaysSelectControl from './../components/DaysSelectControl'
import { Consumer as UserStatusConsumer } from './../global/userStatus'
import ReportThankyouScreen from './ReportThankyouScreen'
import * as centralAPI from './../global/centralAPI'
import { getDeviceId } from './../global/deviceId'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

// Used to calculate image dimensions
const deviceWidth = Dimensions.get('window').width;
const ratio = 365/771;

const ReportInfectedScreen = props => {


  var [hasPermission, setHasPermission] = useState(null)
  var [showBarCodeScanner, setShowBarCodeScanner] = useState(false)
  var [scanned, setScanned] = useState(false)
  var [errorMessage, setErrorMessage] = useState(null)

  return <UserStatusConsumer>
    {status => {
      // if (status.infected)
      //   return <ReportThankyouScreen />
      if (showBarCodeScanner){
        return (
          <View style={[
            styles.container, 
            { 
              alignItems: 'flex-end', 
              alignContent: 'flex-end',
              flexDirection: 'row',
            }
          ]}>
            <BarCodeScanner
              type={BarCodeScanner.Constants.Type.back}
              barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
              onBarCodeScanned={scanned ? undefined : async function({ data, type }) {
                var deviceId = await getDeviceId()
                await status.reportInfected(deviceId, data)
              }}
              style={StyleSheet.absoluteFillObject}
            />
            {(
              <View style={{
                padding: 20,
                width: "100%",
              }}>
                {scanned ?
                  <Button 
                    title={"Tap to Scan Again"} 
                    onPress={() => setScanned(false)} 
                    style={{width: "100%"}}
                  /> :
                  <Button 
                    title={"Cancel"}
                    onPress={() => setShowBarCodeScanner(false)} 
                    style={{width: "100%"}}
                  />
                }
              </View>
            )}
          </View>
        )
      } else {
        return(
          <View style={styles.container}>

            <HeaderText style={styles.headerTextTop}>
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
                setShowBarCodeScanner(true)
              }}
              >
              <Image source={require("../assets/images/qrscan.png")} resizeMode={"contain"} style={styles.qrImage} />
            </TouchableOpacity>

            <LineText title="Or" />

            <HeaderText style={styles.subheaderText}>
              Type PIN Code
            </HeaderText>

            <TextInput style={styles.textInputPin} placeholder="COV9 - IT42" />

            {/* {(hasPermission === false || errorMessage) ? <View style={styles.errorContainer}>
              {hasPermission === false ? 
                <Text style={styles.errorMessage}>
                  Missing required permissions to scan QR code.
                </Text> : null}
              {errorMessage ? 
                <Text style={styles.errorMessage}>
                  {errorMessage}
                </Text> : null}
            </View> : null}
            <View style={styles.confirmButtonContainer}>
              <Button
                title={(hasPermission === false || errorMessage) ? "Try again" : "Scan and Report"}
                onPress={async () => {
                  const { status } = await BarCodeScanner.requestPermissionsAsync();
                  setHasPermission(status === 'granted')
                  setShowBarCodeScanner(true)
                }}
                icon="keyboard-arrow-right"
              />
            </View> */}
            
          </View>
        )
      }
    }}
  </UserStatusConsumer>
}

export default ReportInfectedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerTextTop: {
    flex: 0,
    flexDirection: "row",
    marginTop: "15%",
    fontSize: SIZES.reportHeaderSize,
    color: COLORS.reportHeaderText,
    textAlign: "left",
    paddingBottom: 30
  },

  headerText: {
    fontSize: SIZES.reportHeaderSize,
    color: COLORS.reportHeaderText,
    textAlign: "left"
  },

  subheaderText: {
    color: COLORS.reportHeaderText,
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

  explanationText: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    alignItems: 'center',
    alignContent: 'center',
  },
  daysControlContainer: {
    flex: 3,
  },
  confirmContainer: {
    flex: 0.7,
    flexDirection: 'row',
  },
  confirmButtonContainer: {
    flex: 3,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  confirmCheckboxContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmCheckbox: {
  },
  confirmTextContainer: {
    paddingRight: 20,
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmText: {
    color: '#3750B5',
    fontSize: 17,
    fontFamily: 'Niveau-Grotesk',
  },
  errorContainer: {
    flex: 3,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  errorMessage: {
    fontSize: 17,
    color: COLORS.errorText,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: COLORS.errorBackground,
  },
}) 
