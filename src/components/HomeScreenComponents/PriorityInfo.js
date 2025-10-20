import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PriorityInfo = () => {
    return (
        <View style={styles.container}> 
            <Icon name="square" color={'red'} size={25} />
            <Text style={styles.container_text}>Acil!</Text>
            <Icon name="square" color={'#f48022'} size={25} />
            <Text style={styles.container_text}>Orta Aciliyet.</Text>
            <Icon name="square" color={'yellow'} size={25} />
            <Text style={styles.container_text}>Acelesi Yok...</Text>
        
        </View>
          )
        };
        
        

export default PriorityInfo        

const styles=StyleSheet.create({
    container:{
        marginHorizontal:10,
        flexDirection: 'row',
        alignItems:'center',
        borderTopWidth:1,
        marginTop:45,

    },
    container_text:{
        marginTop:15,
        marginRight:30,
        margin:10
    }
})