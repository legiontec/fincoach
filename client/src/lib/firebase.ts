import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBrJV7ZlHZYmY2SMAiYg9G2AE1_90yL54",
  authDomain: "fincoach-80578.firebaseapp.com",
  projectId: "fincoach-80578",
  storageBucket: "fincoach-80578.firebasestorage.app",
  messagingSenderId: "497378608499",
  appId: "1:497378608499:web:af00b47eaf4c7e9f4db106",
  measurementId: "G-GVMTC4H63H"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar Authentication
export const auth = getAuth(app);

export default app;
