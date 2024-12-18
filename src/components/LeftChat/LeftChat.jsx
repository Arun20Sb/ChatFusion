import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, logout } from "../../config/FirebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { AppContext } from "../../context/AppContextProvider";
import { toast } from "react-toastify";

function LeftChat() {
  const [showMenu, setShowMenu] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  // const [isSearching, setIsSearching] = useState(false);

  const { userData, chatData, setChatUser, setMessagesId, messageId } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    if (searchValue.length <= 3) return;
    try {
      if (searchValue) {
        setShowSearch(true);

        const userRef = collection(db, "USERS");
        const userQuery = query(userRef, where("name", "==", searchValue));
        const querySnapshot = await getDocs(userQuery);

        if (
          !querySnapshot.empty &&
          querySnapshot.docs[0].data().id !== userData.id
        ) {
          let userExist = false;
          chatData.map((user) => {
            if (user.rId === querySnapshot.docs[0].data().id) {
              userExist = true;
            }
          });
          if (!userExist) {
            setSearchResult(querySnapshot.docs[0].data());
          }
        } else {
          setSearchResult(null);
        }
      } else {
        setShowSearch(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error fetching data");
    }
  };

  const showChats = async () => {
    if (!searchResult) return;

    // Create COLLECTION-II - MESSAGES:
    const messagesRef = collection(db, "MESSAGES");
    const chatRef = collection(db, "CHATS");
    try {
      const newMessageRef = doc(messagesRef);

      // Create the messages document
      await setDoc(newMessageRef, {
        createdTime: serverTimestamp(),
        messages: [],
      });

      // Update the chat document with a reference to the message document
      // Create a reference to a new chat document
      // User A:

      await updateDoc(doc(chatRef, searchResult.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      // User B:
      await updateDoc(doc(chatRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: searchResult.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      });

      setSearchResult(null);
      setChatUser(searchResult);
    } catch (error) {
      console.error(error);
      toast.error("Error initiating chat.");
    }
  };

  const selectChat = async (friend) => {
    try {
      setMessagesId(friend.messageId);
      setChatUser(friend);

      const userChatsRef = doc(db, "CHATS", userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatData.findIndex(
        (c) => c.messageId === friend.messageId
      );
      userChatsData.chatData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, { chatData: userChatsData.chatData });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex relative border-r-2 p-3 border-gray-500 flex-col sour-gummy-font h-[85vh]">
      <div className="flex justify-between flex-col gap-5 my-3 p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <img
              src="https://img.icons8.com/?size=100&id=VB5h1R8mz5k6&format=png&color=000000"
              alt="ChatFusion"
              className="w-12 h-12 inline-block"
            />
            <div className="relative group cursor-pointer">
              <span className="text-3xl font-semibold">ChatFusion</span>
              <span className="absolute top-0 left-0 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 transition-transform duration-300 transform scale-100 group-hover:-translate-y-2 group-hover:-rotate-3">
                ChatFusion
              </span>
            </div>
          </div>
          <span>
            <img
              src="https://img.icons8.com/?size=100&id=21618&format=png&color=000000"
              alt="Settings"
              className="filter invert w-5 h-5 cursor-pointer hover:scale-105 transition-all active:scale-100"
              onClick={() => setShowMenu((prev) => !prev)}
            />
          </span>
          {showMenu && (
            <div className="absolute right-10 top-14 text-gray-900 exo-font text-lg font-semibold py-3 px-5 border-2 bg-green-200 border-gray-950 rounded-md rounded-tr-none">
              <h3
                className="border-b-2 border-gray-900 pb-1 cursor-pointer hover:scale-105 transition-all active:scale-100"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </h3>
              <hr />
              <h3
                className="border-b-2 border-gray-900 pb-1 cursor-pointer hover:scale-105 transition-all active:scale-100"
                onClick={() => logout()}
              >
                LogOut
              </h3>
              <hr />
              <div className="flex gap-2 items-center">
                <h3
                  className="cursor-pointer hover:scale-105 transition-all active:scale-100"
                  onClick={() => navigate("/profile")}
                >
                  Settings
                </h3>
                <img
                  src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000"
                  alt=""
                  className="w-5 h-4"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex bg-gray-200 py-2 px-2 gap-2 items-center justify-center w-full max-lg:w-56 text-gray-800 rounded-sm hubot-font">
          <img
            src="https://img.icons8.com/?size=100&id=nEaCzRRWyzwN&format=png&color=000000"
            alt=""
            className="w-5 h-5 cursor-pointer"
          />
          <input
            type="text"
            placeholder="Search here.."
            className="w-full outline-none bg-gray-200 py-1 px-2"
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="flex-1 h-full overflow-y-scroll mb-7">
        {showSearch && searchResult ? (
          <div
            className="flex items-center justify-start gap-3 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={showChats}
          >
            <input
              type="text"
              readOnly
              value={searchResult.avatar}
              className="w-10 h-10 bg-gray-300 rounded-full text-center text-2xl"
            />
            <h2 className="text-[17px] font-semibold">{searchResult.name}</h2>
          </div>
        ) : (
          chatData?.map((friend, index) => (
            <div
              key={index}
              className="flex items-center justify-start gap-3 py-2 px-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => selectChat(friend)}
            >
              <input
                value={friend.userData.avatar || ""}
                readOnly
                className="w-11 h-11 bg-purple-400 rounded-full text-3xl text-center"
              />
              <div>
                <h2 className="text-[20px] font-semibold">
                  {friend.userData.name}
                </h2>
                <p
                  className={`text-[15px] ${
                    friend.messageSeen || friend.messageId === messageId
                      ? ""
                      : "text-green-400 font-bold "
                  }`}
                >
                  {(friend.lastMessage.length > 27
                    ? friend.lastMessage.slice(0, 27) + "..."
                    : friend.lastMessage) || "no lastmsg"}
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
