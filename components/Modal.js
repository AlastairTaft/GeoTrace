import React from 'react'
import { StyleSheet, View, Modal as ModalReact } from 'react-native'
import CloseButton from './../components/CloseButton'

const Modal = props => {
  return <ModalReact
    animationType="fade"
    transparent={true}
    visible={props.visible}
    onRequestClose={props.onRequestClose}
  >
    <View 
      style={styles.modalOuter}
    >
      <View style={styles.modalInner}>
        {props.children}
        <CloseButton 
          style={styles.closeButton} 
          onPress={props.onRequestClose}
        />
      </View>
    </View>
  </ModalReact>
}

export default Modal

const styles = StyleSheet.create({
  modalOuter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
  },
  modalInner: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    maxHeight: '80%',
    borderRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: 5,
    width: 50,
    height: 50,
    borderWidth: 0,
  },
})
