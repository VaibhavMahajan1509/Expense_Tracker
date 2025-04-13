// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDB4LTgJCZ_rGhqDKXNGdmwWo1oDymuxAM",
  authDomain: "expense-tracker-system-3cfa5.firebaseapp.com",
  projectId: "expense-tracker-system-3cfa5",
  storageBucket: "expense-tracker-system-3cfa5.appspot.com",
  messagingSenderId: "970631159117",
  appId: "1:970631159117:web:your_app_id_here", // Optional, can be added from Firebase console if needed
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
