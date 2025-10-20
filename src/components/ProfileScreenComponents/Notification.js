import React, { useState, useEffect } from 'react';
import { Modal, TouchableOpacity, View,StyleSheet,Text,FlatList,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

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
  

  const openModal = () => {
    setModalVisible(true);
  };

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
        <Icon name="bell" color="white" size={25} />
        {unreadNotifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadNotifications.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
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

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 57,
    right: 20,
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    height: 450,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
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
    top: 15,
    right: 15,
    zIndex: 1,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
  },
});
