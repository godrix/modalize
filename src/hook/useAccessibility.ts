import { useCallback, useEffect, useState, useLayoutEffect } from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

type ReadingTimeConfig = {
  timePerCharacter?: number
  minimumTime?: number
}

/**
 * Look like there is timing issue with AccessibilityInfo.setAccessibilityFocus
 * Ref https://github.com/react-native-community/discussions-and-proposals/issues/118
 */
const AUTO_FOCUS_DELAY = 500;

export function useAccessibility() {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isLayoutUpdated, setIsLayoutUpdated] = useState(false);
  const [autoFocusRef, setAutoFocusRef] = useState<any>();

  const _setFocus = useCallback((elementRef: any) => {

    if (elementRef.current) {
      const focusPoint = findNodeHandle(elementRef.current);
      if (focusPoint) {
        AccessibilityInfo.setAccessibilityFocus(focusPoint);
      }
    }
  }, []);

  const announceForAccessibility = useCallback((message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  }, []);

  const wrongSpelling = useCallback((text: string) => {
    const specialCharacters = /[^a-zA-Z0-9À-ÖØ-öø-ÿ\s]/g;

    const clearText = text.replace(specialCharacters, ' ');

    return clearText;
  }, [])

  const readingTime = (message: string, config?: ReadingTimeConfig) => {

    const defaultConfig = {
      timePerCharacter: 100,
      minimumTime: 3000,
    };

    const displayTime = message.length * (config?.timePerCharacter ?? defaultConfig.timePerCharacter);

    return Math.max(displayTime, config?.minimumTime ?? defaultConfig.timePerCharacter);
  }

  const pluralizeWord = (amount: number, singular: string, plural: string) => {
    return amount > 1 ? plural : singular;
  }

  const setFocusWithDelay = (ref:any)=>{
    setTimeout(() => {
      _setFocus(ref);
    }, AUTO_FOCUS_DELAY);
  }

  useEffect(() => {
    (async () => {
      const response = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(response);
    })()
  }, []);

  useLayoutEffect(() => {
    setIsLayoutUpdated(true);
    return () => {
      setIsLayoutUpdated(false);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isScreenReaderEnabled || !isLayoutUpdated || !autoFocusRef) {
      return;
    }

    // Call focus as soon as all considition is met
    _setFocus(autoFocusRef);

    // Attempt to call it again just in case AccessibilityInfo.setAccessibilityFocus is delayed
    const timeoutId = setTimeout(() => {
      _setFocus(autoFocusRef);
    }, AUTO_FOCUS_DELAY);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [autoFocusRef, isLayoutUpdated, isScreenReaderEnabled]);


  return {
    accessibilityAutoFocusRef: setAutoFocusRef,
    isScreenReaderEnabled,
    setAccessibilityFocus: setFocusWithDelay,
    announceForAccessibility,
    wrongSpelling,
    readingTime,
    pluralizeWord
  };
}
