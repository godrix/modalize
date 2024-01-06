import { BottomSheet, BottomSheetHandle } from '@/components/BottomSheet/BottomSheet';
import React, { useRef } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';


export function Home() {
  const modalRef = useRef<BottomSheetHandle>(null);

  const handleOpenModal = ()=>{
    modalRef.current?.open();
  }

  const handleCloseModal = ()=>{
    modalRef.current?.close();
  }

  const handleToggleModal = ()=>{
    modalRef.current?.toggle();
  }

  return <View style={styles.container}>
    <Pressable role="button" style={styles.btn} onPress={handleOpenModal}>
      <Text style={styles.btnLabel}>
        Abrir modal
      </Text>
    </Pressable>
    <Pressable role="button" style={styles.btn} onPress={handleToggleModal}>
      <Text style={styles.btnLabel}>
        Alternar modal
      </Text>
    </Pressable>
    <Pressable role="button" style={styles.btn} onPress={handleCloseModal}>
      <Text style={styles.btnLabel}>
        Fechar Modal
      </Text>
    </Pressable>
    <BottomSheet 
    ref={modalRef}
    fullscreen={false} 
    onClose={()=>{
      alert('onClose')
    }} onShow={()=>{
      alert('onShow')
    }}>
      <Text>Olá mundo</Text>
    </BottomSheet>
  </View>
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#121212',
    alignItems: 'center',
    justifyContent: 'center',
    gap:8
  },
  btn:{
    padding: 8,
    minHeight: 48,
    minWidth: 200,
    backgroundColor: "blue",
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnLabel:{
    color: "#fff"
  }
});