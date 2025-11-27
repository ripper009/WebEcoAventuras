// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFNESRih-NtdrZeiTuvnWCFgFIyOhvL0U",
  authDomain: "loginecoaventuras.firebaseapp.com",
  projectId: "loginecoaventuras",
  storageBucket: "loginecoaventuras.appspot.com",
  messagingSenderId: "1050962497047",
  appId: "1:1050962497047:android:d446c5e2f7aed110bed652"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };