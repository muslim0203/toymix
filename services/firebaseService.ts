import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBnXD_ni0Hkbhdtpt_6ANC94YDhdkPXYWk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "toymix-14889.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "toymix-14889",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "toymix-14889.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "58016933904",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:58016933904:web:073193e73da62987a60295",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
