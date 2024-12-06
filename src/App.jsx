import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/ChatPage/Chat";
import Login from "./pages/LoginPage/Login";
import Profile from "./pages/ProfilePage/Profile";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
