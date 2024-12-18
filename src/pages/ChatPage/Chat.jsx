import LeftChat from "../../components/LeftChat/LeftChat";
import CenterChat from "../../components/CenterChat/CenterChat";
import RightChat from "../../components/RightChat/RightChat";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContextProvider";

const Chat = () => {
  const { chatData, userData } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chatData && userData) {
      setIsLoading(false);
    }
  }, [chatData, userData]);

  if (isLoading) {
    return (
      <div className="h-screen grid place-items-center bg-gray-200">
        <div className="bg-gray-900 text-gray-200 lacquer-font h-full w-full flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-4xl animate-bounce">Loading...</p>
            <span className="text-5xl animate-spin">⚽</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen grid place-items-center bg-gray-200">
      <div className="w-full h-full grid grid-cols-[1fr_2fr_1fr] bg-gray-950 text-gray-100 mx-auto">
        <LeftChat />
        <CenterChat />
        <RightChat />
      </div>
    </div>
  );
};

export default Chat;
