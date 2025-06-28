import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKmxKUR25ZaQnRTa8UhA7LfwDP7rKM-LA",
  authDomain: "yawmiyati-3ef0a.firebaseapp.com",
  projectId: "yawmiyati-3ef0a",
  storageBucket: "yawmiyati-3ef0a.appspot.com",
  messagingSenderId: "90588474713",
  appId: "1:90588474713:web:1181d49ed9dac60e49f048",
  measurementId: "G-BXQCDP66BT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };

