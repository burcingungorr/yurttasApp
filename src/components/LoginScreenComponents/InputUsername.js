import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { saveUsername } from '../../redux/usernameSlice';

const InputUsername = () => {
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();
    const savedUsername = useSelector(state => state.username.savedUsername);
    const message = useSelector(state => state.username.message);
    const error = useSelector(state => state.username.error);

    const handleSave = () => {
        if (username.trim()) {
            dispatch(saveUsername(username.trim()));
        }
        setUsername('')
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Kullanıcı Adı</Text>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChangeText={setUsername}
                />
                <TouchableOpacity style={styles.iconButton} onPress={handleSave}>
                    <Icon name="check" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {savedUsername && (
                <Text style={styles.savedText}>{savedUsername}</Text>
            )}
            {message && (
                <Text style={styles.infoText}>{message}</Text>
            )}
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

export default InputUsername;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        padding: 8,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    iconButton: {
        backgroundColor: '#007AFF',
        padding: 8,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    savedText: {
        marginTop: 10,
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
    },
    infoText: {
        marginTop: 10,
        fontSize: 18,
        color: '#007AFF',
        textAlign: 'center',
    },
    errorText: {
        marginTop: 10,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
});
