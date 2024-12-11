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
  const { loadUser } = useContext(AppContext);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        navigate("/chat");
        console.log(user);
        await loadUser(user.uid);
      } else navigate("/");
    });
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
