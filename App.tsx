import { View, Text } from 'react-native'
import React,{useEffect, useState} from 'react'
import Todo from './Components/Todo.js'
import mySync from './index.js'
import NetInfo from '@react-native-community/netinfo'

const App = () => {
  const [isConnected, setConnected] = useState(true);

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state:any) => {
			setConnected(state.isConnected);
			if (state.isConnected) {
        console.log('state.........',state?.isConnected)
				mySync();
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

  return (
    <View>
      <Todo />
    </View>
  )
}

export default App