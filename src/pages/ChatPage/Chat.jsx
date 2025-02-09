import LeftChat from "../../components/LeftChat/LeftChat";
import CenterChat from "../../components/CenterChat/CenterChat";

const Chat = () => {
  // if (isLoading) {
  //   return (
  //     <div className="h-screen grid place-items-center bg-gray-200">
  //       <div className="bg-gray-900 text-gray-200 lacquer-font h-full w-full flex justify-center items-center">
  //         <div className="flex flex-col items-center gap-4">
  //           <p className="text-4xl animate-bounce">Loading...</p>
  //           <span className="text-5xl animate-spin">⚽</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="h-screen grid place-items-center bg-gray-200">
      <div className="w-full h-full grid grid-cols-[1fr_2fr_1fr] bg-gray-950 text-gray-100 mx-auto">
        <LeftChat />
        <CenterChat />
      </div>
    </div>
  );
};

export default Chat;
