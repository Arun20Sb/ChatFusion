import { memo } from "react";

// eslint-disable-next-line react/display-name
const ChatPlaceholder = memo(() => (
  <div className=" flex items-center justify-center mt-0 border-b-2 w-full py-3 px-3 border-gray-200 border-t-gray-950 border-2 h-full">
    <iframe
      src="https://giphy.com/embed/SYvR2rmLQ7R4nIOajJ"
      width="75%"
      height="100%"
      style={{
        pointerEvents: "none",
      }}
      className="giphy-embed"
      allowFullScreen
    ></iframe>
  </div>
));

export default ChatPlaceholder;
