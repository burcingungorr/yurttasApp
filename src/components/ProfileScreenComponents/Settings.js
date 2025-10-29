import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Alert, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import Modal from 'react-native-modal';
import LogOut from './LogOut'; 
import Users from './Users';
import { clearUser } from '../../redux/usernameSlice';
import { clearRoom } from '../../redux/roomSlice';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Settings = ({ setIsLoggedIn }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const username = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);
  const roomName = useSelector(state => state.room.currentRoom?.name);

  const confirmDeleteFromRoom = () => {
    Alert.alert(
      'Odadan Kayıt Sil',
      'Gerçekten bu odadan kaydınızı silmek istiyor musunuz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sil', style: 'destructive', onPress: handleDeleteFromRoom },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteFromRoom = async () => {
    try {
      // Kullanıcının roommates koleksiyonundan kaydını sil
      const snapshot = await firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('roommates')
        .where('username', '==', username)
        .get();

      const batch = firestore().batch();
      snapshot.forEach(doc => batch.delete(doc.ref));
      await batch.commit();

      // Redux state'i temizle
      dispatch(clearUser());
      dispatch(clearRoom());

      setModalVisible(false);
      setIsLoggedIn(false);

      Alert.alert(
        'Başarılı',
        'Odadan kaydınız başarıyla silindi.',
        [{ text: 'Tamam' }]
      );
    } catch (error) {
      console.error('Odadan kayıt silme sırasında hata:', error);
      Alert.alert(
        'Hata', 
        'Odadan kayıt silinirken bir hata oluştu. Lütfen tekrar deneyin.', 
        [{ text: 'Tamam' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Icon name="cog-outline" size={30} color="white" />
      </TouchableOpacity>

      {/* Settings Modal */}
      <Modal
        isVisible={modalVisible}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modalWrapper}
      >
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ayarlar</Text>
          </View>

          {/* Content Area */}
          <View style={styles.contentArea}>
            {/* Oda Adı Kartı */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="home" size={22} color="#007AFF" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Oda Adı</Text>
                  <Text style={styles.infoValue}>{roomName || 'Bilinmiyor'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Oda Kodu Kartı */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="key" size={22} color="#007AFF" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Oda Kodu</Text>
                  <Text style={styles.infoValue}>{roomCode}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Kullanıcılar Kartı */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="account-group" size={22} color="#007AFF" />
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Kullanıcılar</Text>
                  <Users/>
                </View>
              </View>
            </View>

            {/* Boş alan: butonları alta itmek için */}
            <View style={{ flex: 1 }} />

            {/* LogOut ve Odadan Kayıt Sil butonları */}
            <LogOut setIsLoggedIn={setIsLoggedIn} />

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={confirmDeleteFromRoom}
              activeOpacity={0.8}
            >
              <Icon name="delete-forever" size={22} color="white" />
              <Text style={styles.deleteButtonText}>Odadan Kayıt Sil</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: { 
    top: -50, 
    left: 20 ,
    width:50
  },

  settingsButton: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  modalWrapper: {
    margin: 0,
    justifyContent: 'flex-start',
  },

  modalContent: {
    width: SCREEN_WIDTH * 0.75,
    height: '100%',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: { 
    fontSize: 28, 
    color: '#8E8E93', 
    lineHeight: 28 
  },

  modalHeader: { 
    alignItems: 'center', 
    marginTop: 16, 
    marginBottom: 32 
  },

  modalTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },

  contentArea: { 
    flex: 1,
    justifyContent: 'flex-start',
  },

  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    elevation: 2,
  },

  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },

  infoTextContainer: { 
    marginLeft: 16, 
    flex: 1 
  },

  infoLabel: { 
    fontSize: 13, 
    color: '#8E8E93', 
    marginBottom: 4, 
    fontWeight: '500' 
  },

  infoValue: { 
    fontSize: 17, 
    color: '#1A1A1A', 
    fontWeight: '600' 
  },

  divider: { 
    height: 1, 
    backgroundColor: '#fff', 
  },

  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#f48022',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginTop: 15
  },

  deleteButtonText: { 
    color: 'white', 
    fontSize: 17, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
});