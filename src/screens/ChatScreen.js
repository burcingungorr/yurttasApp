import React from 'react'
import { StyleSheet, View } from 'react-native'
import Title from '../components/Title'
import OtherUsers from '../components/ChatScreenComponents/OtherUsers'
import Messaging from '../components/ChatScreenComponents/Messaging'


const ChatScreen = () => {
  return (
    <View style={styles.screenContainer}>
        <View style={styles.container}>
          <Title title="Mesajlar"/>
          <OtherUsers/>
        </View>
        <Messaging />
      <View style={styles.messageInputContainer} />
    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor:'white'
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    backgroundColor: '#007AFF',
  },
  messageInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
  },
})
