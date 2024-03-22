import {
  Alert,
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
}
  from 'react-native';
import mySync, { database, deleteLocalData } from '../..';
import React, { useState, useEffect } from 'react';
import AddBtn from 'react-native-vector-icons/AntDesign';
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const { width, height } = Dimensions.get('window')
const Todo = () => {

  const [todos, setTodos] = useState([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');
  // console.log('database.......', database)
  const tasksCollection = database.collections.get('tasks')

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await tasksCollection.query().fetch();
        setTodos(fetchedTodos);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
    const subscription = tasksCollection.query().observe().subscribe((todos) => {
      setTodos(todos);
    });
    return () => subscription.unsubscribe();
  }, [database]);

  const handleAddTodo = async () => {
    if (!newTaskDescription.trim()) {
      Alert.alert('Please enter a task description');
      return;
    }

    try {
      await database.write(async () => {//create a new task within write operation
        const createdTask = await tasksCollection.create((task) => {
          task.description = newTaskDescription;
          task.isComplete = false;
          task._status = 'created'; 
        });
        // console.log('createdTask.......',createdTask)
        mySync()
      });
      setNewTaskDescription('');
      const fetchedTodos = await tasksCollection.query();//it fetches updated todolist from db
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = async (index) => {
    try {
      await database.write(async () => {
        const todoToDelete = await tasksCollection.find(todos[index].id);
        await todoToDelete.destroyPermanently();
      });
      setTodos(prevTodos => prevTodos.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting todo:', error);
      // Handle error if necessary
    }
  };

  const handleOnChangeText = (text) => {
    setNewTaskDescription(text);
  };

  const printDatabaseContents = async () => {
    try {
      const allTasks = await tasksCollection.query().fetch();
      console.log('All tasks:', allTasks.map(task => ({
        ID: task.id,
        Description: task.description,
        IsCompleted: task.isCompleted,
        CreatedAt: task.createdAt.toString(),
        status: task?._raw?._status
      })));
    } catch (error) {
      console.error('Error querying database:', error);
    }
  };

  // Call the function to print database contents
  printDatabaseContents();

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.container}>
        <View style={styles.todoContainer}>
          <View style={styles.todoItems}>
            <Text style={styles.title}>{'Todo App'}</Text>
            <View style={styles.row}>
              <TextInput
                placeholder={'Add Todo here......'}
                style={styles.input}
                value={newTaskDescription}
                onChangeText={(text) => handleOnChangeText(text)}
              />
              <AddBtn
                name='pluscircle'
                size={30}
                color='#bf8bff'
                style={{ marginRight: 10 }}
                onPress={handleAddTodo}
              />
            </View>
            {todos.length > 0 && (
              <ScrollView style={styles.todoItems} showsVerticalScrollIndicator={false}>
                {todos.map((todo, index) => (
                  <View style={styles.body} key={index}>
                    <Text>{todo.description}</Text>
                    <DeleteIcon
                      name='delete'
                      size={20}
                      color='#bf8bff'
                      onPress={() => handleDelete(index)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
            <Text style={styles.footerText}>{`There are ${todos.length} tasks are pending`}</Text>
          </View>
        </View>
        <View style={{margin: 20}}>
        <Button title='Sync Data' 
        onPress={deleteLocalData}
        />
        </View>
      </View>
    </ScrollView>
  );
};
export default Todo

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cca3ff',
    height: height,
  },
  todoContainer: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 20
  },
  todoItems: {
    flexDirection: 'column'
  },
  title: {
    fontSize: 20,
    padding: 20,
    fontWeight: 'bold',
    color: '#cca3ff'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#cca3ff',
    margin: 20,
    paddingLeft: 10
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e5d0ff',
    margin: 20,
    borderRadius: 10,
    padding: 6,
    paddingLeft: 15
  },
  todoItems: {
    // flex: 1,
    flexDirection: 'column'
  },
  footerText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#bf8bff'
  }
})