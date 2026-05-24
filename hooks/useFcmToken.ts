import { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { initMessaging } from '../lib/firebase';

const VAPID_KEY = 'BFgBqmnt_ZkLY15_w_XeAwdlKuC0vNXRARYV2RWZvgOMliwkwqio6B-ldpSIDVMxsmp4DJtiqeN-CS5e5Y-IEKA';

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermissionStatus(Notification.permission);
    }
  }, []);

  const retrieveToken = async () => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = await initMessaging();
        if (!messaging) return null;

        // Request notification permission
        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);

        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: VAPID_KEY,
          });

          if (currentToken) {
            setToken(currentToken);
            return currentToken;
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
    }
    return null;
  };

  // Optional: setup foreground message listener here or let the app do it
  useEffect(() => {
    let unsubscribe = () => {};
    const setupListener = async () => {
      const messaging = await initMessaging();
      if (messaging) {
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('[useFcmToken] Received foreground message:', payload);
          // You can show a custom UI toast here
        });
      }
    };
    
    if (token) {
      setupListener();
    }

    return () => unsubscribe();
  }, [token]);

  return { token, notificationPermissionStatus, retrieveToken };
};
