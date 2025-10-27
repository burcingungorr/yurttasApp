import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import RoomModals from '../components/LoginScreenComponents/RoomModals';
import LoginImage from '../components/LoginScreenComponents/LoginImage';

const LoginScreen = ({ setIsLoggedIn }) => {
  const username = useSelector((state) => state.username.savedUsername);

  useEffect(() => {
    if (!username) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true); // kullanıcı adı varsa girişte kalsın
    }
  }, [username, setIsLoggedIn]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 18, backgroundColor: '#FFFDF7' }}>
      <LoginImage />
      <RoomModals setIsLoggedIn={setIsLoggedIn} />
    </View>
  );
};

export default LoginScreen;
