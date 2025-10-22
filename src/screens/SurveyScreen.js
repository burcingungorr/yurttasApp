import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import AddSurvey from '../components/SurveyScreenComponents/AddSurvey';
import Surveys from '../components/SurveyScreenComponents/Surveys';
import Title from '../components/Title';

const SurveyScreen = () => {
  const [surveys, setSurveys] = useState([]);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

  const parseExpiryDate = (expiryStr) => {
    if (!expiryStr) return new Date(0);
    const [datePart, timePart] = expiryStr.split(' ');
    if (!datePart || !timePart) return new Date(0);
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split('.').map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('surveys')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        let fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        fetched.sort((a, b) => {
          const aExpired = parseExpiryDate(a.expiry) < new Date();
          const bExpired = parseExpiryDate(b.expiry) < new Date();
          if (aExpired === bExpired) return 0;
          return aExpired ? 1 : -1;
        });

        setSurveys(fetched);
      });

    return () => unsubscribe();
  }, [roomCode]);

  return (
    <View style={styles.container}>
      <View style={styles.downcontainer}>
        <Title title={'Anketler'} />
      </View>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <Surveys surveys={surveys} setSurveys={setSurveys} />
      </ScrollView>
      <AddSurvey setSurveys={setSurveys} surveys={surveys} />
    </View>
  );
};

export default SurveyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  downcontainer: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 110,
  },
});
