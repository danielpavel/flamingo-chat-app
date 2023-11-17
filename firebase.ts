import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCydahc1p7iBYypgYl6TdebdpyQuooWs9Y",
  authDomain: "flamingo-chat-70708.firebaseapp.com",
  projectId: "flamingo-chat-70708",
  storageBucket: "flamingo-chat-70708.appspot.com",
  messagingSenderId: "284625376647",
  appId: "1:284625376647:web:f1cd6587f28e5a360c2f22"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

export { auth, db, functions }