import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import LottieView from 'lottie-react-native';

const Spends = () => {
  const userName = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

  const [spends, setSpends] = useState([]);
  const [roommates, setRoommates] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('spends')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedSpends = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSpends(fetchedSpends);
      });

    return () => unsubscribe();
  }, [roomCode]);

  
  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('roommates')
      .onSnapshot(snapshot => {
        const users = snapshot.docs.map(doc => doc.data()); 
        setRoommates(users);
      });

    return () => unsubscribe();
  }, [roomCode]);



const handleDelete = (id) => {
  Alert.alert(
    'Harcama Silinsin mi?',
    'Bu harcamayı silmek istediğinizden emin misiniz?',
    [
      {
        text: 'İptal',
        style: 'cancel',
      },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          await firestore()
            .collection('rooms')
            .doc(roomCode)
            .collection('spends')
            .doc(id)
            .delete();
        },
      },
    ],
    { cancelable: true }
  );
};


  const total = spends.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const perPerson = roommates.length > 0 ? (total / roommates.length).toFixed(2) : 0;

  return (
    <View style={styles.container}>
      {spends.length === 0 ? (
        <View style={styles.lottieContainer}>
         {/*
<LottieView
  source={require('../../assets/animations/spend.json')}
  autoPlay
  loop
  style={styles.lottie}
/>
*/}

          <Text style={styles.noDataText}>Henüz hiç harcama eklenmedi.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={spends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <View style={styles.item_row}>
                  <Text style={styles.item_text}>{item.title}</Text>
                  <Text style={styles.amount_text}>{item.amount}₺</Text>
                </View>

                <Text style={styles.container_text}>
                  ({item.user} tarafından alındı.)
                </Text>

                {item.user === userName && (
                  <TouchableOpacity
                    style={styles.delete_button}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Icon name="delete" size={22} color="grey" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
          <Text style={styles.total_pay}>Toplam : {total}₺</Text>
          <Text style={styles.user_pay}>(Kişi Başı : {perPerson}₺)</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    height: '87%',
  },
  item: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 20,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#f48022',
    elevation: 3,
  },
  item_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item_text: {
    fontSize: 18,
    margin: 5,
  },
  amount_text: {
    fontSize: 18,
    margin: 5,
  },
  container_text: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  delete_button: {
    position: 'absolute',
    bottom: 7,
    right: 20,
    zIndex: 1,
  },
  total_pay: {
    margin: 6,
    fontSize: 15,
  },
  user_pay: {
    margin: 6,
    fontSize: 15,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom:100

  },
  lottie: {
    width: 250,
    height: 250,  
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
    color: '#666',
  }
});

export default Spends;
