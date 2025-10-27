import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const Users = () => {
  const roomCode = useSelector(state => state.room.currentRoom?.code);
  const [roommates, setRoommates] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('roommates')
      .onSnapshot(
        snapshot => {
          const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              username: data.username || 'Bilinmeyen Kullanıcı',
            };
          });
          setRoommates(users);
        },
        error => {
          console.error('Firestore error:', error);
        }
      );

    return () => unsubscribe();
  }, [roomCode]);

  return (
    <View style={styles.container}>
      <View style={styles.user_row}>
        {roommates.map((user, index) => (
          <Text key={user.id} style={styles.user_text}>
            {user.username}
            {index < roommates.length - 1 ? ', ' : ''}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  container: {
  },
  user_row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  user_text: {
    color: 'black',
    fontSize: 16,
    fontWeight:'500'
  },
});
