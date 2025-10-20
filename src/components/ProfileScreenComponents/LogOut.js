import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogOut = ({setIsLoggedIn}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setIsLoggedIn(false)}>
        <Icon name="logout" size={21} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginRight:10,
    marginTop:20,
    paddingHorizontal:10

  },
  button: {
    backgroundColor: '#f48022',
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LogOut;
