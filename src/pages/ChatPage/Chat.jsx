import LeftChat from "../../components/LeftChat/LeftChat";
import CenterChat from "../../components/CenterChat/CenterChat";
import RightChat from "../../components/RightChat/RightChat";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContextProvider";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    if (chatData && userData) setIsloading(false);
  }, [chatData, userData]);

  return (
    <div className="h-screen grid place-items-center bg-gray-200">
      {isloading ? (
        <div className="bg-gray-900 text-gray-200 lacquer-font h-full w-full text-center flex justify-center items-center text-4xl gap-4">
          <p className="text-4xl duration-1000 transition-all animate-bounce">
            Loading...
          </p>
          <span className="duration-1000 animate-spin text-5xl">⚽</span>
        </div>
      ) : (
        <div className="w-[90%] h-[85vh] grid grid-cols-[1fr_2fr_1fr] bg-gray-950 text-gray-100 mx-auto">
          <LeftChat />
          <CenterChat />
          <RightChat />
        </div>
      )}
    </div>
  );
};

export default Chat;
