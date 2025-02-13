import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContextProvider.jsx";

const ChatPlaceholder = () => {
  const { theme, setTheme, userData } = useContext(AppContext);

  const [greeting, setGreeting] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"
    );
  }, []);

  const changeTheme = (newTheme) => {
    if (window.confirm("Change theme?")) setTheme(newTheme);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImage(imageUrl);
      setTheme(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-start w-full min-h-screen pb-15 p-10 pt-20 relative z-10">
      <h1 className="text-5xl font-bold text-white drop-shadow-md">
        {greeting}, {userData?.name}! {userData?.avatar}
      </h1>

      <h2 className="text-lg font-semibold text-gray-200 drop-shadow-md pt-3">
        Bio - {userData?.bio}
      </h2>

      <div className="text-white p-4 rounded-lg mt-6">
        <h2 className="text-3xl font-semibold">Rules:</h2>
        <ul className="list-decimal pl-6 mt-2 space-y-2">
          <li>Make sure your friend is also Signed Up.</li>
          <li>Search your friend&apos;s username.</li>
          <li>Start the CHAT FUSION.</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-50">Select Theme:</h2>
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            "/anime7.jpg",
            "/spiderman.jpg",
            "/onepiece.jpg",
            uploadedImage,
          ].map(
            (img, index) =>
              img && (
                <button
                  key={index}
                  onClick={() => changeTheme(img)}
                  className={`h-40 w-52 rounded-lg transition-all ${
                    theme === img ? "border-4 border-blue-500" : ""
                  }`}
                  style={{
                    background: `url(${img}) center/cover no-repeat`,
                  }}
                />
              )
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
        </div>
      </div>

      <a
        href="https://github.com/Arun20Sb/ChatAAP"
        target="_blank"
        rel="noopener noreferrer"
        className="px-5 py-3 my-5 rounded-lg font-semibold shadow-lg
             bg-[rgba(20,20,20,0.85)] text-gray-50
             transition-all duration-300 ease-in-out 
             hover:bg-[rgba(30,30,30,0.95)] hover:scale-105 hover:shadow-lg shadow-blue-500/40 hover:shadow-blue-500/40"
      >
        Start ✨ this Project on GitHub!!
      </a>
    </div>
  );
};

export default ChatPlaceholder;
