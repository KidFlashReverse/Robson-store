// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDk_xIIW4EkqKhnQ-MY-gRN11IReixRD1U",
  authDomain: "storeapp-1f0af.firebaseapp.com",
  projectId: "storeapp-1f0af",
  storageBucket: "storeapp-1f0af.appspot.com",
  messagingSenderId: "434894335640",
  appId: "1:434894335640:web:913646b32251d9ace9aaed",
  measurementId: "G-GX6GKZ1WXH"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {app, auth, db, storage};