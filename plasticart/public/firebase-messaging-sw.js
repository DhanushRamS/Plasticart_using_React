/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// firebase-messaging-sw.js

importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCfjZEOdKsIPbElfsXNZPTVMd1RLTuxlmE",
  authDomain: "plasticart-cb41e.firebaseapp.com",
  projectId: "plasticart-cb41e",
  storageBucket: "plasticart-cb41e.appspot.com",
  messagingSenderId: "967593662517",
  appId: "1:967593662517:web:ebbab9ce8d4643b50af97c",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
