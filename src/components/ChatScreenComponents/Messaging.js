import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
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

  // 🔹 Mesajlar değişince en alta kaydır
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 🔹 Firestore mesaj dinleyicisi
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

  // 🔹 Mesaj gönderme
  const sendMessage = async () => {
    if (newMessage.trim() === '' || !roomCode) return;

    const messageData = {
      text: newMessage.trim(),
      senderId: currentUserId,
      username: username,
      timestamp: firestore.FieldValue.serverTimestamp(),
      localTime: new Date().toISOString(), // ✅ eklendi
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
});

export default Messaging;
