// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics"; 

const firebaseConfig = {
  apiKey: "AIzaSyDUbqVgB7XxmLf-d_zC95Ppci-kiuktYTY",
  authDomain: "users-15823.firebaseapp.com",
  projectId: "users-15823",
  storageBucket: "users-15823.appspot.com",
  messagingSenderId: "966911957408",
  appId: "1:966911957408:web:dbfbfe41d5f8dfb555ecc5",
  measurementId: "G-VCP53SJX5R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
export const analytics = getAnalytics(app);
