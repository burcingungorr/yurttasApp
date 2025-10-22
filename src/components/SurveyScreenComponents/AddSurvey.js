import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Text,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const AddSurvey = ({ setSurveys, surveys }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);
  const [expiry, setExpiry] = useState('');
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState('');
  const userName = useSelector(state => state.username.savedUsername);
  const roomCode = useSelector(state => state.room.currentRoom?.code);

  const handleOptionChange = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const handleAddOption = () => setOptions([...options, '']);

  const handleAddSurvey = async () => {
      setModalVisible(false);
    if (!question.trim() || options.some(opt => !opt.trim())) {
      alert('Lütfen soru ve tüm seçenekleri doldurun.');
      return;
    }

    if (!expiry) {
      alert('Lütfen anketin bitiş tarihini girin.');
      return;
    }

    const newSurvey = {
      question,
      options,
      votes: options.map(() => 0),
      expiry,
      createdBy: userName,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      const docRef = await firestore()
        .collection('rooms')
        .doc(roomCode)
        .collection('surveys')
        .add(newSurvey);

      const addedSurvey = await docRef.get();
      setSurveys(prev => [...prev, { id: docRef.id, ...addedSurvey.data() }]);
      
      setQuestion('');
      setOptions(['']);
      setExpiry('');
      
    } catch (error) {
      console.error('Anket eklenirken hata:', error);
      alert('Anket eklenirken bir hata oluştu.');
    }
  };

  const handleConfirmCustomDate = () => {
    if (!tempDate || !tempTime) {
      alert('Lütfen tarih ve saat girin.');
      return;
    }
    setExpiry(`${tempDate} ${tempTime}`);
    setShowCustomPicker(false);
  };

  return (
    <View>
      {/* Ana modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Yeni Anket Ekle</Text>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>

            <ScrollView>
              <View style={styles.row}>
                <TextInput
                  placeholder="Soru girin"
                  value={question}
                  onChangeText={setQuestion}
                  style={[styles.input, { flex: 1 }]}
                />
                <TouchableOpacity
                  style={styles.addOptionIcon}
                  onPress={handleAddOption}>
                  <Icon name="plus" size={28} color="white" />
                </TouchableOpacity>
              </View>

            {options.map((opt, index) => (
  <View key={`option-${index}-${opt}`} style={styles.row}>
    <TextInput
      placeholder={`Seçenek ${index + 1}`}
      value={opt}
      onChangeText={text => handleOptionChange(text, index)}
      style={[styles.input, { flex: 1 }]}
    />
    {options.length > 1 && (
      <TouchableOpacity
        style={styles.deleteOptionIcon}
        onPress={() => {
          const newOptions = [...options];
          newOptions.splice(index, 1);
          setOptions(newOptions);
        }}
      >
        <Text style={{ color: '#f48022', fontSize: 20 }}>×</Text>
      </TouchableOpacity>
    )}
  </View>
))}



              <TouchableOpacity
                style={[styles.input, styles.dateButton]}
                onPress={() => setShowCustomPicker(true)}
              >
                <Text style={{ color: expiry ? '#000' : '#bbb' }}>
                  {expiry ? expiry : 'Son Tarih ve Saat'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddSurvey}>
                <Text style={styles.submitButtonText}>Anketi Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Custom tarih-saat seçici */}
      <Modal visible={showCustomPicker} transparent animationType="slide">
        <View style={styles.dateModalBackground}>
          <View style={styles.dateModalBox}>
            <Text style={styles.modalTitle}>Tarih ve Saat Gir</Text>
            <TextInput
              placeholder="Tarih (örn: 2025-10-23)"
              value={tempDate}
              onChangeText={setTempDate}
              style={styles.input}
            />
            <TextInput
              placeholder="Saat (örn: 14:30)"
              value={tempTime}
              onChangeText={setTempTime}
              style={styles.input}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCustomPicker(false)}>
                <Text style={styles.cancelText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmCustomDate}>
                <Text style={styles.confirmText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.plus}
          onPress={() => setModalVisible(true)}>
          <Icon name="plus" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddSurvey;

const styles = StyleSheet.create({
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
    maxHeight: '80%',
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  close: { position: 'absolute', top: 15, right: 15, zIndex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  dateButton: {
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#f48022',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold' },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 12,
    right: 20,
  },
  plus: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  addOptionIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  deleteOptionIcon:{

    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  }
  ,
  dateModalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
  },
  dateModalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  cancelText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
  confirmText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});