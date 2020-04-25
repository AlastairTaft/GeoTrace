import React, { Fragment } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
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
import { Consumer as BackgroundTrackingConsumer } from './BackgroundScriptWrapper'
import AtRiskInfo from './../components/AtRiskInfo'
import StyledText from './../components/StyledText'
import HeaderText from './../components/HeaderText'
import EmphasizedText from './../components/EmphasizedText'
import LinkText from './../components/LinkText'
import HighlightText from './../components/HighlightText'
import Modal from './../components/Modal'
import TextLogo from './../assets/images/TextLogo'
import { headerColor, headerSize, linkColor, linkSize } from '../styles/text'
import Divider from './../components/Divider'
import Neighbourhood from './../assets/images/Neighbourhood'

export default function HomeScreen() {

  return (
    <View style={styles.container}>
        
      <View style={styles.headerContainer}>
        <HeaderText style={styles.mainHeader}>
        COVID-19
        </HeaderText>
      </View>
      <View style={styles.statusContainer}>
        <HeaderText>
          <Icon name="verified-user" backgroundColor={headerColor} size={headerSize} />
          No exposure detected.
          </HeaderText>
      </View>
      <View style={styles.contentContainer}>
        <Text />
        <EmphasizedText>
          Based on available location data, you have not been in contact with COVID-19.
        </EmphasizedText>
        <Text />
        <LinkText>Learn about privacy <Icon name="keyboard-arrow-right" backgroundColor={linkColor} size={linkSize * 1.5} /></LinkText>
      </View>
      <View style={styles.buttonsContainer}>
        <Neighbourhood />
      </View>
    </View>
  )
}

HomeScreen.navigationOptions = {
  header: null,
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0d0b',
  },

  button: {
    borderRadius: 12
  },

  mainHeader: {
    color: "white"
  },

  headerContainer: {
    flex: 1,
    flexDirection: "column",
    marginTop: "30%",
    marginLeft: 15
  },

  statusContainer: {
    flex: 2,
    alignItems: "flex-end",
    flexDirection: 'row',
    marginLeft: 15,
    marginRight: 30
  },
  contentContainer: {
    flex: 3,
    paddingLeft: 15,
    paddingRight: 30,
  },
  buttonContainer: {
    flex: 3,
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  errorMessage: {
    fontSize: 17,
    color: Colors.errorText,
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: Colors.errorBackground,
  },
});

// const TrackingMessage = props => <PermissionsConsumer>
//   {permissionsOk => {
//     if (permissionsOk){
//       return <BackgroundTrackingConsumer>
//         {trackingScriptInstalled => {
//           if (trackingScriptInstalled)
//             return <Fragment>
//               <StyledText>
//                 Your location is being <HighlightText>anonymously</HighlightText> tracked. 
              
//               </StyledText>
//             </Fragment>
//           return <View>
//             <Text style={styles.errorMessage}>
//               Background tracking not yet running...
//             </Text>
//             <Text />
//             <Button 
//               onPress={Updates.reloadAsync}
//               title="Reload"
//             />
//           </View>

//         }}
//       </BackgroundTrackingConsumer>
//     }
//     return <Text style={styles.errorMessage}>
//       Unable to get required location tracking permissions from your
//       device.
//     </Text>
//   }}
// </PermissionsConsumer>
