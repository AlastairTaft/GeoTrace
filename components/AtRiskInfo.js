import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import StyledText from './StyledText'
import COLOURS from './../constants/Colors'

const AtRiskInfo = props => {
  return <View>
      <StyledText>You have crossed paths with people who have self identified as having 
        COVID-19 at these points in time.</StyledText>
    <View style={styles.tableContainer}>
      {props.atRiskLocationData.map((feature, i) => <View 
        style={[
          styles.tableItem,
          i % 2 == 1 ? styles.tableAltItem : undefined,
        ]}
      >
        <Text>{formatDate(feature.properties.timestamp)}</Text>
      </View>)}
    </View>
  </View>
}

export default AtRiskInfo

const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: COLOURS.tabIconDefault,
  },
  tableItem: {
    padding: 5,
  },
  tableAltItem: {
    backgroundColor: COLOURS.noticeBackground,
  },
})

function formatDate(epoch){
  var date = new Date(epoch)
  return getReadbleDateTimeString(date)
}


/**
 * Gets a readable date string. e.g. Tue Jul 17th at 1PM
 * @param {Date} date
 * @returns {string}
 */
const getReadbleDateTimeString = date => {
  return getReadbleDateString(date) + ' at ' + getShortTime(date)
}


/**
 * Gets a readable date string. e.g. Tue Jul 17th
 * @param {Date} date
 * @returns {string}
 */
const getReadbleDateString = date => {
  return (
    getShortWeekDay(date.getDay()) +
    ' ' +
    getShortMonth(date.getMonth()) +
    ' ' +
    getDescriptiveDate(date.getDate())
  )
}


/**
 * Gets the short week name of a date e.g. Tue, Wed, Thu
 * @param {number} day 0 to 6 (Sunday is 0, same as what's returned from getDay())
 * @returns {string}
 */
const getShortWeekDay = day => {
  switch (day) {
    case 0:
      return 'Sun'
    case 1:
      return 'Mon'
    case 2:
      return 'Tue'
    case 3:
      return 'Wed'
    case 4:
      return 'Thu'
    case 5:
      return 'Fri'
    case 6:
      return 'Sat'
    default:
      throw new InvalidRequest('Invalid weekday')
  }
}


/**
 * Gets the short month name of a date e.e. Jan, Feb, Mar
 * @param {number} 0 to 11
 * @returns {string}
 */
export const getShortMonth = monthInt => {
  switch (monthInt) {
    case 0:
      return 'Jan'
    case 1:
      return 'Feb'
    case 2:
      return 'Mar'
    case 3:
      return 'Apr'
    case 4:
      return 'May'
    case 5:
      return 'Jun'
    case 6:
      return 'Jul'
    case 7:
      return 'Aug'
    case 8:
      return 'Sep'
    case 9:
      return 'Oct'
    case 10:
      return 'Nov'
    case 11:
      return 'Dec'
    default:
      throw new InvalidRequest('Invalid month')
  }
}

/**
 * Gets the date with 'st', 'th', etc appended.
 * @param {number} 1 to 31
 * @returns {string}
 */
export const getDescriptiveDate = date => {
  switch (date) {
    case 1:
    case 21:
    case 31:
      return date + 'st'
    case 2:
    case 22:
      return date + 'nd'
    case 3:
    case 23:
      return date + 'rd'
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
      return date + 'th'
    default:
      throw new InvalidRequest('Invalid date')
  }
}


/**
 * Get a date's time in a readable format eg. 11AM, 1PM
 * If its noon it will return 'Noon' and 'Midnight' for 12AM so avoid
 * ambiguity between AM and PM
 * @param {date} date
 * @param {boolean} unambiguous12hour Defaults to true, when specified shows
 * 12:00 as Noon and 00:00 as midnight else sticks to 12:00 and 00:00
 * @returns {string}
 */
const getShortTime = (date, unambiguous12hour = true) => {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var meridiem = hours / 12 >= 1 ? 'PM' : 'AM'
  if (minutes == 0) {
    if (unambiguous12hour) {
      if (hours == 0) return 'Midnight'
      if (hours == 12) return 'Noon'
    }
    if (meridiem == 'PM') {
      hours = hours - 12
      return hours + 'PM'
    }
    return hours + 'AM'
  }
  // Format the minutes to 2dp
  minutes += ''
  if (minutes.length == 1) minutes = '0' + minutes

  return hours + '.' + minutes + meridiem
}