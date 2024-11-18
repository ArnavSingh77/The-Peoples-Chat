import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAcmccMnkBj3k1Bq5jeKrRTJGc9SONGdoM",
  authDomain: "the-peoples-chat.firebaseapp.com",
  projectId: "the-peoples-chat",
  storageBucket: "the-peoples-chat.firebasestorage.app",
  messagingSenderId: "954237417591",
  appId: "1:954237417591:web:f2bb86e8637d13f202ae72"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);