// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNP1B3Y-i-8YkHX2Btq8rEbhqJ83s1vFs",
  authDomain: "playplay-395d7.firebaseapp.com",
  databaseURL: "https://playplay-395d7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "playplay-395d7",
  storageBucket: "playplay-395d7.firebasestorage.app",
  messagingSenderId: "345885500488",
  appId: "1:345885500488:web:82272c90308ae8ebc1647d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app; 