import React from 'react'
import { View, StyleSheet } from 'react-native'
import HeaderText from './../components/HeaderText'
import Icon from 'react-native-vector-icons/MaterialIcons'
import COLORS from '../constants/Colors'
import SIZES from '../constants/Sizes'
import EmphasizedText from '../components/EmphasizedText'
import { useHeaderHeight } from '@react-navigation/stack'

const ReportFailedScreen = props => {
  const headerHeight = useHeaderHeight()

  return (
    <View style={[StyleSheet.create({paddingTop: headerHeight}), styles.container]}>
      <View style={styles.contentContainer}>
        <View>
          <Icon name="sentiment-dissatisfied" color={COLORS.errorText} size={SIZES.headerSize} />
        </View>
        <HeaderText style={styles.title}>
          Something went wrong
        </HeaderText>
        <EmphasizedText style={styles.emphasized}>
          You can try again later to save lives
        </EmphasizedText>
      </View>
    </View>
  )
}

export default ReportFailedScreen

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
  title: {
    color: COLORS.errorText
  },
  emphasized: {
    paddingTop: "5%",
    marginHorizontal: "10%"
  },
})
