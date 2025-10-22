import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Title = ({title}) => {
  return (
    <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
    </View>
  )
}
export default Title

const styles = StyleSheet.create({
container:{
    marginTop:35,
    marginBottom:10
},
title:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
    textAlign:'center',
}

})