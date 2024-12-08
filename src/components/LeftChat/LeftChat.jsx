const friends = [
  {
    name: "Arjun Mehta", // Indian
    message: "Hey, let's catch up soon!",
    image:
      "https://img.icons8.com/?size=100&id=V8tVabAreXgU&format=png&color=000000",
  },
  {
    name: "Priya Sharma", // Indian
    message: "Don't forget the meeting tomorrow.",
    image:
      "https://img.icons8.com/?size=100&id=KdWbf0poZEB2&format=png&color=000000",
  },
  {
    name: "Rahul Verma", // Indian
    message: "How was the trip to Goa?",
    image:
      "https://img.icons8.com/?size=100&id=6oAufRlrYpcN&format=png&color=000000",
  },
  {
    name: "John Doe", // Foreigner
    message: "Check out this new café near our place.",
    image: "https://img.icons8.com/?size=100&id=77989&format=png&color=000000",
  },
  {
    name: "Rohan Gupta", // Indian
    message: "Did you watch the match yesterday?",
    image:
      "https://img.icons8.com/?size=100&id=PEOcL1S6ExFT&format=png&color=000000",
  },
  {
    name: "Ananya Roy", // Indian
    message: "Happy Birthday! 🎉",
    image:
      "https://img.icons8.com/?size=100&id=eR6ipCmWdkt6&format=png&color=000000",
  },
  {
    name: "Kunal Singh", // Indian
    message: "Are we still on for the weekend?",
    image:
      "https://img.icons8.com/?size=100&id=lVQP-JvS__bJ&format=png&color=000000",
  },
  {
    name: "Sneha Kapoor", // Indian
    message: "Let's grab coffee soon!",
    image:
      "https://img.icons8.com/?size=100&id=CxsfjQ9qnPcX&format=png&color=000000",
  },
  {
    name: "Jane Smith", // Foreigner
    message: "Have you seen the latest movie?",
    image:
      "https://img.icons8.com/?size=100&id=EzjWLVtHwmC4&format=png&color=000000",
  },
  {
    name: "Michael Johnson", // Foreigner
    message: "I loved the concert last weekend.",
    image: "https://img.icons8.com/?size=100&id=23309&format=png&color=000000",
  },
];

function LeftChat() {
  return (
    <div className="flex border-2 border-gray-500 flex-col sour-gummy-font h-[85vh]">
      {/* Search section */}
      <div className="flex justify-between flex-col gap-5 my-3 p-5">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <img
              src="https://img.icons8.com/?size=100&id=VB5h1R8mz5k6&format=png&color=000000"
              alt="ChatFusion"
              className="w-12 h-12 inline-block"
            />
            <span className="text-2xl font-semibold">ChatFusion</span>
          </div>
          <span>
            <img
              src="https://img.icons8.com/?size=100&id=21618&format=png&color=000000"
              alt="Settings"
              className="filter invert w-5 h-5"
            />
          </span>
        </div>
        <div className="flex bg-gray-200 py-2 px-2 gap-2 items-center justify-center w-full max-lg:w-56 text-gray-800 rounded-sm hubot-font">
          <img
            src="https://img.icons8.com/?size=100&id=nEaCzRRWyzwN&format=png&color=000000"
            alt=""
            className="w-5 h-5 cursor-pointer"
          />
          <input
            type="text"
            placeholder="Search here.."
            className="w-full outline-none bg-gray-200 py-1 px-2"
          />
        </div>
      </div>
      {/* Friends Section */}
      <div className="flex-1 h-full overflow-y-scroll mb-7">
        <ul>
          {friends.map((friend, index) => (
            <li key={index}>
              <div className="flex items-center justify-start gap-3 py-2 px-4 hover:bg-gray-700 cursor-pointer">
                <img
                  src={friend.image}
                  alt={friend.name}
                  className="w-10 h-10 bg-purple-400 rounded-full"
                />
                <div>
                  <h2 className="text-[17px] font-semibold">{friend.name}</h2>
                  <p className="text-sm">
                    {friend.message.length >= 21
                      ? friend.message.substring(0, 20) + "..."
                      : friend.message}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LeftChat;
