import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/FirebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState([]);
  
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  
  const navigate = useNavigate();

  // Load user data from Firestore
  const LoadingUser = async (uid) => {
    try {
      const userRef = doc(db, "USERS", uid);
      const userSnap = await getDoc(userRef);

      const usersData = userSnap.data();
      setUserData(usersData);

      if (usersData.avatar && usersData.name) {
        navigate("/chat");
      } else {
        navigate("/profile");
      }

      // lastSeen here:
      setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000 * 5);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  // Fetch chat data when userData changes
  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "CHATS", userData.id);

      const unsub = onSnapshot(chatRef, async (res) => {
        if (res.exists()) {
          const chatItems = res.data().chatData;
          const tempData = [];

          for(const item of chatItems){
            const userRef = doc(db, "USERS", item.rId);
            const userSnap = await getDoc(userRef);
            const userData= userSnap.data();
            tempData.push({...item, userData})
          }

          // const chatList = await Promise.all(tempData);
          setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
        }
      });

      return () => unsub();
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    LoadingUser,
    messagesId,
    setMessagesId,
    messages,
    setMessages,
    chatUser,
    setChatUser,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
