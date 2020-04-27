import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Vibration, View } from 'react-native'

import { BarCodeScanner } from 'expo-barcode-scanner'

import { useHeaderHeight } from '@react-navigation/stack'
import { Pulse } from 'react-native-loader'
import BarcodeMask  from 'react-native-barcode-mask'
import { Consumer as UserStatusConsumer } from './../global/userStatus'

import { getDeviceId } from './../global/deviceId'
import * as trackAPI from '../global/centralAPI'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'
import IMAGES from '../constants/Images'

import HeaderStyle from '../styles/HeaderStyle'

import HeaderText from './../components/HeaderText'
import EmphasizedText from '../components/EmphasizedText'

export default ({ navigation }) => {
  var [scanned, setScanned] = useState(false)
  const headerHeight = useHeaderHeight()

  const renderScan = (status) => {
    if(scanned) {
      return (
        <View style={styles.contentContainer}>
          <Pulse
            size={50}
            color={ COLORS.altTintColor }
          />
          <EmphasizedText>
            You are saving lives!
          </EmphasizedText>
        </View>
      )
    } else {
      return (
        <BarCodeScanner
          style={styles.scanner}
          type={BarCodeScanner.Constants.Type.back}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          onBarCodeScanned={scanned ? undefined : async function({ data }) {
            setScanned(true)
            Vibration.vibrate(200)

            const success = await status.reportInfected(data)

            navigation.goBack()
            navigation.navigate(success ? 'ReportThankYou' : 'ReportFailed')
          }}
        >
          <BarcodeMask
            backgroundColor="rgba(255, 255, 255, .1)"
            width="80%"
            height="80%"
            edgeRadius={1}
          />
        </BarCodeScanner>
      )
    }
  }

  return (
    <ImageBackground source={IMAGES.Background} style={IMAGES.BackgroundStyle}>
      <View style={styles.container}>
        <HeaderText style={HeaderStyle}>
          QR Scan
        </HeaderText>

        <View style={styles.contentContainer}>
          <UserStatusConsumer>
          {status => renderScan(status)}
          </UserStatusConsumer>
        </View>
      </View>
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  scanner: {
    height: "100%",
    width: "100%",
    marginTop: "30%",
    marginBottom: "40%"
  },
})
