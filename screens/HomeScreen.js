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
        
      <View style={styles.contentContainer}>
        <View>
          <Icon name="verified-user" color={headerColor} size={headerSize} />
        </View>
        <HeaderText>
          No exposure detected
        </HeaderText>
        <EmphasizedText style={styles.emphasized}>
          Based on available location data, you have not been in contact with COVID-19.
        </EmphasizedText>
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
    backgroundColor: '#ffffff',
  },

  contentContainer: {
    flex: 2.6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  emphasized: {
    paddingTop: 30,
    marginLeft: "10%",
    marginRight: "10%"
  },

  dividerContainer: {
    flex: 0.8,
    alignItems: 'center',
  },
  // contentContainer: {
  //   flex: 3,
  //   paddingLeft: 30,
  //   paddingRight: 30,
  // },
  illustrationContainer: {
    flex: 3,
    alignItems: 'flex-end',
    flexDirection: 'row',
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