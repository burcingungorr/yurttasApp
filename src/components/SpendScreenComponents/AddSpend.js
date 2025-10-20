import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, TextInput, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

const AddSpend = ({ setSpends, spends }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const userName = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

  const handleAdd = async () => {
    const parsedAmount = parseFloat(amount);

    if (title.trim() !== '' && !isNaN(parsedAmount)) {
      const spendData = {
        title,
        amount: parsedAmount,
        user: userName,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      
      try {
        const docRef = await firestore()
          .collection('rooms')
          .doc(roomCode)
          .collection('spends')
          .add(spendData);

        const addedDoc = await docRef.get();
        
        setSpends([...spends, { id: docRef.id, ...addedDoc.data() }]);
        setTitle('');
        setAmount('');
        setModalVisible(false);

        const notification = {
          title: `${userName} yeni bir harcama ekledi: ${title} (${amount}₺)`,
          createdAt: firestore.FieldValue.serverTimestamp(),
          user: userName,
          type: 'spend_add',
          userRead: [],
          userDeleted: [],
        };
        

        await firestore()
          .collection('rooms')
          .doc(roomCode)
          .collection('notifications')
          .add(notification);

   
      } catch (error) {
        console.error('Harcama eklenirken hata:', error);
      }
    } else {
      console.warn('Lütfen geçerli bir ürün adı ve fiyat giriniz.');
    }

  };


  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.plus} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalBox_text}>Ürün Ekle</Text>
            <TouchableOpacity style={styles.close} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.inputRow}>
              <TextInput
                placeholder="Ürün adı"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
              />
              <TextInput
                placeholder="Fiyat"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleAdd}>
              <Text style={styles.buttonText}>Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddSpend;

const styles = StyleSheet.create({
  container: { flex: 1 },
  plus: { position: 'absolute', bottom: 20, right: 20, backgroundColor: '#007AFF', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalBackground: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', padding: 20 },
  modalBox: { backgroundColor: 'white', borderRadius: 10, padding: 20 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  input: { flex: 1, borderWidth: 1, padding: 10, borderRadius: 8, marginVertical: 10 },
  button: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  close: { position: 'absolute', top: 15, right: 15, zIndex: 1 },
  modalBox_text: { fontSize: 15, marginBottom: 10 },
});
