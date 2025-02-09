import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AppContext } from "./context/AppContextProvider";
import { ToastContainer } from "react-toastify";
import { auth } from "./config/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import Chat from "./pages/ChatPage/Chat";
import Login from "./pages/LoginPage/Login";
import Profile from "./pages/ProfilePage/Profile";

function App() {
  const { FetchUsersData } = useContext(AppContext);
  const navigate = useNavigate();

  // whenever login, logout, signup occurs:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("User status changed: ", user);
      if (user) {
        await FetchUsersData(user.uid);
        navigate("/profile");
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
