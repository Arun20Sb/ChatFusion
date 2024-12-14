import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, logout } from "../../config/FirebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
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
  const [isSearching, setIsSearching] = useState(false);

  const { userData, chatData, setChatUser, setMessagesId } =
    useContext(AppContext);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    if (!searchValue) {
      setSearchResult(false);
      setIsSearching(null);
      return;
    }

    try {
      const userRef = collection(db, "USERS");
      const userQuery = query(userRef, where("name", "==", searchValue));
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const foundUser = querySnapshot.docs[0].data();
        if (foundUser.id !== userData.id) {
          const userExists = chatData.some((u) => u.rId === foundUser.id);
          setSearchResult(userExists ? null : foundUser);
          setIsSearching(!userExists);
        }
      } else {
        setSearchResult(null);
        setIsSearching(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching data");
    }
  };

  const showChats = async () => {
    if (!searchResult) return;

    try {
      const messagesRef = collection(db, "MESSAGES");
      const newMessageRef = doc(messagesRef);

      await setDoc(newMessageRef, {
        createdTime: serverTimestamp(),
        messages: [],
      });

      const chatRef = collection(db, "CHATS");
      const chatUpdate = {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true,
        }),
      };

      await updateDoc(doc(chatRef, searchResult.id), chatUpdate);
      await updateDoc(doc(chatRef, userData.id), chatUpdate);

      setSearchResult(null);
      setIsSearching(false);
    } catch (error) {
      console.error(error);
      toast.error("Error initiating chat.");
    }
  };

  const selectChat = (friend) => {
    setMessagesId(friend.messageId);
    setChatUser(friend);
  };

  return (
    <div className="flex relative border-2 border-gray-500 flex-col sour-gummy-font h-[85vh]">
      {/* Search section */}
      <div className="flex justify-between flex-col gap-5 my-3 p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <img
              src="https://img.icons8.com/?size=100&id=VB5h1R8mz5k6&format=png&color=000000"
              alt="ChatFusion"
              className="w-12 h-12 inline-block"
            />
            <span className="text-2xl font-semibold active:animate-bounce cursor-pointer">
              ChatFusion
            </span>
          </div>
          <span>
            <img
              src="https://img.icons8.com/?size=100&id=21618&format=png&color=000000"
              alt="Settings"
              className="filter invert w-5 h-5 cursor-pointer"
              onClick={() => setShowMenu((prev) => !prev)}
            />
          </span>
          {showMenu && (
            <div className="absolute right-10 top-14 bg-gray-200 text-gray-900 exo-font text-lg font-semibold py-2 px-3  border-2 border-gray-950 rounded-md rounded-tr-none">
              <h3
                className="border-b-2 border-gray-900 pb-1 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                My Profile
              </h3>
              <hr />
              <h3
                className="border-b-2 border-gray-900 pb-1 cursor-pointer"
                onClick={() => logout()}
              >
                LogOut
              </h3>
              <hr />
              <div className="flex gap-2 items-center">
                <h3 className="cursor-pointer">Settings</h3>
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
      {/* Friends Section */}
      <div className="flex-1 h-full overflow-y-scroll mb-7">
        {isSearching && searchResult ? (
          <div
            className="flex items-center justify-start gap-3 py-2 px-4 hover:bg-gray-700 cursor-pointer"
            onClick={showChats}
          >
            <input
              type="text"
              readOnly
              value={searchResult.avatar || ""}
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
                value={friend.userData.avatar || "?"}
                readOnly
                className="w-10 h-10 bg-purple-400 rounded-full text-2xl"
              />
              <div>
                <h2 className="text-[17px] font-semibold">
                  {friend.userData.name}
                </h2>
                <p className="text-sm">{friend.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default LeftChat;
