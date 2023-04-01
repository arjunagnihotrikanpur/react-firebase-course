import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD_INNAMfoYnOY_kb82rjjygUyMpG7ez6c",
  authDomain: "fir-course-8bbec.firebaseapp.com",
  projectId: "fir-course-8bbec",
  storageBucket: "fir-course-8bbec.appspot.com",
  messagingSenderId: "52484922774",
  appId: "1:52484922774:web:360f3d36498f3db6ea11b7",
  measurementId: "G-1FWC8CBZEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);