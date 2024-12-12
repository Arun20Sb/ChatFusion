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
      if (input && messagesId) {
        await updateDoc(doc(db, "MESSAGES", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            text: input,
            createdAt: new Date(),
          }),
        });

        const userIds = [chatUser.rId, userData.id];
        userIds.forEach(async (id) => {
          const userChatsRef = doc(db, "CHATS", "id");
          const userChatsSnapshot = await getDoc(userChatsRef);

          if (userChatsSnapshot.exists()) {
            const userChatsData = userChatsSnapshot.data();
            const chatIndex = userChatsData.chatData.findIndex(
              (c) => c.messagesId === messagesId
            );
            userChatsData.chatData[chatIndex].lastMessage = input.slice(0, 27);

            userChatsData.chatData[chatIndex].upd
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Load messages:
  useEffect(() => {
    if (messagesId) {
      const unSubscribe = onSnapshot(doc(db, "MESSAGES", messagesId), (res) => {
        setMessages(res.data().messages.reverse());
        console.log(res.data().messages.reverse());
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
        <div className="flex flex-row justify-end gap-2 text-gray-900 sour-gummy-font relative">
          <p className="text-base leading-[1.2rem] bg-gray-300 rounded-br-none rounded-2xl py-1 px-2 w-1/2 mb-8">
            🤔Kaiju No.8 dhek sahi hai? its a sci-fi anime that tells the story
            of a man who becomes a monster, 1 season aya abhi just..🔥
          </p>
          <div className="flex flex-col justify-end items-center relative">
            <img
              src="https://img.icons8.com/?size=100&id=KdWbf0poZEB2&format=png&color=000000"
              className="bg-green-300 w-10 h-10 rounded-full p-1"
              alt="receiver"
            />
            <span className="text-sm">19:38</span>
          </div>
        </div>
        {/* Sender image*/}
        <div className="flex flex-row justify-end gap-2 text-gray-900 sour-gummy-font relative">
          <img
            src="/sample.jpeg"
            alt=""
            className="max-w-64 max-h-56 mb-8 rounded-md"
          />
          <div className="flex flex-col justify-end items-center relative">
            <img
              src="https://img.icons8.com/?size=100&id=KdWbf0poZEB2&format=png&color=000000"
              className="bg-green-300 w-10 h-10 rounded-full p-1"
              alt="receiver"
            />
            <span className="text-sm">19:38</span>
          </div>
        </div>
        {/* Receiver */}
        <div className="flex flex-row-reverse justify-end gap-2 text-gray-900 sour-gummy-font relative">
          <p className="text-base leading-[1.2rem] bg-gray-300 rounded-bl-none rounded-2xl py-1 px-2 w-1/2 mb-8">
            Yo 👊🏻, ek anime suggest krr koi? fantasy ya scifi, abhi just
            dandadan finish kri mene?
          </p>
          <div className="flex flex-col justify-end items-center relative">
            <img
              src="https://img.icons8.com/?size=100&id=zrErKKsIhJqc&format=png&color=000000"
              className="bg-green-300 w-10 h-10 rounded-full p-1"
              alt="receiver"
            />
            <span className="text-sm">19:38</span>
          </div>
        </div>
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
