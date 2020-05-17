import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { getStoredLocationData } from './../global/storage'
import HighlightText from './../components/HighlightText'
import HeaderText from './../components/HeaderText'

export default function DebugScreen() {

  var [totalLocationPoints, setTotalLocationPoints] = useState(null)
  var [locationDataStr, setLocationDataStr] = useState('')

  useEffect(() => {
    var interval = setInterval(async function(){
      var locationData = await getStoredLocationData()
      setLocationDataStr(
        JSON.stringify(locationData, null, 2).slice(-1000)
      )
      setTotalLocationPoints(Object.keys(locationData).length)
    }, 1000)
    return () => clearInterval(interval)
  })

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <HeaderText>Local Data</HeaderText>
      <View style={styles.twoCol}>
        <View style={styles.col}>
          <HighlightText style={{textAlign: 'left'}}>Total location points</HighlightText>
        </View>
        <View style={styles.col}>
          <Text>{totalLocationPoints || '-'}</Text>
        </View>
      </View>
      <View style={{paddingLeft: 10, paddingRight: 10, marginLeft: 10, marginRight: 10}}>
        <HighlightText style={{textAlign: 'left'}}>Last 1000 chars raw data</HighlightText>
        <View style={styles.rawLocationDataContainer}>
          <Text>{locationDataStr}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  contentContainer: {
    paddingTop: 15,
  },
  twoCol: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  col: {
    flex: 0.5,
    textAlign: 'left',
  },
  rawLocationDataContainer: {
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
  },
})

