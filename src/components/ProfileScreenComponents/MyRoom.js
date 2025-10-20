import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';

const MyRoom = () => {

    const roomCode = useSelector(state => state.room.currentRoom?.code);
return (
    <View style={styles.container}>
        <Text style={styles.roomCodeText}>Oda Kodu: {roomCode}</Text>
    </View>
)
}


export default MyRoom

const styles=StyleSheet.create({
container:{
    flex:1,
    paddingHorizontal:25

},
roomCodeText:{
fontSize:15
}



})