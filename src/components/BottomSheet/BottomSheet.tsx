import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Pressable, ViewProps } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedStyle,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useAccessibility } from "@/hook/useAccessibility";

const DIMENSION = Dimensions.get("window");
export const BOTTOM_SHEET_HEIGHT = 220;
export const SHEET_OVER_DRAG = 20;

export interface BottomSheetHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}


type Props = ViewProps & {
  onClose?: () => void;
  onShow?: () => void;
  fullscreen?: boolean;
  children: React.ReactNode;
  accessibilityButtonClose?:string;
};

export const BottomSheet = forwardRef<BottomSheetHandle, Props>(function _BottomSheet(props, ref) {
  const { onClose, onShow, fullscreen = false, children, accessibilityButtonClose="Fechar", ...rest } = props;
  const [visible, setVisible] = useState(false);
  const { setAccessibilityFocus } = useAccessibility();

  const _ref = useRef(null);

  const offset = useSharedValue(0);

  const closeBottomSheet = () => {
    offset.value = 0;
    setVisible(false);
    onClose && onClose();
  };

  const openBottomSheet = () => {
    setVisible(true);
    setAccessibilityFocus(_ref);
    onShow && onShow();
  };

  const toggleBottomSheet = () => {
    setVisible(prev => {
      if (!prev) {
        setAccessibilityFocus(_ref);
        onShow && onShow();
        return !prev
      }
      onClose && onClose();
      return !prev
    });
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-SHEET_OVER_DRAG, offsetDelta);

      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < BOTTOM_SHEET_HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(BOTTOM_SHEET_HEIGHT, {}, () => {
          runOnJS(closeBottomSheet)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  useImperativeHandle(ref, () => {
    return {
      open() {
        openBottomSheet();
      },
      close() {
        closeBottomSheet();
      },
      toggle() {
        toggleBottomSheet();
      },
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <GestureDetector gesture={pan}>
      <Animated.View 
        entering={SlideInDown.springify().damping(15)}
        exiting={SlideOutDown}
        style={[styles.container, translateY, fullscreen && styles.fullScreen]}
        accessibilityViewIsModal={visible}
        {...rest}
      >
        <Pressable
          ref={_ref}
          aria-label={accessibilityButtonClose} role="button" onPress={closeBottomSheet}>
          <MaterialCommunityIcons
            name="drag-horizontal"
            color="#999"
            size={24}
            style={styles.icon}
          />
        </Pressable>
        <View>
          {children}
        </View>
      </Animated.View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  container: {
    width: DIMENSION.width,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: "#1e1f23",
    position: "absolute",
    bottom: 0,
  },
  fullScreen: {
    height: DIMENSION.height,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    margin: 24,
  },
  icon: {
    marginTop: 16,
    alignSelf: "center",
  },
});
