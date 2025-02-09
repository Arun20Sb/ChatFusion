// Import necessary Firebase modules
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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

// Sign Up Function
const SignUp = async (username, email, password) => {
  try {
    // Create user authentication
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Ensure username is not empty
    if (!username.trim()) {
      throw new Error("Username cannot be empty");
    }

    if (password.length < 6) {
      throw new Error("Weak password, atleast 8 Characters");
    }

    // Create User Document in Firestore
    await setDoc(doc(db, "USERS", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Yo, I am using ChatFusion",
      lastSeen: Date.now(),
    });

    // Create User Chat Document
    await setDoc(doc(db, "CHATS", user.uid), {
      chatData: [],
    });

    toast.success("User created successfully! 🎉");
    toast.success("You can login now !!");
  } catch (error) {
    console.error("Error in SignUp:", error);
    toast.error(getErrorMessage(error));
  }
};

// Login Function
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("User logged in successfully! 🎉");
  } catch (error) {
    console.error(error);
    toast.error(getErrorMessage(error));
  }
};

// Logout Function
const logout = async () => {
  const isConfirmed = window.confirm("Are you sure you want to log out? 💀");
  if (!isConfirmed) return;

  try {
    await signOut(auth);
    toast.info("User logged out successfully! 💔");
  } catch (error) {
    console.error(error);
    toast.error(getErrorMessage(error));
  }
};

// Helper function to extract and format error messages
const getErrorMessage = (error) => {
  return error.code.replace("auth/", "").replace(/-/g, " ");
};

export { SignUp, login, logout, auth, db };
