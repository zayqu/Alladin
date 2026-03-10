import { Toast } from '@capacitor/toast';  // Capacitor Toast plugin
import { Capacitor } from '@capacitor/core';  // For checking if platform is native (iOS/Android)
import { useToast as useVueToast } from 'vue-toastification';  // For web-based toasts

export function useToast() {
  const isNative = Capacitor.isNativePlatform();  // Check if the platform is native (iOS/Android)
  const toast = useVueToast();  // Vue Toastification instance for web

  // Function to show a toast message
  const showToast = async (message, type = 'success', duration = 'short') => {

    if (isNative) {
      // Show toast on native mobile platforms (Android/iOS)
      await Toast.show({
        text: message,
        duration: duration,
      });
    } else {
      // Web fallback using Vue Toastification
      if (type === 'success') {
        toast.success(message);
      } else if (type === 'error') {
        toast.error(message);
      } else if (type === 'warning') {
        toast.warning(message);
      } else {
        toast.info(message);
      }
    }
  };

  return { showToast };
}
