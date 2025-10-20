import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';

const Username = () => {
  const userName = useSelector(state => state.username.savedUsername);

  return (
    <View style={styles.container} >
        <Text style={styles.container_text}>{userName}</Text>
    </View>
  )
}

export default Username

const styles=StyleSheet.create({
    container:{
      alignItems:'center',
      margin:25,
    },
    container_text:{
      color:'white',
      fontSize:20
    }
})