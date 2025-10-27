import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogOut = ({ setIsLoggedIn }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => setIsLoggedIn(false)}
        activeOpacity={0.7}
      >
        <Icon name="logout" size={21} color="#000" />
        <Text style={styles.text}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  text: {
    color: '#000',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LogOut;
