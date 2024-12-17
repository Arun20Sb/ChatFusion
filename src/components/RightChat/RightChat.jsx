import { useContext } from "react";
import { AppContext } from "../../context/AppContextProvider";
import RightMusic from "./RightMusic";

function RightChat() {
  const { chatUser } = useContext(AppContext);

  return chatUser ? (
    <div className="flex flex-col relative min-h-[85vh] w-full">
      {/* Profile view */}
      <div className="flex flex-col items-center pt-12 pb-5 border-b-2 border-gray-300 nunito-font">
        <input
          value={chatUser.userData.avatar}
          alt="Profile Avatar"
          className="bg-gray-300 p-1 rounded-full w-28 h-28 text-7xl text-center"
        />
        <h2 className="text-lg my-2">{chatUser.userData.name}</h2>
        <p className="text-sm">{chatUser.userData.bio}</p>
      </div>

      {/* Media view */}
      <h1 className="relative w-auto doto-font py-1 px-4 text-xl bg-gray-100 text-gray-900 font-bold">
        Tech Used in Building ChatFusion
      </h1>

      <div className="overflow-y-scroll m-5 max-w-full grid grid-cols-3 gap-5 mt-8">
        <img
          src="https://img.icons8.com/?size=100&id=20909&format=png&color=000000"
          alt="Sample Image 4"
          className="w-20 rounded-md cursor-pointer hover:scale-105 duration-200 transition-all"
        />
        <img
          src="https://img.icons8.com/?size=100&id=wPohyHO_qO1a&format=png&color=000000"
          alt="Sample Image 1"
          className="w-20 rounded-md cursor-pointer hover:scale-105 duration-200 transition-all"
        />
        <img
          src="https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000"
          alt="Sample Image 2"
          className="w-20 rounded-md cursor-pointer hover:scale-105 duration-200 transition-all"
        />
        <img
          src="https://img.icons8.com/?size=100&id=62452&format=png&color=000000"
          alt="Sample Image 3"
          className="w-20 rounded-md cursor-pointer hover:scale-105 duration-200 transition-all"
        />
      </div>
      <RightMusic audioFile="/music/song.mp3" />
    </div>
  ) : (
    <div className="flex justify-evenly items-center gap-5 flex-col">
      <p className="text-3xl m-5">Select someone to Chat 🗣️</p>
      <RightMusic audioFile="/music/song.mp3" />
      <p className="text-2xl doto-font">ChatFusion 💖</p>
    </div>
  );
}

export default RightChat;
