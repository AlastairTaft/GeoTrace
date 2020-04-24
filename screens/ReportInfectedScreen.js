import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Button from './../components/Button'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import CheckBox from './../components/CheckBox'
import DaysSelectControl from './../components/DaysSelectControl'
import { Consumer as UserStatusConsumer } from './../global/userStatus'
import ReportThankyouScreen from './ReportThankyouScreen'
import Colors from './../constants/Colors'
import * as centralAPI from './../global/centralAPI'
import { getDeviceId } from './../global/deviceId'

const ReportInfectedScreen = props => {


  var [hasPermission, setHasPermission] = useState(null)
  var [showBarCodeScanner, setShowBarCodeScanner] = useState(false)
  var [scanned, setScanned] = useState(false)
  var [errorMessage, setErrorMessage] = useState(null)

  return <UserStatusConsumer>
    {status => {
      if (status.infected)
        return <ReportThankyouScreen />
      if (showBarCodeScanner){
        return <View style={[
            styles.container, 
            { 
              alignItems: 'flex-end', 
              alignContent: 'flex-end',
              flexDirection: 'row',
            }
          ]}>
          <BarCodeScanner
            type={BarCodeScanner.Constants.Type.front}
            barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            onBarCodeScanned={scanned ? undefined : async function({ data, type }){
              if (data.startsWith('Geo Trace:') == false)
                return setErrorMessage('Unrecognised QR code.')
              var deviceId = await getDeviceId()
              await status.reportInfected(deviceId, data.slice('Geo Trace:'.length))
            }}
            style={StyleSheet.absoluteFillObject}
          />
          {(
            <View style={{
              padding: 20,
              width: '100%',
            }}>
              {scanned ?
                <Button 
                  title={'Tap to Scan Again'} 
                  onPress={() => setScanned(false)} 
                  style={{width: '100%'}}
                /> :
                <Button 
                  title={'Cancel'} 
                  onPress={() => setShowBarCodeScanner(false)} 
                  style={{width: '100%'}}
                />
              }
            </View>
          )}
        </View>
      }
      return <View style={styles.container}>
        <View style={styles.explanationText}>
          <StyledText style={{fontSize: 20}}>
            {'\n'}
            Report: I have <HighlightText>COVID-19</HighlightText>
          
            {'\n'}{'\n'}
            Your health authority will have provided you with a QR code to scan.
          </StyledText>
        </View>
        {(hasPermission === false || errorMessage) ? <View style={styles.errorContainer}>
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
          />
        </View>
      </View>
    }}
  </UserStatusConsumer>
}

export default ReportInfectedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontFamily: 'Avenir-Roman',
  },
  errorContainer: {
    flex: 3,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
  },
  errorMessage: {
    fontSize: 17,
    color: Colors.errorText,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: Colors.errorBackground,
  },
}) 
