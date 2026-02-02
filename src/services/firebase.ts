import { initializeApp } from "firebase/app";
import * as Auth from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIPsGsdsEHpFmECqx2fuTFb-PbKQu374A",
  authDomain: "restaurant-52990.firebaseapp.com",
  projectId: "restaurant-52990",
  storageBucket: "restaurant-52990.appspot.com",
  messagingSenderId: "1061317121456",
  appId: "1:1061317121456:web:d3f7edfca218864ea57275",
};

export const app = initializeApp(firebaseConfig);


export const auth = (Auth as any).getAuth(app);

export const db = getFirestore(app);
