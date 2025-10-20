import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['tr'] = {
  monthNames: [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ],
  monthNamesShort: [
    'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem',
    'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'
  ],
  dayNames: [
    'Pazar', 'Pazartesi', 'Salı', 'Çarşamba',
    'Perşembe', 'Cuma', 'Cumartesi'
  ],
  dayNamesShort: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

const CalendarComponent = ({ selectedDate, setSelectedDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const getDayName = (dateString) => {
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCalendar} style={styles.dateContainer}>
        <Text style={styles.dateText}>
          {selectedDate} - {getDayName(selectedDate)}
        </Text>
        <Text style={styles.toggleIcon}>{showCalendar ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {showCalendar && (
        <Calendar
          onDayPress={onDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#00adf5' }
          }}
          theme={{
            todayTextColor: '#00adf5',
            arrowColor: '#00adf5',
          }}
          firstDay={1}
          monthFormat={'MMMM yyyy'}
        />
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginLeft:5,
    
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    height:55,
    elevation:10,

  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  toggleIcon: {
    fontSize: 16,
    color: '#2288f6',
  },
});

export default CalendarComponent;