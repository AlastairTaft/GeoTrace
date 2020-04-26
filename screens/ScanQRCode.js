import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Button from './../components/Button'
import Icon from 'react-native-vector-icons/MaterialIcons'
import HeaderText from './../components/HeaderText'
import LinkText from '../components/LinkText'
import Modal from './../components/Modal'
import DaysSelectControl from './../components/DaysSelectControl'
import { Consumer as UserStatusConsumer } from './../global/userStatus'
import ReportThankyouScreen from './ReportThankyouScreen'
import * as centralAPI from './../global/centralAPI'
import { getDeviceId } from './../global/deviceId'

import { useHeaderHeight } from '@react-navigation/stack'

import SIZES from '../constants/Sizes'
import COLORS from '../constants/Colors'

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default ({ navigation: { goBack } }) => {
  var [scanned, setScanned] = useState(false)
  const headerHeight = useHeaderHeight()
  return (
    <View style={StyleSheet.create({paddingTop: headerHeight})}>
      <HeaderText style={styles.headerText}>
        QR Scan
      </HeaderText>
      <BarCodeScanner
        style={styles.scanner}
        type={BarCodeScanner.Constants.Type.back}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        onBarCodeScanned={scanned ? undefined : async function({ data, type }) {
          var deviceId = await getDeviceId()
          await status.reportInfected(deviceId, data)
        }}
      >
      </BarCodeScanner>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
    // backgroundColor: "#ffffff",
  },

  headerText: {
    fontSize: SIZES.reportHeaderSize,
    color: COLORS.altTintColor,
    textAlign: "left",
  },

  scanner: {
    height: height * 0.8,
    width: width * 0.8,
    marginLeft: "10%",
    borderRadius: 10,
    overflow: "hidden"
  }
})
