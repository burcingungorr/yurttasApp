import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const RoomInfo = () => {
  const savedUsername = useSelector((state) => state.username.savedUsername);
  const currentRoom = useSelector((state) => state.room.currentRoom);
  const error = useSelector((state) => state.room.error);

  return (
    <View style={styles.container}>
    
    {savedUsername ? (
        <Text style={styles.username}>{savedUsername}</Text>
      ) : (
        <Text style={styles.error}>Kullanıcı adı kaydedilmedi.</Text>
      )}
      {currentRoom ? (
        <Text style={styles.roomName}>{currentRoom.name}</Text>
      ) : (
        <Text style={styles.error}>Odaya katılmadınız.</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
   
    </View>
  );
};

export default RoomInfo;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 15,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white', 
    margin:10
  },
  roomName: {
    fontSize: 18,
    color: 'white', 
  },
  error: {
    fontSize: 14,
    color: 'red', 
  },
});
