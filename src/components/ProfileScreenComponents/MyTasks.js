import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const MyTasks = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const userId = useSelector(state => state.username.uid); 

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = firestore()
      .collection('users')
      .doc(userId)
      .collection('Mytasks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const fetchedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          text: doc.data().task,
          completed: doc.data().completed,
        }));
        setTasks(fetchedTasks);
      });

    return () => unsubscribe(); 
  }, [userId]);


  const addTask = async () => {
    if (!userId) return;

    const newTask = {
      task,
      completed: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('Mytasks')
        .add(newTask);
      setTask('');
    } catch (error) {
      console.error('Görev eklenirken hata:', error);
    }
  };


  const toggleCompletion = async (taskId, currentState) => {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('Mytasks')
        .doc(taskId)
        .update({ completed: !currentState });
  };


  const deleteTask = async (taskId) => {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('Mytasks')
        .doc(taskId)
        .delete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kişisel Görevlerim</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Yeni görev ekle..."
          style={styles.input}
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity onPress={addTask} style={styles.addButton}>
          <Icon name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleCompletion(item.id, item.completed)}>
              <Icon
                name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={item.completed ? '#007AFF' : '#333'}
              />
            </TouchableOpacity>
            <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
              {item.text}
            </Text>
            <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
              <Icon name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Henüz görev yok.</Text>}
      />
    </SafeAreaView>
  );
};

export default MyTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom:45
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  taskText: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  completedTaskText: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    margin: 50,
    color: '#888',
  },
});
