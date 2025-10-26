import React from 'react'
import { Image, View, StyleSheet,Dimensions } from 'react-native'
import loginImage from '../../assets/images/loginImage.png' 


const { width, height } = Dimensions.get('window');

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
    width: width * 1.0,
    height: height * 0.4,
  },
});

export default LoginImage
