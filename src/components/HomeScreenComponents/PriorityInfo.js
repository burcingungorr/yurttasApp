import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PriorityInfo = () => {
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Icon name="square" color={'red'} size={25} />
                <Text style={styles.container_text}>Acil!</Text>
            </View>
            <View style={styles.item}>
                <Icon name="square" color={'#f48022'} size={25} />
                <Text style={styles.container_text}>Orta Aciliyet.</Text>
            </View>
            <View style={styles.item}>
                <Icon name="square" color={'#007AFF'} size={25} />
                <Text style={styles.container_text}>Acelesi Yok.</Text>
            </View>
        </View>
    );
};

export default PriorityInfo;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: -100,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: 10,
        backgroundColor: 'transparent',
        borderTopWidth: 1,
        borderColor: '#ccc',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    container_text: {
        marginLeft: 5,
        fontSize: 14,
    },
});
