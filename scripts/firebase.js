// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI2ZBMpFRdTAF68a9vUg_sitW08Jjc_ws",
  authDomain: "ecommerce-frontend-47dad.firebaseapp.com",
  projectId: "ecommerce-frontend-47dad",
  storageBucket: "ecommerce-frontend-47dad.firebasestorage.app",
  messagingSenderId: "427360728962",
  appId: "1:427360728962:web:52ebf1489ec88dea8c019b",
  measurementId: "G-17JE2244RJ"
};

// Initialize Firebase
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Failed to set auth persistence:", error);
});

// Export auth and functions for use in other scripts
export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
