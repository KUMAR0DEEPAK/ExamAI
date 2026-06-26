import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "examai-43f7b.firebaseapp.com",
  projectId: "examai-43f7b",
  storageBucket: "examai-43f7b.firebasestorage.app",
  messagingSenderId: "240783268845",
  appId: "1:240783268845:web:6ab4e8e9bb7fcbfd28e5e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app);

const provider=new GoogleAuthProvider();

export {auth, provider};