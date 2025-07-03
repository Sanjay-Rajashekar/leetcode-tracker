// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC57Bk3QNBN0Xc71aQmuJ3yu58bR860G4k",
  authDomain: "leetcode-tracker-7dcb9.firebaseapp.com",
  projectId: "leetcode-tracker-7dcb9",
  storageBucket: "leetcode-tracker-7dcb9.firebasestorage.app",
  messagingSenderId: "260040949663",
  appId: "1:260040949663:web:b5025efc6c94bd9d8a07aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore
const db = getFirestore(app);

export { db };
