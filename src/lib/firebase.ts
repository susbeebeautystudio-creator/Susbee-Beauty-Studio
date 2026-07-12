import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5zYQvZ8VL781asR23yEQqyhljOXtXvrY",
  authDomain: "gen-lang-client-0680684142.firebaseapp.com",
  projectId: "gen-lang-client-0680684142",
  storageBucket: "gen-lang-client-0680684142.firebasestorage.app",
  messagingSenderId: "477653436140",
  appId: "1:477653436140:web:208ee8e90c329c45c707c9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-susbeebeautystud-9fffff3c-68d1-42cc-a516-9dcd4850cef3");
