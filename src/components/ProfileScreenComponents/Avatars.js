import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const avatars = [
  { name: 'avatar1.png', source: require('../../assets/avatars/avatar1.png') },
  { name: 'avatar2.png', source: require('../../assets/avatars/avatar2.png') },
  { name: 'avatar3.png', source: require('../../assets/avatars/avatar3.png') },
  { name: 'avatar4.png', source: require('../../assets/avatars/avatar4.png') },
  { name: 'avatar5.png', source: require('../../assets/avatars/avatar5.png') },
  { name: 'avatar6.png', source: require('../../assets/avatars/avatar6.png') },
  { name: 'default.png', source: require('../../assets/avatars/default.png') },
];

const AvatarSelector = () => {
  const currentUserId = useSelector(state => state.username.uid); 
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[6].source);
  const [isSelectorVisible, setSelectorVisible] = useState(false);

  useEffect(() => {
    const loadAvatar = async () => {
        const userDoc = await firestore().collection('users').doc(currentUserId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const avatarName = userData?.avatar || 'default.png'; 
          const avatar = avatars.find((avatar) => avatar.name === avatarName);
          if (avatar) {
            setSelectedAvatar(avatar.source);
          }
        }
    
    };

    loadAvatar();
  }, [currentUserId]);

  const handleAvatarPress = () => {
    setSelectorVisible(true);
  };

  const handleSelect = async (avatarName) => {
      const avatar = avatars.find((avatar) => avatar.name === avatarName);
      if (avatar) {
        await firestore()
        .collection('users')
        .doc(currentUserId)
        .update({
          avatar: avatar.name,
        });
        setSelectedAvatar(avatar.source); 
        setSelectorVisible(false);
      }

  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleAvatarPress}>
        <Image source={selectedAvatar} style={styles.mainAvatar} />
      </TouchableOpacity>

      <Modal visible={isSelectorVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Avatarını seç</Text>
            <View style={styles.avatarContainer}>
              {avatars.map((avatar, index) => (
                <TouchableOpacity key={index} onPress={() => handleSelect(avatar.name)}>
                  <Image
                    source={avatar.source}
                    style={[
                      styles.avatar,
                      selectedAvatar === avatar.source && styles.selectedAvatar,
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={() => setSelectorVisible(false)}>
              <Text style={styles.closeText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  mainAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#f48022',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    margin: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#87CEFA',
  },
  closeText: {
    marginTop: 10,
    color: 'white',
    backgroundColor: '#191970',
    fontSize: 16,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
});

export default AvatarSelector;
