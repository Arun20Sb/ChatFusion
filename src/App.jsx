import { Route, Routes, useNavigate } from "react-router-dom";
import Chat from "./pages/ChatPage/Chat";
import Login from "./pages/LoginPage/Login";
import Profile from "./pages/ProfilePage/Profile";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/FirebaseConfig";
import { AppContext } from "./context/AppContextProvider";

function App() {
  const navigate = useNavigate();
  const { loadUser, userData } = useContext(AppContext);
  const [isNavigated, setIsNavigated] = useState(false); // Flag to track navigation

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !isNavigated) { // Prevent multiple navigations
        try {
          await loadUser(user.uid);
          if (userData) {
            setIsNavigated(true); // Set the flag to true to prevent further navigation
            navigate("/chat");
          }
        } catch (error) {
          console.error("Error loading user data: ", error);
        }
      } else if (!user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [loadUser, navigate, userData, isNavigated]); // Add isNavigated to prevent re-triggering

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
