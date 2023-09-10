// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcpwTnN92pJF9v4fMbUXcPoELriZqYkvg",
  authDomain: "sveltekit-magic.firebaseapp.com",
  projectId: "sveltekit-magic",
  storageBucket: "sveltekit-magic.appspot.com",
  messagingSenderId: "966958537134",
  appId: "1:966958537134:web:7c0f099be29a6cbe9d503f",
  measurementId: "G-Q4SV1PRYV9",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
export const storage = getStorage();
