import { useState } from "react";
import LeftChat from "../../components/LeftChat/LeftChat";
import CenterChat from "../../components/CenterChat/CenterChat";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="min-h-screen grid place-items-center bg-gray-950">
      {/* Desktop View - Show Both */}
      <div className="hidden md:grid w-full h-full grid-cols-[1fr_3fr] bg-gray-950 text-gray-100">
        <LeftChat setSelectedUser={setSelectedUser} />
        <CenterChat
          setSelectedUser={setSelectedUser}
        />
      </div>

      {/* Mobile View - Toggle Between LeftChat & CenterChat */}
      <div className="md:hidden w-full h-full bg-gray-950 text-gray-100">
        {selectedUser ? (
          <CenterChat
            setSelectedUser={setSelectedUser}
          />
        ) : (
          <LeftChat setSelectedUser={setSelectedUser} />
        )}
      </div>
    </div>
  );
};

export default Chat;
