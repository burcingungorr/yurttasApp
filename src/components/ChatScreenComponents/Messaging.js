import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import firestore from '@react-native-firebase/firestore'; 
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';

const Messaging = () => {
  const currentUserId = useSelector(state => state.username.uid);
  const username = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code); 

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false); 

  const flatListRef = useRef();

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    const socketConnection = io('http://10.0.2.2:3000', {
      transports: ['websocket'],
      query: { userId: currentUserId },
    });

    socketConnection.on('connect', () => {
      console.log('Socket connected:', socketConnection.id);
      setSocket(socketConnection);
    });

    socketConnection.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    socketConnection.on('typing', (username) => {
      if (username) {
        setIsTyping(`${username} yazıyor...`);
      } else {
        setIsTyping(false); 
      }
    });
  
    socketConnection.on('stopTyping', () => {
      setIsTyping(false); 
    });

    socketConnection.on('message', (message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message.text,
          senderId: message.senderId,
          username: message.username,
          timestamp: message.timestamp,
        },
      ]);
    });

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('messages')
      .orderBy('timestamp')
      .onSnapshot((querySnapshot) => {
        const fetched = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setMessages(fetched);
      });

    return () => {
      socketConnection.disconnect();
      unsubscribe();
    };
  }, [currentUserId, roomCode]);

  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', username);  
    }
  };
  
  const stopTyping = () => {
    if (socket) {
      socket.emit('stopTyping');  
      setIsTyping(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !socket) return;

    stopTyping(); 

    const messageData = {
      text: newMessage,
      senderId: currentUserId,
      username: username,
      timestamp: new Date().getTime(),
    };

    socket.emit('chatMessage', messageData);

    await firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('messages')
      .add(messageData);

    setNewMessage('');
  };

  const renderMessageItem = ({ item }) => (
    <MessageItem item={item} currentUserId={currentUserId} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        keyboardShouldPersistTaps="handled"
      />

      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>{isTyping}</Text>
        </View>
      )}

      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
        stopTyping={stopTyping} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginBottom: 5,
    paddingTop: 5,
  },
  messagesList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingContainer: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  typingText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: 'black',
  },
});

export default Messaging;
