function RightChat() {
  return (
    <div className="flex flex-col relative h-[85vh] w-full">
      {/* Profile view */}
      <div className="flex flex-col items-center pt-12 pb-5 border-b-2 border-gray-300 nunito-font">
        <img
          src="https://img.icons8.com/?size=100&id=KdWbf0poZEB2&format=png&color=000000"
          alt=""
          className="bg-gray-300 p-1 rounded-full w-28"
        />
        <h2 className="text-lg my-2">Arun Singh Bisht</h2>
        <p className="text-sm">Bhai kuch kam kaj ni h kya</p>
      </div>
      {/* Media view */}
      <h1 className="relative w-auto doto-font py-1 px-4 text-xl bg-gray-100 text-gray-900 font-bold">
        Media
      </h1>
      <div className="overflow-y-scroll my-2 relative mx-2 flex flex-row flex-wrap justify-evenly h-full">
        <img
          src="/sample.jpeg"
          alt=""
          className="w-20 h-20 rounded-md mx-1 my-1"
        />
        <img
          src="/sample.jpeg"
          alt=""
          className="w-20 h-20 rounded-md mx-1 my-1"
        />
        <img
          src="/sample.jpeg"
          alt=""
          className="w-20 h-20 rounded-md mx-1 my-1"
        />
        <img
          src="/sample.jpeg"
          alt=""
          className="w-20 h-20 rounded-md mx-1 my-1"
        />
      </div>
      {/* Logout view */}
      <div></div>
    </div>
  );
}

export default RightChat;
