import { memo } from "react";

// eslint-disable-next-line react/display-name
const ChatPlaceholder = memo(() => (
  <div className="flex flex-col justify-evenly items-center mt-0 border-b-2 w-full py-3 px-3 border-gray-200 border-t-gray-950 border-2 h-full">
    <img
      src="https://media.giphy.com/media/PhTy277HOzgpeCtdoi/giphy.gif"
      alt="GIF"
      className="w-72 rounded-lg shadow-lg"
    />
    <p className="text-3xl m-5">Select someone to Chat 🗣️</p>
  </div>
));

export default ChatPlaceholder;
