import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Title from '../components/Title'
import AddSpend from '../components/SpendScreenComponents/AddSpend'
import Spends from '../components/SpendScreenComponents/Spends'

const SpendScreen = () => {
  const [spends, setSpends] = useState([]);

  return (
    <View  style={styles.container}> 
    <View style={styles.downcontainer}> 
  <Title title={'Harcamalar'} />
  </View>
  <Spends spends={spends} setSpends={setSpends} />

  <AddSpend setSpends={setSpends} spends={spends} />
  </View>
  )
}

export default SpendScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
  },
  downcontainer: {
    backgroundColor: '#007AFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 110,
  }
});