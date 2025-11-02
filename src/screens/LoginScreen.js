import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import RoomModals from '../components/LoginScreenComponents/RoomModals';
import LoginImage from '../components/LoginScreenComponents/LoginImage';

const LoginScreen = ({ setIsLoggedIn }) => {
  const username = useSelector((state) => state.username.savedUsername);

  useEffect(() => {
    if (!username) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true); 
    }
  }, [username, setIsLoggedIn]);

  return (
    <View style={styles.container}>
      <LoginImage />
      <RoomModals setIsLoggedIn={setIsLoggedIn} />
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  container:{ flex: 1, justifyContent: 'center', padding: 18, backgroundColor: '#FFFDF7' }


});
