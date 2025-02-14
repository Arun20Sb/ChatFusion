import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, logout, auth } from "../../config/FirebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AppContext } from "../../context/AppContextProvider";
import { toast } from "react-toastify";
import { Search, Settings, LogOut, User, MessageSquare } from "lucide-react";
import AudioPlayer from "../Music";

function LeftChat({ setSelectedUser }) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const {
    setChatUser,
    UserChatData,
    setUserChatData,
    setMessagesId,
    messageId,
  } = useContext(AppContext);
  console.log(UserChatData);

  const navigate = useNavigate();

  // Set current user ID on component mount
  useEffect(() => {
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
    } else {
      navigate("/");
    }
  }, [navigate]);

  // Handle Search:
  const handleSearch = async (e) => {
    const searchValue = e.target.value.trim();
    if (!searchValue || searchValue.length < 3 || !currentUserId) {
      setSearchResult(null);
      return;
    }

    try {
      // Query only by username
      const userRef = collection(db, "USERS");
      const userQuery = query(userRef, where("username", "==", searchValue));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        // Get the first matched user (Firestore always returns an array)
        const foundUser = querySnapshot.docs[0].data();

        if (foundUser.id !== currentUserId) {
          // Check if user is already in chat list
          const userExist = UserChatData?.some(
            (chat) => chat.rId === foundUser.id
          );

          if (!userExist) {
            setSearchResult(foundUser);
          } else {
            setSearchResult(null);
            toast.info("You already have a chat with this user");
          }
        } else {
          setSearchResult(null);
          toast.info("No user found with that name");
        }
      } else {
        setSearchResult(null);
        toast.info("No user found with that name");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching for user");
      setSearchResult(null);
    }
  };

  // Show Chats b/w users
  const showChats = async () => {
    if (!searchResult || !currentUserId) return;

    try {
      const chatRef = collection(db, "CHATS");

      // Fetch current chat list from Firestore
      const userChatDoc = await getDoc(doc(chatRef, currentUserId));
      const existingChats = userChatDoc.data()?.chatData || [];

      // ✅ Check if chat already exists
      const existingChat = existingChats.find((c) => c.rId === searchResult.id);
      if (existingChat) {
        setChatUser(searchResult);
        setMessagesId(existingChat.messageId);
        return;
      }

      // ❌ No chat exists? Create a new one
      const messagesRef = collection(db, "MESSAGES");
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdTime: serverTimestamp(),
        messages: [],
      });

      const newChat = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: searchResult.id,
        updatedAt: new Date(),
        messageSeen: true,
        userData: {
          id: searchResult.id,
          name: searchResult.name,
          avatar: searchResult.avatar || "🟣",
        },
      };

      // ✅ Update Firestore
      await setDoc(
        doc(chatRef, currentUserId),
        { chatData: [...existingChats, newChat] },
        { merge: true }
      );
      await setDoc(
        doc(chatRef, searchResult.id),
        {
          chatData: [
            ...((await getDoc(doc(chatRef, searchResult.id))).data()
              ?.chatData || []),
            { ...newChat, rId: currentUserId },
          ],
        },
        { merge: true }
      );

      // ✅ **Update `chatData` in State Immediately**
      setChatUser(searchResult);
      setMessagesId(newMessageRef.id);
      setUserChatData([...existingChats, newChat]); // 🔥 **This updates UI immediately**
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  // Start chatting by selecting the friend
  const selectChat = async (friend) => {
    if (!currentUserId) return;
    setSelectedUser(true);

    navigate("/chat");

    try {
      setMessagesId(friend.messageId);
      setChatUser(friend);

      const userChatsRef = doc(db, "CHATS", currentUserId);
      const userChatsSnapshot = await getDoc(userChatsRef);
      if (!userChatsSnapshot.exists()) return;

      let chatData = userChatsSnapshot.data()?.chatData || [];
      const chatIndex = chatData.findIndex(
        (c) => c.messageId === friend.messageId
      );

      if (chatIndex !== -1) {
        // ✅ Update existing chat entry instead of adding a new one
        chatData[chatIndex].messageSeen = true;
      } else {
        // ❌ Prevent unnecessary chat creation (this part should not happen ideally)
        console.warn("Chat entry not found in user data, but it should exist.");
      }

      // ✅ Update Firestore with modified chatData
      await updateDoc(userChatsRef, { chatData });
    } catch (error) {
      console.error("Error selecting chat:", error);
      toast.error("Failed to select chat");
    }
  };

  // If no user is authenticated, don't render the component
  if (!currentUserId) {
    return null;
  }

  return (
    <div className="flex relative border-r-2 p-3 border-gray-500 flex-col justify-between text-lg h-full">
      <div className="flex justify-between flex-col gap-5 my-3 p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            <div className="relative group cursor-pointer">
              <span className="text-3xl font-semibold">ChatFusion</span>
              <span className="absolute top-0 left-0 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 transition-transform duration-300 transform scale-100 group-hover:-translate-y-1">
                ChatFusion
              </span>
            </div>
          </div>

          <div className="relative">
            <Settings
              className="w-7 h-7 cursor-pointer hover:rotate-90 transition-all duration-300"
              onClick={() => setShowMenu((prev) => !prev)}
            />

            {showMenu && (
              <div className="absolute right-0 top-8 text-gray-900 bg-white shadow-lg rounded-md overflow-hidden w-48 z-50">
                <div
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate("/setting")}
                >
                  <User className="w-4 h-4" />
                  <span>Themes</span>
                </div>
                <div
                  className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="flex bg-gray-100 rounded-lg items-center px-3 py-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by exact name..."
              className="w-full outline-none bg-transparent ml-2 text-gray-800"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e); // Trigger search only on Enter
                }
                if (e.key === "Escape") {
                  setSearchResult(null); // Clear search result on Escape
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {searchResult ? (
          <div
            className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
            onClick={showChats}
          >
            <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-2xl">
              {searchResult.avatar}
            </div>
            <div>
              <h2 className="font-semibold">{searchResult.name}</h2>
              <p className="text-sm text-gray-400">
                {searchResult.bio || "No bio"}
              </p>
            </div>
          </div>
        ) : (
          UserChatData?.map((friend, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors"
              onClick={() => selectChat(friend)}
            >
              <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center text-2xl">
                {friend.userData.avatar}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold">{friend.userData.name}</h2>
                <p
                  className={`text-sm ${
                    friend.messageSeen || friend.messageId === messageId
                      ? "text-gray-400"
                      : "text-green-400 font-medium"
                  }`}
                >
                  {friend.lastMessage
                    ? friend.lastMessage.length > 30
                      ? friend.lastMessage.slice(0, 30) + "..."
                      : friend.lastMessage
                    : "No messages yet"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <AudioPlayer />
      </div>
    </div>
  );
}

export default LeftChat;
