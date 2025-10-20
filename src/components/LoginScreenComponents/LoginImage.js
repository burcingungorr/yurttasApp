import React from 'react'
import { Image, View, StyleSheet } from 'react-native'
import loginImage from '../../assets/images/loginImage.png' 

const LoginImage = () => {
  return (
    <View style={styles.container}>
        <Image 
            source={loginImage} 
            style={styles.image}
            resizeMode="contain" 
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
  },
  image: {
    width: 330,
    height: 300,
  },
});

export default LoginImage
