import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import { View, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import Tasks from '../components/HomeScreenComponents/Tasks';
import CalendarComponent from '../components/HomeScreenComponents/Calender';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);  // Başlangıçta loading true

  // Örnek: sayfa açılırken veri yükleniyormuş gibi simülasyon
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 1 saniye loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.downcontainer}> 
          <Title title="Görevler" />
          <CalendarComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </View>

        <Tasks selectedDate={selectedDate} />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:'white' },
  downcontainer: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 180,
    zIndex: 1,
    paddingTop: 30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

});

export default HomeScreen;
