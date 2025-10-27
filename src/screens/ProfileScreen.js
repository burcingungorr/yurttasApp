import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Username from '../components/ProfileScreenComponents/Username';
import MyTasks from '../components/ProfileScreenComponents/MyTasks';
import AvatarSelector from '../components/ProfileScreenComponents/Avatars';
import Title from '../components/Title';

import Notification from '../components/ProfileScreenComponents/Notification';
import Settings from '../components/ProfileScreenComponents/Settings';

const ProfileScreen = ({ setIsLoggedIn }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <View style={styles.downcontainer}>  
        <Title title="Profil" />
        <Notification/>
        <Settings/>
        <AvatarSelector />
        <Username />
        </View>
        <MyTasks />

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 20,
  },

  downcontainer:{
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }
});
