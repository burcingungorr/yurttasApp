import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
          <LottieView
            source={require('../../assets/animations/spend.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.noDataText}>Henüz hiç harcama eklenmedi.</Text>
        </View>
      ) : (
        <>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryBadge}>
              <Text style={styles.badgeLabel}>Toplam</Text>
              <Text style={styles.badgeValue}>{total.toFixed(2)}₺</Text>
            </View>
            <View style={styles.summaryBadge}>
              <Text style={styles.badgeLabel}>Kişi Başı</Text>
              <Text style={styles.badgeValue}>{perPerson}₺</Text>
            </View>
          </View>

          <FlatList
            data={spends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.spendCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.titleText}>{item.title}</Text>
                  <Text style={styles.amountText}>{item.amount}₺</Text>
                </View>

                <Text style={styles.userText}>
                  {item.user} tarafından alındı
                </Text>

                {item.user === userName && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  spendCard: {
    padding: 14,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 2,

  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  amountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    paddingRight: 14,
    paddingTop: 10,
  },
  userText: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
  },
  deleteButton: {
    position: 'absolute',
    right: -1,
    top: -2,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#f48022',
    fontSize: 22,
    fontWeight: 'bold',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  summaryBadge: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginHorizontal: 4,
    elevation:4
  },
  badgeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  badgeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 100,
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
  },
});

export default Spends;