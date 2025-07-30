import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD1djo1LGtDmd44vtCJuPR9Tmvh6IbluE",
  authDomain: "abel-co.firebaseapp.com",
  projectId: "abel-co",
  storageBucket: "abel-co.firebasestorage.app",
  messagingSenderId: "992522471627",
  appId: "1:992522471627:web:cebe05f9fd61739a75b34e",
  measurementId: "G-0NMTNG9MSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };