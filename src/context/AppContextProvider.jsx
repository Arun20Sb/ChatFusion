import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/FirebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const navigate = useNavigate();

  // Load user Data from firebase firestore:
  const loadUser = async (uid) => {
    try {
      const userRef = doc(db, "USERS", uid);
      const userSnap = await getDoc(userRef);
      const usersData = userSnap.data();
      setUserData(usersData);

      if (userData?.avatar && userData.name) {
        navigate("/chat", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }

      // lastSeen here:
      const intervalId = setInterval(async () => {
        if (auth.chatUser) {
          await updateDoc(userRef, {
            lastSeen: Date.now(),
          });
        }
      }, 60000 * 5);

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error(error);
    }
  };

  // if userData changes, fetch chats data now:
  useEffect(() => {
    if (userData) {
      const chatRef = doc(db, "CHATS", userData.id);

      const unsub = onSnapshot(chatRef, async (response) => {
        const chatItems = response.data().chatData;
        const tempData = [];

        for (const item of chatItems) {
          const userRef = doc(db, "USERS", item.rId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          tempData.push({ ...item, userData });
        }
        // latest first
        setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
      });
      // Cleanup function, when component unmounts:
      return () => {
        unsub();
      };
    }
  }, [userData, chatData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUser,
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
