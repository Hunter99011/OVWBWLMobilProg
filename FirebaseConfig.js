// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuZ94VLlLgeF6xi2gJS8ZEJMzW_L873HQ",
  authDomain: "mytodoapp22.firebaseapp.com",
  projectId: "mytodoapp22",
  storageBucket: "mytodoapp22.firebasestorage.app",
  messagingSenderId: "504648254820",
  appId: "1:504648254820:web:5a579a95b231e43919e671"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirestoreDB = getFirestore(FirebaseApp);
