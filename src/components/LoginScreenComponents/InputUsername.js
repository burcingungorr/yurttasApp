import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

const InputUsername = ({ username, setUsername }) => {
  
    const message = useSelector(state => state.username.message);
    const error = useSelector(state => state.username.error);



    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Kullanıcı adınızı girin"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

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
        justifyContent: 'start',
        alignItems: 'start',
        width: '100%',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'start',
        color: '#333',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        color: '#000',
        width: '100%',   
        alignSelf: 'center', 
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
