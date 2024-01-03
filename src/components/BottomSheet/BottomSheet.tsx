import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  withSpring, 
  withTiming, 
  runOnJS, 
  useAnimatedStyle,
  SlideInDown,
  SlideOutDown
} from 'react-native-reanimated';

const DIMENSION = Dimensions.get("window");
export const BOTTOM_SHEET_HEIGHT = 220;
export const SHEET_OVER_DRAG = 20;

type Props = {
  onClose: ()=>void;
  visible:boolean;
}

export function BottomSheet({onClose, visible}:Props) {

  const offset = useSharedValue(0);

  const closeBottomSheet = ()=>{
    offset.value = 0;
    onClose();
  }

  const pan = Gesture.Pan().onChange(( event )=>{
    const offsetDelta = event.changeY + offset.value;
    const clamp = Math.max(-SHEET_OVER_DRAG, offsetDelta);

    offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
  }).onFinalize(()=>{
    if(offset.value < BOTTOM_SHEET_HEIGHT / 3){
      offset.value = withSpring(0);
    }else{
      offset.value =  withTiming(BOTTOM_SHEET_HEIGHT, {}, ()=>{
        runOnJS(closeBottomSheet)()
      });
    }
  })

  const translateY = useAnimatedStyle(()=> ({
    transform: [{translateY:offset.value}]
  }))

  if(!visible){
    return null;
  }

  return (
    <GestureDetector gesture={pan}>
    <Animated.View 
    entering={SlideInDown.springify().damping(15)}
    exiting={SlideOutDown}
    style={[styles.container, translateY]}>
      <MaterialCommunityIcons
      name="drag-horizontal"
      color="#999"
      size={24}
      style={styles.icon}
      />
      <Text style={styles.title}>Opcao</Text>
    </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: DIMENSION.width,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#1e1f23',
    position: 'absolute',
    bottom: 0,
  },
  title:{
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    margin: 24
  },
  icon:{
    marginTop: 16,
    alignSelf: 'center'
  }
});