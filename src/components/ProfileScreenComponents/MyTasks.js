import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';

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
        
        // Tamamlanmayanları başa, tamamlananları sona sırala
        const sortedTasks = fetchedTasks.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
        
        setTasks(sortedTasks);
      });

    return () => unsubscribe();
  }, [userId]);

  const addTask = async () => {
    if (!userId || !task.trim()) return;

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

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Kişisel Görevlerim</Text>
          {totalCount > 0 && (
            <Text style={styles.subtitle}>
              {completedCount} / {totalCount} tamamlandı.
            </Text>
          )}
        </View>
    
      </View>

      {/* Input Section */}
      <View style={styles.inputCard}>
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="pencil-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              placeholder="Yeni görev ekle..."
              placeholderTextColor="#999"
              style={styles.input}
              value={task}
              onChangeText={setTask}
              onSubmitEditing={addTask}
            />
          </View>
          <TouchableOpacity onPress={addTask} style={styles.addButton} activeOpacity={0.7}>
            <Icon name="plus" size={26} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <LottieView
            source={require('../../assets/animations/todo.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.emptyText}>Henüz görev yok</Text>
          <Text style={styles.emptySubtext}>Yukarıdan yeni görev ekleyerek başla</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.taskCard, item.completed && styles.taskCardCompleted]}>
              <TouchableOpacity
                onPress={() => toggleCompletion(item.id, item.completed)}
                style={styles.checkboxContainer}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
                  {item.completed && <Icon name="check" size={18} color="white" />}
                </View>
              </TouchableOpacity>

              <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                {item.text}
              </Text>

              <TouchableOpacity
                onPress={() => deleteTask(item.id)}
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <Icon name="trash-can-outline" size={22} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default MyTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
    fontWeight: '600',
  },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  listContent: {
    paddingBottom: 20,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    elevation: 2,
  },

  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D1D1D6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 22,
  },
  completedTaskText: {
    color: '#8E8E93',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:-30
  },
  lottie: {
    width: 220,
    height: 220,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8E8E93',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#C7C7CC',
    marginTop: 8,
  },
});