import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfL-UzXmdn6AkEdlH8KFiNCVO3DZ4tjBg",
  authDomain: "smart-electric-meter-a991c.firebaseapp.com",
  databaseURL: "https://smart-electric-meter-a991c-default-rtdb.firebaseio.com/",
  projectId: "smart-electric-meter-a991c",
  storageBucket: "smart-electric-meter-a991c.firebasestorage.app",
  messagingSenderId: "43133233852",
  appId: "1:43133233852:web:cb6f20ff92752b243cbeb9",
};

const app = initializeApp(firebaseConfig);

export const rtdb = getDatabase(app);   // Realtime Database — live ESP32 sensor data
export const db = getFirestore(app);    // Firestore — billing, alerts, historical logs