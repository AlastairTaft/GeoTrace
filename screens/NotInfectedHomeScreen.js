import React, { useEffect, useState, Fragment } from 'react'
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

var getAtRiskLocationHistory = async () => {
  var uniqueId = await getDeviceId()
  return trackAPI.getAtRiskHistoricPositions(uniqueId)
}


const NotInfectedHomeScreen = props => {

  var [showModal, setShowModal] = useState(false)
  var [atRiskHistoricData, setAtRiskHistoricData] = useState([])

  var getAtRiskData = () => {
    getAtRiskLocationHistory()
    .then(atRiskData => {
      setAtRiskHistoricData(atRiskData.features)
    })
  }

  useEffect(getAtRiskData, [])

  
}

export default NotInfectedHomeScreen

