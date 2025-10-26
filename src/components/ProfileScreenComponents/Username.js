import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const Username = () => {
  const userName = useSelector(state => state.username.savedUsername);

  // Eğer kullanıcı adı boş veya tanımsızsa "Anonim" yaz
  const displayName = userName && userName.trim() !== '' ? userName : 'Anonim';

  return (
    <View style={styles.container}>
      <Text style={styles.container_text}>{displayName}</Text>
    </View>
  );
};

export default Username;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 25,
  },
  container_text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});
