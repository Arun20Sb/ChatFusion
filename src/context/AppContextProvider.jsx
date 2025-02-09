import { createContext, useEffect, useState } from "react";
import { db } from "../config/FirebaseConfig";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [UserChatData, setUserChatData] = useState([]);

  const [chatUser, setChatUser] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();

  // Once logged/SignUp, fetch UserData{}
  const FetchUsersData = async (uid) => {
    try {
      const userRef = doc(db, "USERS", uid);
      const userSnapShot = await getDoc(userRef);

      if (userSnapShot.exists()) {
        const userRawData = userSnapShot.data();
        setUserData(userRawData);

        if (userRawData.avatar && userRawData.name) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }

        // Now update the lastSeen of User now:
        await updateDoc(userRef, { lastSeen: Date.now() });
      } else {
        console.log("No such user found! ❌");
      }
    } catch (error) {
      console.error("Error fetching user Data, refresh please!!", error);
    }
  };

  // Once above UserData Fetched, fetch chatData[{A->B}, {A->C}...]
  useEffect(() => {
    if (!userData?.id) return;

    const UserChatRef = doc(db, "CHATS", userData.id);
    // RealTime SnapShot:
    const unsub = onSnapshot(UserChatRef, async (chats) => {
      if (chats.exists()) {
        const userChatData = chats.data().chatData; // chatData[{A->B}, {A->C}...]
        const tempChatData = [];

        // Fetch User Data for Each Chat:
        for (const chat of userChatData) {
          const userRef = doc(db, "USERS", chat.rId);
          const userSnapShot = await getDoc(userRef);

          if (userSnapShot.exists()) {
            tempChatData.push({ ...chat, userData: userSnapShot.data() });
          }
        }

        // Sort messages by updatedAT:
        setUserChatData((prevData) => {
          const sortedData = tempChatData.sort(
            (a, b) => b.updatedAt - a.updatedAt
          );
          return JSON.stringify(prevData) !== JSON.stringify(sortedData)
            ? sortedData
            : prevData;
        });
      }
    });

    return () => unsub();
  }, [userData?.id]);

  const value = {
    userData,
    setUserData,
    UserChatData,
    setUserChatData,
    FetchUsersData,
    chatUser,
    setChatUser,
    messagesId,
    setMessagesId,
    messages,
    setMessages,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
