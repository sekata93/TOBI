// Firebase initialization for Kasir TOBI
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAlfJz1D5A4tTUTt_wSl5O8Yf0y77r50Rw",
  authDomain: "tobi-90844.firebaseapp.com",
  projectId: "tobi-90844",
  storageBucket: "tobi-90844.firebasestorage.app",
  messagingSenderId: "267663790190",
  appId: "1:267663790190:web:8bbdcdac0a0f4726c6967f",
  measurementId: "G-VGRMP1PVKQ",
  databaseURL: "https://tobi-90844-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
