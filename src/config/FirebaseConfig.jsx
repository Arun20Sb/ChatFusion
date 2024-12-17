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

// Firebase configuration
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

// Sign Up
const SignUp = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Create COLLECTIONS-I - USERS:
    await setDoc(doc(db, "USERS", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Yo, i am using ChatFusion",
      lastSeen: Date.now(),
    });

    // Create DOCUMENT OF COLLECTION-USERS - CHATS:
    await setDoc(doc(db, "CHATS", user.uid), { chatData: [] });

    toast("User created successfully! 🎉");
  } catch (error) {
    console.error(error);
    toast.error(getErrorMessage(error));
  }
};

// Login
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast("User Logged in successfully! 🎉");
  } catch (error) {
    console.error(error);
    toast.error(getErrorMessage(error));
  }
};

// Logout
const logout = async () => {
  const isConfirmed = window.confirm("Are you sure you want to log out? 💀");
  if (!isConfirmed) return;

  try {
    await signOut(auth);
    toast("User Logged out successfully! 💔");
  } catch (error) {
    console.error(error);
    toast.error(getErrorMessage(error));
  }
};

// Helper function to handle error messages
const getErrorMessage = (error) => {
  return error.code.split("/")[1].split("-").join(" ");
};

export { SignUp, login, logout, auth, db };
