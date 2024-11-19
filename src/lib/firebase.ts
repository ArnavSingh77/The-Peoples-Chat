import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAcmccMnkBj3k1Bq5jeKrRTJGc9SONGdoM",
  authDomain: "the-peoples-chat.firebaseapp.com",
  projectId: "the-peoples-chat",
  storageBucket: "the-peoples-chat.appspot.com",
  messagingSenderId: "954237417591",
  appId: "1:954237417591:web:f2bb86e8637d13f202ae72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
export const db = getFirestore(app);
export const storage = getStorage(app);