import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Home } from '@/screens/Home/Home';


export default function App() {

 
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <Home/>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
