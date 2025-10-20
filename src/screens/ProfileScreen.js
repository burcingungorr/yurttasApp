import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import Username from '../components/ProfileScreenComponents/Username';
import MyTasks from '../components/ProfileScreenComponents/MyTasks';
import AvatarSelector from '../components/ProfileScreenComponents/Avatars';
import Title from '../components/Title';
import LogOutRoom from '../components/ProfileScreenComponents/LogOutRoom';
import LogOut from '../components/ProfileScreenComponents/LogOut';
import MyRoom from '../components/ProfileScreenComponents/MyRoom';
import Notification from '../components/ProfileScreenComponents/Notification';

const ProfileScreen = ({ setIsLoggedIn }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} >
        <View style={styles.downcontainer}>  
        <Title title="Profil" />
        <Notification/>
        <AvatarSelector />
        <Username />
        </View>
        <MyTasks />

<MyRoom/>

        <View style={styles.logoutContainer}>
        <LogOutRoom setIsLoggedIn={setIsLoggedIn} />
        <LogOut setIsLoggedIn={setIsLoggedIn}/>
        </View>
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
  logoutContainer: {
    flexDirection: 'row', 
  },
  downcontainer:{
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  }
});
