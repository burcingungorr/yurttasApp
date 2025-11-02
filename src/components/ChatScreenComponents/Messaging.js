import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';
import MessageInput from './MessageInput';
import MessageItem from './MessageItem';

const Messaging = () => {
  const currentUserId = useSelector(state => state.username.uid);
  const username = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

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
    if (!roomCode) return;

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

    return () => unsubscribe();
  }, [roomCode]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' || !roomCode) return;

    const messageData = {
      text: newMessage.trim(),
      senderId: currentUserId,
      username: username,
      timestamp: firestore.FieldValue.serverTimestamp(),
      localTime: new Date().toISOString(), 
    };

    await firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('messages')
      .add(messageData);

    setNewMessage('');
    setIsTyping(false);
  };

  const handleTyping = (typing) => setIsTyping(typing);

  const renderMessageItem = ({ item }) => (
    <MessageItem item={item} currentUserId={currentUserId} />
  );

  return (
    <View style={styles.container}>
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LottieView
            source={require('../../assets/animations/messaging.json')} 
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.emptyText}>Henüz mesaj yok</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesList}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {isTyping && (
        <View style={styles.typingContainer}>
          <Text style={styles.typingText}>Yazıyor...</Text>
        </View>
      )}

      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        handleTyping={handleTyping}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default Messaging;
