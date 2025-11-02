import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';

const avatars = [
  { name: 'avatar1.png', source: require('../../assets/avatars/avatar1.png') },
  { name: 'avatar2.png', source: require('../../assets/avatars/avatar2.png') },
  { name: 'avatar3.png', source: require('../../assets/avatars/avatar3.png') },
  { name: 'avatar4.png', source: require('../../assets/avatars/avatar4.png') },
  { name: 'avatar5.png', source: require('../../assets/avatars/avatar5.png') },
  { name: 'avatar6.png', source: require('../../assets/avatars/avatar6.png') },
  { name: 'avatar7.png', source: require('../../assets/avatars/avatar7.png') },
  { name: 'avatar8.png', source: require('../../assets/avatars/avatar8.png') },
  { name: 'avatar9.png', source: require('../../assets/avatars/avatar9.png') },
  { name: 'avatar10.png', source: require('../../assets/avatars/avatar10.png') },
  { name: 'avatar11.png', source: require('../../assets/avatars/avatar11.png') },
  { name: 'avatar12.png', source: require('../../assets/avatars/avatar12.png') },
  { name: 'avatar13.png', source: require('../../assets/avatars/avatar13.png') },
  { name: 'avatar14.png', source: require('../../assets/avatars/avatar14.png') },
  { name: 'avatar15.png', source: require('../../assets/avatars/avatar15.png') },
  { name: 'default.png', source: require('../../assets/avatars/default.png') },
];


const MessageItem = ({ item, currentUserId }) => {
  const [senderAvatar, setSenderAvatar] = useState(null);
  const isMe = item.senderId === currentUserId;

  let timeString = '';
  if (item.timestamp) {
    const ts = item.timestamp.toDate ? item.timestamp.toDate() : item.timestamp;
    timeString = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (item.localTime) {
    timeString = new Date(item.localTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  useEffect(() => {
    const fetchSenderAvatar = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(item.senderId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const avatarName = userData?.avatar || 'default.png';
          const avatar = avatars.find((avatar) => avatar.name === avatarName);
          if (avatar) setSenderAvatar(avatar.source);
        }
      } catch (error) {
        console.error('Avatar fetch error:', error);
      }
    };

    fetchSenderAvatar();
  }, [item.senderId]);

  return (
    <View style={[styles.messageContainer, isMe ? styles.myMessageContainer : styles.otherMessageContainer]}>
      {!isMe && senderAvatar ? (
        <View style={styles.avatar}>
          <Image source={senderAvatar} style={styles.avatarImage} />
        </View>
      ) : !isMe && (
        <View style={styles.avatar}>
          <Icon name="account-circle" size={36} color="#555" />
        </View>
      )}

      <View style={[styles.messageBubble, isMe ? styles.myMessageBubble : styles.otherMessageBubble]}>
        <Text style={styles.senderName}>
          {isMe ? 'Ben' : item.username || 'Diğer Kullanıcı'}
        </Text>

        <Text style={styles.messageText}>{item.text}</Text>

        <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.otherTimeText]}>
          {timeString}
        </Text>
      </View>

      {isMe && senderAvatar ? (
        <View style={styles.avatar}>
          <Image source={senderAvatar} style={styles.avatarImage} />
        </View>
      ) : isMe && (
        <View style={styles.avatar}>
          <Icon name="account-circle" size={36} color="#555" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginHorizontal: 8,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
  },
  myMessageBubble: {
    backgroundColor: '#f48022',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 17,
    color: 'white',
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  myTimeText: {
    color: 'white',
    fontSize: 14,
  },
  otherTimeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default MessageItem;
