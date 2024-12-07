import LeftChat from "../../components/LeftChat/LeftChat";
import CenterChat from "../../components/CenterChat/CenterChat";
import RightChat from "../../components/RightChat/RightChat";

function Chat() {
  return (
    <div className="h-screen grid place-items-center bg-gray-200">
      <div className="w-[90%] h-[85vh] grid grid-cols-[1fr_2fr_1fr] bg-gray-950 text-gray-100 mx-auto">
        <LeftChat />
        <CenterChat />
        <RightChat />
      </div>
    </div>
  );
}

export default Chat;
