import { Route, Routes, useNavigate } from "react-router-dom";
import Chat from "./pages/ChatPage/Chat";
import Login from "./pages/LoginPage/Login";
import Profile from "./pages/ProfilePage/Profile";
import { ToastContainer } from "react-toastify";
import { useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/FirebaseConfig";
import { AppContext } from "./context/AppContextProvider";

function App() {
  const navigate = useNavigate();
  const { loadUser, userData } = useContext(AppContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await loadUser(user.uid);
          if (userData) {
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
  }, [loadUser, navigate, userData]);

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
