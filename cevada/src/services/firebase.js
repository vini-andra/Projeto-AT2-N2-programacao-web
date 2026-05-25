// cevada/src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBLuT8t9BfvOeAbO5X7JTQomArVXL7Vz1M",
  authDomain: "projetoextensaoweb.firebaseapp.com",
  projectId: "projetoextensaoweb",
  storageBucket: "projetoextensaoweb.firebasestorage.app",
  messagingSenderId: "227778553447",
  appId: "1:227778553447:web:a35041bbf1ee652744d6c2",
  measurementId: "G-WSGD5KC5CG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export default app;
