import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import HeaderText from './../components/HeaderText'
import StyledText from './../components/StyledText'
import ConfirmIllustration from './../assets/images/Confirm'
import HighlightText from './../components/HighlightText'

const ReportThankyouScreen = props => {
  return <View style={styles.content}>
    <HeaderText>Thank you</HeaderText>
    <StyledText style={{fontSize: 20}}>For reporting your diagnosis</StyledText>
    <View style={styles.illustrationContainer}>
      <ConfirmIllustration />
    </View>
    <StyledText style={{fontSize: 20}}>
      Your location is being <HighlightText>anonymously</HighlightText> tracked to inform others
      who may be at risk.
    </StyledText>
    <Text />
  </View>
}

export default ReportThankyouScreen

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 50,
    minHeight: '100%',
    paddingLeft: 30,
    paddingRight: 30,
  },
  illustrationContainer: {
    marginTop: 50,
    marginBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
