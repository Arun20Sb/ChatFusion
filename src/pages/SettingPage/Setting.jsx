import { useNavigate } from "react-router-dom";
import ChatPlaceholder from "../../components/CenterChat/ChatPlaceHolder";

const Setting = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-950 min-h-screen w-full flex flex-col gap-0 p-5 relative">
      <button
        onClick={() => navigate("/chat")}
        className="hover:cursor-pointer absolute top-5 left-5 z-20 hover:translate-x-1 transform transition-all"
      >
        <img
          className="w-12 h-12 cursor-pointer "
          src="https://img.icons8.com/?size=100&id=52959&format=png&color=000000"
          alt="back"
        />
      </button>
      <ChatPlaceholder />
    </div>
  );
};

export default Setting;
