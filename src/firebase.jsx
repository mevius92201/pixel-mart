import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDAT7_xMbkJSW6Y9ba-sN9sOkKujSZArEg",
  authDomain: "pixel-mart-14008.firebaseapp.com",
  projectId: "pixel-mart-14008",
  storageBucket: "pixel-mart-14008.firebasestorage.app",
  messagingSenderId: "893772453557",
  appId: "1:893772453557:web:f368c339be756e5b7790fc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db };
export { auth };
export { app };
