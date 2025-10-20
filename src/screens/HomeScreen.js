import React, { useState } from 'react';
import Title from '../components/Title';
import { View, ScrollView, StyleSheet } from 'react-native';
import RoomInfo from '../components/HomeScreenComponents/RoomInfo';
import Tasks from '../components/HomeScreenComponents/Tasks';
import CalendarComponent from '../components/HomeScreenComponents/Calender';

const HomeScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <View style={styles.container}>
      <ScrollView >
        <View style={styles.downcontainer}> 
          <Title title="Görevler" />
          <RoomInfo />
          <CalendarComponent selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        </View>
      
        <Tasks selectedDate={selectedDate} />
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',

  },
  fixedBottom: {
    alignItems: 'center',
  },
  downcontainer: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 220,
    zIndex:1
  },

});

export default HomeScreen;
