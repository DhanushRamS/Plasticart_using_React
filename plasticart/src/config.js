import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBmssqVO1iMzHSeuvL3stWn8OcfDndHuhU",
  authDomain: "plasticart-634f3.firebaseapp.com",
  projectId: "plasticart-634f3",
  storageBucket: "plasticart-634f3.appspot.com",
  messagingSenderId: "1082196901005",
  appId: "1:1082196901005:web:be94571e2de56b7847b6c4",
};

const app = initializeApp(firebaseConfig);

const appFirestore = getFirestore(app);
const appStorage = getStorage(app);
const appAuth = getAuth(app);

export { appStorage, appAuth, appFirestore };
