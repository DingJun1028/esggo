importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDi_T2RmomrsqhUNxZ98SzT53ZM7qj4MBw",
  authDomain: "esg-sunshine.firebaseapp.com",
  projectId: "esg-sunshine",
  storageBucket: "esg-sunshine.firebasestorage.app",
  messagingSenderId: "950159032447",
  appId: "1:950159032447:web:4168bcdb81a10a3eecff4a",
  measurementId: "G-8D32BP5P40"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'ESG GO 通知';
  const notificationOptions = {
    body: payload.notification?.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
