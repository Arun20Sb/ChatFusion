import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContextProvider";
import ChatPlaceholder from "./ChatPlaceHolder";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

function CenterChat() {
  const { userData, messagesId, chatUser, messages, setMessages } =
    useContext(AppContext);

  const [input, setInput] = useState("");

  const sendMsg = async () => {
    try {
      if (input.trim() && messagesId) {
        // Add message to the database
        await updateDoc(doc(db, "MESSAGES", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date().toISOString(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];
        for (const id of userIds) {
          const userChatsRef = doc(db, "CHATS", id);
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatData.findIndex(
              (c) => c.messagesId === messagesId
            );

            if (chatIndex !== -1) {
              userChatsData.chatData[chatIndex].lastMessage = input.slice(
                0,
                27
              );
              userChatsData.chatData[chatIndex].updatedAt = Date.now();
            }

            if (userChatsData.chatData[chatIndex].rId === userData.id) {
              userChatsData.chatData[chatIndex].messageSeen = false;
            }
            await updateDoc(userChatsRef, {
              chatData: userChatsData.chatData,
            });
          }
        }
      }
      setInput("");
      // cleared the input after sending
    } catch (error) {
      console.error("Error sending message: ", error.message);
    }
  };

  // Load messages:
  useEffect(() => {
    if (messagesId) {
      const unSubscribe = onSnapshot(doc(db, "MESSAGES", messagesId), (doc) => {
        if (doc.exists()) {
          setMessages(doc.data().messages.reverse());
          console.log(doc.data().messages.reverse());
        }
      });

      return () => unSubscribe();
    }
  }, [messagesId, setMessages]);

  return chatUser ? (
    <div className="relative border-b-2 border-gray-900 flex flex-col h-[85vh]">
      {/* User Details */}
      <div className="flex justify-between items-center mt-0 border-b-2 w-full py-3 px-3 border-gray-200 border-t-gray-950 border-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={chatUser.userData.avatar || ""}
            className="w-10 h-10 bg-gray-300 rounded-full text-center text-2xl"
          />
          <h2>{chatUser.userData.name}</h2>
        </div>
        <img
          src="https://img.icons8.com/?size=100&id=iO8CP6EX5jq2&format=png&color=000000"
          alt=""
          className="w-7 h-7"
        />
      </div>

      {/* Chat section start*/}
      <div
        className="bg-violet-300 h-full w-full p-5 relative overflow-y-scroll flex flex-col-reverse"
        style={{
          backgroundImage: `url("/anime7.jpg")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* Sender text*/}
        {messages.map((msg, index) => {
          {
            msg.sId === userData.id ? (
              <div
                className="flex flex-row justify-end gap-2 text-gray-900 sour-gummy-font relative"
                key={index}
              >
                <p className="text-base leading-[1.2rem] bg-gray-300 rounded-br-none rounded-2xl py-1 px-2 w-1/2 mb-8">
                  {msg.text}
                </p>
                <div className="flex flex-col justify-end items-center relative">
                  <input
                    src={userData.avatar}
                    className="bg-green-300 w-10 h-10 rounded-full p-1 text-center text-3xl"
                  />
                  <span className="text-sm">19:38</span>
                </div>
              </div>
            ) : (
              {
                /* Receiver */
              }(
                <div
                  className="flex flex-row-reverse justify-end gap-2 text-gray-900 sour-gummy-font relative"
                  key={index}
                >
                  <p className="text-base leading-[1.2rem] bg-gray-300 rounded-bl-none rounded-2xl py-1 px-2 w-1/2 mb-8">
                    {msg.text}
                  </p>
                  <div className="flex flex-col justify-end items-center relative">
                    <input
                      src={chatUser.userData.avatar}
                      className="bg-green-300 w-10 h-10 rounded-full p-1 text-center text-3xl"
                    />
                    <span className="text-sm">19:38</span>
                  </div>
                </div>
              )
            );
          }
        })}
      </div>
      {/* Chat section end*/}

      {/* Send message */}
      <div className="bg-gray-300 text-gray-900 exo-font  left-0 right-0 w-full">
        <div className="flex gap-2 items-center justify-end py-0 px-3">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
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
              alt=""
              className="w-5 h-6 cursor-pointer"
            />
          </label>
          <img
            onClick={sendMsg}
            src="https://img.icons8.com/?size=100&id=93330&format=png&color=000000"
            alt=""
            className="w-7 h-7 cursor-pointer bg-sky-400 p-1 rounded-full"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="relative border-b-2 border-gray-900 h-full w-full">
      <ChatPlaceholder />
    </div>
  );
}

export default CenterChat;
