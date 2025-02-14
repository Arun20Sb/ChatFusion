import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContextProvider";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import ChatPlaceholder from "./ChatPlaceholder";

function CenterChat({ setSelectedUser }) {
  const [input, setInput] = useState("");
  const { userData, messagesId, chatUser, messages, setMessages, theme } =
    useContext(AppContext);

  const [play, setPlay] = useState(false);
  const handlePlay = () => {
    setPlay(true);

    setTimeout(() => {
      setPlay(false);
    }, 5000);
  };

  // Send message to friend:
  const sendMsg = async () => {
    if (!input.trim() || !messagesId) return;

    try {
      // Add message to Firestore
      await updateDoc(doc(db, "MESSAGES", messagesId), {
        messages: arrayUnion({
          sId: userData.id,
          text: input,
          createdAt: new Date().toISOString(),
        }),
      });

      // Update chat data for both users
      const userIds = [chatUser.rId, userData.id];

      for (const id of userIds) {
        const userChatsRef = doc(db, "CHATS", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (!userChatsSnapshot.exists()) continue;

        const userChatData = userChatsSnapshot.data();

        // Find the chat entry for the current conversation
        const chatIndex = userChatData.chatData.findIndex(
          (c) => c.messageId === messagesId
        );

        if (chatIndex !== -1) {
          // If chat entry exists, update it
          userChatData.chatData[chatIndex].lastMessage = input.slice(0, 27);
          userChatData.chatData[chatIndex].updatedAt = Date.now();

          if (id === chatUser.rId) {
            userChatData.chatData[chatIndex].messageSeen = false; // Receiver sees the new message as unseen
          } else {
            userChatData.chatData[chatIndex].messageSeen = true; // Sender has already seen their message
          }
        } else {
          // If no existing entry, add a new one
          userChatData.chatData.push({
            messageId: messagesId,
            lastMessage: input.slice(0, 27),
            rId: chatUser.rId,
            updatedAt: Date.now(),
            messageSeen: id === chatUser.rId ? false : true, // Only sender marks it as seen
          });
        }

        // Update chat data in Firestore
        await updateDoc(userChatsRef, { chatData: userChatData.chatData });
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    } finally {
      setInput("");
    }
  };

  const convertTimeStamp = (timestamp) => {
    if (!timestamp) return "Invalid Date";

    // Convert string timestamp to Date if it's in ISO 8601 format
    if (typeof timestamp === "string") {
      timestamp = new Date(timestamp);
    }

    // Check if it's a valid Date object
    if (!(timestamp instanceof Date) || isNaN(timestamp)) return "Invalid Date";

    const hour = timestamp.getHours();
    const min = String(timestamp.getMinutes()).padStart(2, "0");

    if (hour === 0) return `12:${min} AM`;
    if (hour < 12) return `${hour}:${min} AM`;
    if (hour === 12) return `12:${min} PM`;
    return `${hour - 12}:${min} PM`;
  };

  // Load messages
  useEffect(() => {
    if (messagesId) {
      const unSubscribe = onSnapshot(doc(db, "MESSAGES", messagesId), (res) => {
        if (res.exists()) {
          setMessages(res.data().messages.reverse());
        }
      });

      return () => unSubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messagesId]);

  return chatUser ? (
    <div className="relative border-b-2 border-gray-900 text-xl flex flex-col h-full">
      {/* User Details */}
      <div className="absolute top-0 z-30 bg-gray-950 flex justify-between items-center mt-0 border-b-2 w-full py-3 px-3 border-gray-200 border-t-gray-950 border-2">
        <div className="flex items-center gap-2">
          {/* Back Button - Only Show on Mobile */}
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden cursor-pointer"
          >
            <img
              className="w-12 h-12 cursor-pointer"
              src="https://img.icons8.com/?size=100&id=52959&format=png&color=000000"
              alt="back"
            />
          </button>

          <input
            value={
              chatUser.userData?.avatar || chatUser.userData?.name.slice(0, 2)
            }
            readOnly
            className="w-11 h-11 bg-purple-400 rounded-full text-2xl text-center"
          />
          <h2 className="text-2xl">{chatUser.userData?.name}</h2>
        </div>

        <img
          src="https://img.icons8.com/?size=100&id=iO8CP6EX5jq2&format=png&color=000000"
          alt="Settings"
          className={`w-7 h-7 cursor-pointer hover:animate-bounce duration-500 transition-all ${
            play ? "hidden" : ""
          }`}
          onClick={handlePlay}
        />
      </div>

      {/* Chat section */}
      <div className="h-full">
        {/* Chat Messages */}
        <div
          className="bg-violet-300 h-full w-full p-6 pb-20 relative overflow-y-scroll flex flex-col-reverse max-sm:max-w-[420px]"
          style={{
            backgroundImage: `url(${theme})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          {/* Messages */}
          {messages.map((msg, index) =>
            msg.sId === userData.id ? (
              <div
                className="flex flex-row justify-end gap-2 text-gray-900 sour-gummy-font relative"
                key={index}
              >
                <p className="text-base leading-[1.3rem] bg-gray-800 text-white rounded-br-none rounded-lg py-2 px-4 w-fit max-w-[50%] mb-9 break-words">
                  {msg.text}
                </p>
                <div className="flex flex-col justify-end items-center relative">
                  <input
                    value={
                      msg.sId === userData.id
                        ? userData.avatar
                        : chatUser.userData?.avatar
                    }
                    readOnly
                    alt="Avatar"
                    className="bg-green-300 w-10 h-10 rounded-full p-1 text-center text-xl"
                  />
                  <span className="text-sm font-bold text-gray-950">
                    {convertTimeStamp(msg.createdAt)}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-row-reverse justify-end gap-2 text-gray-900 sour-gummy-font relative"
                key={index}
              >
                <p className="text-base leading-[1.2rem] bg-gray-200 rounded-bl-none rounded-lg py-1 px-3 w-fit max-w-[50%] mb-9 break-words">
                  {msg.text}
                </p>
                <div className="flex flex-col justify-end items-center relative">
                  <input
                    value={
                      msg.sId === userData.id
                        ? userData.avatar
                        : chatUser.userData?.avatar
                    }
                    readOnly
                    alt="Avatar"
                    className="bg-green-300 w-10 h-10 rounded-full p-1 text-center text-xl"
                  />
                  <span className="text-sm font-bold text-gray-950">
                    {convertTimeStamp(msg.createdAt)}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Send message */}
        <div className="bg-gray-300 text-gray-900 exo-font left-0 right-0 w-full absolute bottom-0">
          <div className="flex gap-2 items-center justify-end py-1 px-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Send a message"
              className="flex-1 w-[80%] p-3 bg-gray-300 outline-none border-none"
            />

            <input
              type="file"
              id="imageSend"
              accept="image/png, image/jpeg, image/jpg"
              hidden
            />
            <label htmlFor="imageSend">
              <img
                src="https://img.icons8.com/?size=100&id=UCpfzLwU7FX4&format=png&color=000000"
                alt="Send Image"
                className="w-6 h-7 cursor-pointer"
              />
            </label>
            <img
              onClick={sendMsg}
              src="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
              alt="Send"
              className="w-12 h-12 cursor-pointer bg-sky-400 p-1 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="relative top-[-32px] border-b-2 border-gray-900 h-full w-full flex">
      <ChatPlaceholder />
    </div>
  );
}

export default CenterChat;
