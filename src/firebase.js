// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "89793!!!!5555^__!@4jjhdjfk",
  authDomain: "eternal-life-ministry-online.firebaseapp.com",
  projectId: "eternal-life-ministry-online",
  storageBucket: "eternal-life-ministry-online.firebasestorage.app",
  messagingSenderId: "956104760847",
  appId: "1:956104760847:web:4ba0b451139717a9928d7a",
  measurementId: "G-2MQ1TNGYTS"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const auth = getAuth(app)

export default{ app, db, auth}
