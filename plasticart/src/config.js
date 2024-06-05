import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCfjZEOdKsIPbElfsXNZPTVMd1RLTuxlmE",
  authDomain: "plasticart-cb41e.firebaseapp.com",
  projectId: "plasticart-cb41e",
  storageBucket: "plasticart-cb41e.appspot.com",
  messagingSenderId: "967593662517",
  appId: "1:967593662517:web:ebbab9ce8d4643b50af97c",
  measurementId: "G-GEJ4H0GR72",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const appFirestore = getFirestore(app);
const appStorage = getStorage(app);
const appAuth = getAuth(app);

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
    if (currentToken) {
      console.log('Current token for client: ', currentToken);
      // Perform any action with the token here, e.g., send it to the server
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
  });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { appStorage, appAuth, appFirestore };
