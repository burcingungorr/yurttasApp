import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert,Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, joinRoom } from '../../redux/roomSlice';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import InputUsername from './InputUsername';
import { saveUsername } from '../../redux/usernameSlice';

const generateRoomCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const { height } = Dimensions.get('window');

const RoomModals = ({ setIsLoggedIn }) => {
    const dispatch = useDispatch();
    const username = useSelector(state => state.username.savedUsername);
    const [localUsername, setLocalUsername] = useState('');

    const [roomCode, setRoomCode] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [selectModalVisible, setSelectModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [codeModalVisible, setCodeModalVisible] = useState(false);
 

    const handleJoinRoom = () => {
        if (!username) {
            Alert.alert('Hata', 'Lütfen kullanıcı adınızı giriniz.');
            return;
        }

        dispatch(joinRoom({ code: roomCode, username }))
            .unwrap()
            .then(() => {
                firestore()
                    .collection('rooms')
                    .doc(roomCode)
                    .collection('roommates')
                    .where('username', '==', username)  
                    .get()
                    .then(querySnapshot => {
                        if (!querySnapshot.empty) {
                            setIsLoggedIn(true);
                            return;
                        }

                        firestore()
                            .collection('rooms')
                            .doc(roomCode)
                            .collection('roommates')
                            .add({
                                username: username,
                                joinedAt: firestore.FieldValue.serverTimestamp()
                            })
                            .then(() => {
                                setSelectModalVisible(false);
                            })
                            .catch(err => {
                                console.error('Odaya katılırken hata:', err);
                                Alert.alert('Hata', 'Oda kaydı yapılamadı.');
                            });
                    })

                    .catch(err => {
                        console.error('Oda kontrolü sırasında hata:', err);
                        Alert.alert('Hata', 'Oda kontrolü sırasında bir hata oluştu.');
                    });
            })
            .catch(err => Alert.alert('Hata', err.message));
    };

    const handleCreateRoom = () => {
        // Önce username'i kaydet
        if (localUsername.trim()) {
            dispatch(saveUsername(localUsername.trim()));
        }

        // Username kaydedilmesini bekle
        setTimeout(() => {
            if (!username && !localUsername.trim()) {
                Alert.alert('Hata', 'Lütfen kullanıcı adınızı giriniz.');
                return;
            }

            const code = generateRoomCode();
            dispatch(createRoom({ name: newRoomName, code }))
                .unwrap()
                .then(() => {
                    setGeneratedCode(code);
                    setCreateModalVisible(false);
                    setCodeModalVisible(true);
                    setNewRoomName('');
                    setIsLoggedIn(true);
                })
                .catch(err => Alert.alert('Hata', err.message));
        }, 300);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => setSelectModalVisible(true)}>
                <Text style={styles.buttonText}>Odaya Katıl</Text>
            </TouchableOpacity>

            <Text style={{ marginVertical: 15 }}>VEYA</Text>

            <TouchableOpacity style={[styles.button, { backgroundColor: 'orange' }]} onPress={() => setCreateModalVisible(true)}>
                <Text style={styles.buttonText}>Oda Kur</Text>
            </TouchableOpacity>

            <Modal visible={selectModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectModalVisible(false)}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Oda Kodu</Text>
                        <TextInput
                            placeholder="Oda kodunu giriniz"
                            keyboardType="number-pad"
                            value={roomCode}
                            onChangeText={setRoomCode}
                            style={styles.input}
                        />
                        <TouchableOpacity style={styles.modalButton} onPress={handleJoinRoom}>
                            <Text style={styles.modalButtonText}>Katıl</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={createModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCreateModalVisible(false)}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Yeni Oda Oluştur</Text>
                        {/* <Text style={styles.label}>Oda Adı</Text> */}
                        <TextInput
                            placeholder="Oda adını belirleyin"
                            value={newRoomName}
                            onChangeText={setNewRoomName}
                            style={styles.input}
                        />
                       <InputUsername username={localUsername} setUsername={setLocalUsername} />

                        <TouchableOpacity
                            style={[styles.modalButton, { opacity: newRoomName.trim() ? 1 : 0.5 }]}
                            disabled={!newRoomName.trim()}
                            onPress={handleCreateRoom}
                        >
                            <Text style={styles.modalButtonText}>Kur</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={codeModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setCodeModalVisible(false)}>
                            <Text style={styles.closeButtonText}>×</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Odanız Kuruldu!</Text>
                        <Text style={styles.roomCode}>{generatedCode}</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setCodeModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Tamam</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingBottom:height * 0.05,
    },
    button: { 
        backgroundColor: '#007AFF', 
        paddingVertical: 12, 
        paddingHorizontal: 30, 
        borderRadius: 8, 
        // marginBottom: 15,
        width: '45%',
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    buttonText: { 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: 16 
    },
    modalContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.5)' 
    },
    modalContent: { 
        width: '80%', 
        backgroundColor: 'white', 
        padding: 20, 
        borderRadius: 10, 
        position: 'relative' 
    },
    closeButton: { 
        position: 'absolute', 
        top: 10, 
        right: 10, 
        zIndex: 1 
    },
    closeButtonText: { 
        fontSize: 26, 
        color: '#333' 
    },
    modalTitle: { 
        fontSize: 18, 
        fontWeight: 'bold',
        marginBottom: 14, 
        textAlign: 'center',
        color: '#333'
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 5, 
        padding: 10, 
        marginBottom: 15 ,
    },
    modalButton: { 
        backgroundColor: '#007AFF', 
        paddingVertical: 10, 
        borderRadius: 5, 
        alignItems: 'center' 
    },
    modalButtonText: { 
        color: 'white', 
        fontSize: 16 
    },
    roomCode: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginVertical: 20, 
        color: '#333' 
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'start',
        color: '#333',
    },
});

export default RoomModals;
