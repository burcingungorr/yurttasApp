import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageInput = ({ newMessage, setNewMessage, sendMessage,handleTyping,stopTyping }) => {
  return (
    <View style={styles.container}>
      <TextInput
  placeholder="Mesaj Yaz..."
  value={newMessage}
  onChangeText={(text) => {
    setNewMessage(text);
    handleTyping();
  }}
  onBlur={stopTyping}
  onEndEditing={stopTyping}

  style={styles.input}
/>

      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Icon name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize:16
  },
  sendButton: {
    padding: 9,
    borderRadius:50,
    backgroundColor: '#007AFF',

  },
});

export default MessageInput;
