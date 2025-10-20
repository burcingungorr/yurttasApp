import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Priority = ({ level, checked, onPress }) => {
  let iconColor = 'black';

  if (level === 'first') {
    iconColor = 'red';  
  } else if (level === 'second') {
    iconColor = '#f48022';  
  } else if (level === 'third') {
    iconColor = 'yellow';  
  }

  const iconName = checked ? 'checkbox-marked' : 'square';  

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Icon name={iconName} color={iconColor} size={30} />
    </TouchableOpacity>
  );
};

export default Priority;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
});
