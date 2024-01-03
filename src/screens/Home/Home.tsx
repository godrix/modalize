import { BottomSheet } from '@/components/BottomSheet/BottomSheet';
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';


export function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = ()=>{
    setIsOpen(prev => !prev)
  }

  return <View style={styles.container}>
    <Pressable style={styles.btn} onPress={toggleSheet}>
      <Text style={styles.btnLabel}>
        Abrir BottomSheet
      </Text>
    </Pressable>
    <BottomSheet visible={isOpen} onClose={toggleSheet}/>
  </View>
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#121212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn:{

  },
  btnLabel:{
    color: "#fff"
  }
});