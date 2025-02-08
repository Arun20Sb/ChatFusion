import { Route, Routes, useNavigate } from "react-router-dom";
import Chat from "./pages/ChatPage/Chat";
import Login from "./pages/LoginPage/Login";
import Profile from "./pages/ProfilePage/Profile";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/FirebaseConfig";
import { AppContext } from "./context/AppContextProvider";

function App() {
  const navigate = useNavigate();
  const { LoadingUser } = useContext(AppContext);

  // Memoizing LoadingUser to prevent unnecessary re-renders
  const loadUser = useCallback(
    async (uid) => {
      try {
        await LoadingUser(uid);
        navigate("/chat"); // Navigate after user data is loaded
      } catch (error) {
        console.error("Error loading user data: ", error);
      }
    },
    [LoadingUser, navigate]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        loadUser(user.uid);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [loadUser, navigate]); // Properly added dependencies

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
