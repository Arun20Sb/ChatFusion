import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, logout, auth } from "../../config/FirebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { AppContext } from "../../context/AppContextProvider";
import { toast } from "react-toastify";
import { Search, Settings, LogOut, User, MessageSquare } from "lucide-react";

function LeftChat() {
  const [showMenu, setShowMenu] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const { userData, chatData, setChatUser, setMessagesId, messageId } =
    useContext(AppContext);

  const navigate = useNavigate();
  const searchTimeout = useRef(null);

  // Set current user ID on component mount
  useEffect(() => {
    if (auth.currentUser) {
      setCurrentUserId(auth.currentUser.uid);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleSearch = async (e) => {
    const searchValue = e.target.value.trim();
    if (!searchValue || !currentUserId) {
      setShowSearch(false);
      setSearchResult(null);
      return;
    }

    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        setShowSearch(true);

        // Query only by name
        const userRef = collection(db, "USERS");
        const userQuery = query(userRef, where("username", "==", searchValue));

        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          // Filter out current user in JavaScript
          const foundUsers = querySnapshot.docs.map((doc) => doc.data());
          const foundUser = foundUsers.find(
            (user) => user.id !== currentUserId
          );

          if (foundUser) {
            // Check if user is already in chat list
            const userExist = chatData?.some(
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
      } finally {
        setIsSearching(false);
      }
    }, 500);
  };

  const showChats = async () => {
    if (!searchResult || !currentUserId) return;

    try {
      const messagesRef = collection(db, "MESSAGES");
      const chatRef = collection(db, "CHATS");

      // Create new message document
      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createdTime: serverTimestamp(),
        messages: [],
      });

      const batch = writeBatch(db);

      // Get current timestamp
      const timestamp = new Date();

      // Get existing chat data for both users
      const [chatSnap1, chatSnap2] = await Promise.all([
        getDoc(doc(chatRef, searchResult.id)),
        getDoc(doc(chatRef, currentUserId)),
      ]);

      const chatData1 = chatSnap1.exists()
        ? chatSnap1.data().chatData || []
        : [];
      const chatData2 = chatSnap2.exists()
        ? chatSnap2.data().chatData || []
        : [];

      const newChatEntry = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: currentUserId,
        updatedAt: timestamp, // Use JavaScript Date instead
        messageSeen: true,
      };

      // Update both users' chat data
      batch.set(
        doc(chatRef, searchResult.id),
        { chatData: [...chatData1, newChatEntry] },
        { merge: true }
      );

      batch.set(
        doc(chatRef, currentUserId),
        { chatData: [...chatData2, { ...newChatEntry, rId: searchResult.id }] },
        { merge: true }
      );

      await batch.commit();
      toast.success("Chat created successfully!");

      setSearchResult(null);
      setChatUser(searchResult);
      setShowSearch(false);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create chat");
    }
  };

  const selectChat = async (friend) => {
    if (!currentUserId) return;

    try {
      setMessagesId(friend.messageId);
      setChatUser(friend);

      const userChatsRef = doc(db, "CHATS", currentUserId);
      const userChatsSnapshot = await getDoc(userChatsRef);

      if (!userChatsSnapshot.exists()) return;

      const userChatsData = userChatsSnapshot.data();
      const chatEntry = userChatsData.chatData.find(
        (c) => c.messageId === friend.messageId
      );

      if (chatEntry && !chatEntry.messageSeen) {
        await updateDoc(userChatsRef, {
          chatData: arrayRemove(chatEntry),
        });
        await updateDoc(userChatsRef, {
          chatData: arrayUnion({ ...chatEntry, messageSeen: true }),
        });
      }
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
    <div className="flex relative border-r-2 p-3 border-gray-500 flex-col h-[85vh]">
      <div className="flex justify-between flex-col gap-5 my-3 p-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            <div className="relative group cursor-pointer">
              <span className="text-2xl font-semibold">ChatFusion</span>
              <span className="absolute top-0 left-0 text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 transition-transform duration-300 transform scale-100 group-hover:-translate-y-1">
                ChatFusion
              </span>
            </div>
          </div>

          <div className="relative">
            <Settings
              className="w-5 h-5 cursor-pointer hover:rotate-90 transition-all duration-300"
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
              onChange={handleSearch}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setShowSearch(false);
                  setSearchResult(null);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
        {showSearch && searchResult ? (
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
          chatData?.map((friend, index) => (
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
    </div>
  );
}

export default LeftChat;
