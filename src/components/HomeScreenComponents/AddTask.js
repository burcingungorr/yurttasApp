import { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from "react-redux";

const AddTask = ({ selectedDate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('');
  const [date, setDate] = useState(selectedDate);

  const userName = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  const handleAdd = async () => {
    if (!task || !priority || !date || !roomCode || !userName) {
      Alert.alert("Eksik bilgi var.", 'Lütfen tüm alanları doldurun.');
      return;
    }

    const taskData = {
      task,
      priority,
      date,
      userName,
      createdAt: firestore.FieldValue.serverTimestamp(),
      checked: false,
      checkedBy: '',
    };

    try {
      await firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('tasks')
        .add(taskData);

      const notification = {
        title: `${userName} yeni bir görev ekledi. (${task})`,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: userName,
        type: 'task_add',
        userRead: [],
        userDeleted: [],      };

      await firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('notifications')
        .add(notification);


      setTask('');
      setPriority('');
      setDate(new Date().toISOString().split('T')[0]);
      setModalVisible(false);

    } catch (error) {
      Alert.alert("Kayıt sırasında hata", 'Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Görev eklenirken hata:', error);
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
            <Text style={styles.modalBox_text}>Görev Ekle</Text>
            <TouchableOpacity style={styles.close} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <View style={styles.inputRow}>
              <TextInput placeholder="Tarih" value={date} editable={false} style={styles.input} />
              <TextInput placeholder="Görev" value={task} onChangeText={setTask} style={styles.input} />
              <View style={styles.pickerContainer}>
                <Picker selectedValue={priority} onValueChange={setPriority} style={styles.picker}>
                  <Picker.Item label="Öncelik Seç" value="" />
                  <Picker.Item label="Acil" value="first" />
                  <Picker.Item label="Orta Aciliyet" value="second" />
                  <Picker.Item label="Acelesi Yok" value="third" />
                </Picker>
              </View>
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

export default AddTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    bottom: 25,
  },
  plus: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
  },
  modalBox: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  inputRow: {
    flexDirection: 'column',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginVertical: 10,
    fontSize: 16,
    height: 60,
    textAlignVertical: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  picker: {
    height: 60,
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  close: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1,
  },
  modalBox_text: {
    fontSize: 15,
    marginBottom: 10,
  },
});
