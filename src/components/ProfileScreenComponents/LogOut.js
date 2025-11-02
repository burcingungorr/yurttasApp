import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/usernameSlice';
import { clearRoom } from '../../redux/roomSlice';

const LogOut = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            dispatch(clearUser());
            dispatch(clearRoom());
            
            setIsLoggedIn(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
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