import React, { useState } from 'react'
import { View, StyleSheet, Vibration } from 'react-native'

import { BarCodeScanner } from 'expo-barcode-scanner'

import { useHeaderHeight } from '@react-navigation/stack'
import { Pulse } from 'react-native-loader'
import BarcodeMask  from 'react-native-barcode-mask'

import { getDeviceId } from './../global/deviceId'
import * as trackAPI from '../global/centralAPI'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

import HeaderText from './../components/HeaderText'
import EmphasizedText from '../components/EmphasizedText'

export default ({ navigation }) => {
  var [scanned, setScanned] = useState(false)
  const headerHeight = useHeaderHeight()

  const renderScan = () => {
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

            try {
              const report = await trackAPI.checkAnalysisReport(data)
              if (!report) {
                navigation.goBack()
                navigation.navigate('ReportFailed')
              }
              if(!report.used) {
                // TODO: Report infected
                await trackAPI.reportInfected()
              }
              navigation.goBack()
              navigation.navigate('ReportThankYou')
            } catch(e) {
              navigation.goBack()
              navigation.navigate('ReportFailed')
            }
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
    <View style={[StyleSheet.create({paddingTop: headerHeight}), styles.container]}>
      <HeaderText style={styles.headerText}>
        QR Scan
      </HeaderText>

      <View style={styles.contentContainer}>
        { renderScan() }
      </View>
    </View>
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
  headerText: {
    fontSize: SIZES.reportHeaderSize,
    color: COLORS.altTintColor,
    textAlign: "left",
    marginBottom: 50
  },
  scanner: {
    height: "100%",
    width: "100%"
  },
})
