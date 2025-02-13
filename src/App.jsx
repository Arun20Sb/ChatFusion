import { useContext, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AppContext } from "./context/AppContextProvider.jsx";
import { ToastContainer } from "react-toastify";
import { auth } from "./config/FirebaseConfig.jsx";
import { onAuthStateChanged } from "firebase/auth";

import Chat from "./pages/ChatPage/Chat.jsx";
import Login from "./pages/LoginPage/Login.jsx";
import Profile from "./pages/ProfilePage/Profile.jsx";
import Setting from "./pages/SettingPage/Setting.jsx";

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
        <Route path="/setting" element={<Setting />} />
      </Routes>
    </>
  );
}

export default App;
