import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Notification = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const roomCode = useSelector(state => state.room.currentRoom?.code);
  const userName = useSelector(state => state.username.savedUsername);

  useEffect(() => {
    if (roomCode && userName) {
      const unsubscribe = firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('notifications')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const notifList = snapshot.docs
            .filter(doc => !doc.data().userDeleted?.includes(userName))
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              read: doc.data().userRead?.includes(userName),
            }));
          setNotifications(notifList);
        });

      return () => unsubscribe();
    }
  }, [roomCode, userName]);

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        firestore()
          .collection('rooms')
          .doc(roomCode)
          .collection('notifications')
          .doc(notification.id)
          .update({
            userRead: firestore.FieldValue.arrayUnion(userName),
          });
      }
    });
  };

  const handleDeleteNotification = id => {
    firestore()
      .collection('rooms')
      .doc(roomCode)
      .collection('notifications')
      .doc(id)
      .update({
        userDeleted: firestore.FieldValue.arrayUnion(userName),
      });
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => {
    handleMarkAllAsRead();
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.notificationItem,
        { backgroundColor: item.read ? '#fff' : '#E0F7FA' },
      ]}
    >
      <Text style={styles.notificationText}>{item.title}</Text>
      <TouchableOpacity onPress={() => handleDeleteNotification(item.id)}>
        <Icon name="trash-can-outline" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.iconWrapper}>
        <Icon name="bell" color="white" size={28} />
        {unreadNotifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadNotifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        isVisible={modalVisible}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onBackdropPress={closeModal}
        style={styles.modalWrapper}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Bildirimler</Text>

          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Henüz bildirim yok.</Text>
            }
          />

        <TouchableOpacity
  onPress={closeModal}
  style={styles.closeButton}
  activeOpacity={0.7}
>
  <Text style={styles.closeButtonText}>X</Text>
</TouchableOpacity>

        </View>
      </Modal>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    right: 18,
  },
  iconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalWrapper: {
    margin: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.75,
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,

  },

  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1A1A1A' ,
    textAlign:'center',
    paddingVertical:15
  },

  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 6,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
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
    fontSize: 18, 
    color: '#8E8E93', 
    lineHeight: 28 
  },

});
