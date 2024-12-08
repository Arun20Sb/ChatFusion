// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfZJRXcmdiiTc6wTW_TQv_qmOUnNT6J-o",
  authDomain: "chatfusion-72cfa.firebaseapp.com",
  projectId: "chatfusion-72cfa",
  storageBucket: "chatfusion-72cfa.firebasestorage.app",
  messagingSenderId: "205760428581",
  appId: "1:205760428581:web:bd87a459b98b692999ddcc",
  measurementId: "G-YHJD010BEW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Sign Up:
const SignUp = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    await setDoc(doc(db, "USERS", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      password,
      name: "",
      avatar: "",
      description: "bhai kuch kam kaj ni h kya",
      lastseen: Date.now(),
    });
    await setDoc(doc(db, "CHATS", user.uid), {
      chatsData: [],
    });
    toast("User created successfully! 🎉");
  } catch (error) {
    console.log(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Login:
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast("User Logged in successfully! 🎉");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Login:
const logout = async (email, password) => {
  try {
    await signOut(auth, email, password);
    toast("User Logged out successfully! 😰");
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

export { SignUp, login, logout, auth, db };
