import React from 'react'
import { View, StyleSheet } from 'react-native'
import StyledText from './../components/StyledText'
import HighlightText from './../components/HighlightText'
import HeaderText from './../components/HeaderText'
import { Consumer as UserStatusConsumer } from './../global/userStatus'

const TrackingScreen = props => {
  return <UserStatusConsumer>
    {status => {
      if (status.infected){
        return <View style={styles.content}>
          <StyledText><HighlightText>Thankyou</HighlightText> for reporting your diagnosis. 
          Your location is being anonymously tracked to help warn others. 
          </StyledText>
        </View>
      }
      if (status.atRisk){
        return <View style={styles.content}>
          <HeaderText>At Risk</HeaderText>
          <StyledText>You may have crossed 
          paths with a virus carrier. This does not mean you are infected but it is
          recommended you <HighlightText>stay home</HighlightText> and <HighlightText>isolate</HighlightText>.
          </StyledText>
        </View>
      }
      return <View style={styles.content}>
        <StyledText><HighlightText>No</HighlightText> exposure detected.
        </StyledText>
      </View>
    }}
  </UserStatusConsumer>
}

export default TrackingScreen

const styles = StyleSheet.create({
  content: {
    paddingTop: 50,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: 'white',
    minHeight: '100%',
  }, 
})

