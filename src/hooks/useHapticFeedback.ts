import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticFeedbackOptions {
  type?: HapticType;
  pattern?: number[];
  intensity?: number;
}

export const useHapticFeedback = () => {
  const triggerHaptic = useCallback((options: HapticFeedbackOptions = {}) => {
    const { type = 'light', pattern, intensity = 1 } = options;

    // Check if haptic feedback is supported
    if (!navigator.vibrate) {
      return false;
    }

    try {
      let vibrationPattern: number | number[];

      switch (type) {
        case 'light':
          vibrationPattern = 10;
          break;
        case 'medium':
          vibrationPattern = 20;
          break;
        case 'heavy':
          vibrationPattern = 50;
          break;
        case 'success':
          vibrationPattern = [10, 50, 10];
          break;
        case 'warning':
          vibrationPattern = [20, 100, 20];
          break;
        case 'error':
          vibrationPattern = [50, 100, 50, 100, 50];
          break;
        default:
          vibrationPattern = 10;
      }

      // Apply intensity multiplier
      if (Array.isArray(vibrationPattern)) {
        vibrationPattern = vibrationPattern.map(duration => Math.round(duration * intensity));
      } else {
        vibrationPattern = Math.round(vibrationPattern * intensity);
      }

      // Use custom pattern if provided
      if (pattern) {
        vibrationPattern = pattern.map(duration => Math.round(duration * intensity));
      }

      // Trigger haptic feedback
      navigator.vibrate(vibrationPattern);
      return true;
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  }, []);

  const hapticSuccess = useCallback(() => triggerHaptic({ type: 'success' }), [triggerHaptic]);
  const hapticError = useCallback(() => triggerHaptic({ type: 'error' }), [triggerHaptic]);
  const hapticWarning = useCallback(() => triggerHaptic({ type: 'warning' }), [triggerHaptic]);
  const hapticLight = useCallback(() => triggerHaptic({ type: 'light' }), [triggerHaptic]);
  const hapticMedium = useCallback(() => triggerHaptic({ type: 'medium' }), [triggerHaptic]);
  const hapticHeavy = useCallback(() => triggerHaptic({ type: 'heavy' }), [triggerHaptic]);

  return {
    triggerHaptic,
    hapticSuccess,
    hapticError,
    hapticWarning,
    hapticLight,
    hapticMedium,
    hapticHeavy,
  };
};
