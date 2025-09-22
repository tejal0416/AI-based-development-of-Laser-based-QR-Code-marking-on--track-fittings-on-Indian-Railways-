import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "studio-503491075-d0e01",
  appId: "1:33894236298:web:ae2a26d7cc3643e3706d73",
  apiKey: "AIzaSyD6jFoKdiT7GjsL6KK8ho353RK-H5Dvhjs",
  authDomain: "studio-503491075-d0e01.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "33894236298",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
