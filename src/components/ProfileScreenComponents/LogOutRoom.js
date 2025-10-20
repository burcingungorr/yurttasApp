import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const LogOutRoom = ({ setIsLoggedIn }) => {
  const username = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);


  const confirmLogout = () => {
    Alert.alert(
      'Odadan Çıkılsın mı?',
      'Gerçekten odadan çıkmak istiyor musunuz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çık',
          style: 'destructive',
          onPress: handleLogOut,
        },
      ],
      { cancelable: true }
    );
  };

  
  const handleLogOut = async () => {
    try {
      const snapshot = await firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('roommates')
        .where('username', '==', username)
        .get();

      const batch = firestore().batch(); //birden fazla veritabanı işlemi

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setIsLoggedIn(false);

    } catch (error) {
      console.error('Odadan çıkış sırasında hata:', error);
      Alert.alert(
        'Hata',
        'Odadan çıkış sırasında bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }],
      );
    

    }

  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style={styles.button} onPress={confirmLogout}>
  <Text style={styles.buttonText}>Odadan Çık</Text>
</TouchableOpacity>

    </View>
  );
};


 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#fff',
    marginTop:20,
    paddingHorizontal:20

  },

  button: {
    backgroundColor: '#f48022',
    padding: 5,
    borderRadius: 5,
    width:'34%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default LogOutRoom;
