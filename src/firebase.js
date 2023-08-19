// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxvxl-7j7-pFsFTIAehrIGs_K8xbcRDAA",
  authDomain: "newsapp-f345a.firebaseapp.com",
  projectId: "newsapp-f345a",
  storageBucket: "newsapp-f345a.appspot.com",
  messagingSenderId: "932172931080",
  appId: "1:932172931080:web:3e59533a6da1f16a7df1bd",
  measurementId: "G-2PRKW6RYH3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);