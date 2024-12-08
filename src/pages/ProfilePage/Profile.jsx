import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-slate-300 flex items-center justify-center">
      <div className="w-[70%] h-[85vh] max-sm:block bg-gray-950 text-gray-300 mx-auto rounded-xl grid grid-cols-2 border-2 border-gray-950">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="bg-gray-900 flex flex-col gap-5 px-7 py-7 lacquer-font rounded-tl-lg rounded-bl-xl "
        >
          <h3 className="text-4xl mt-4 mb-7 font-bold underline">
            My Profile Details
          </h3>
          <label htmlFor="myImage" className="mb-7 text-xl">
            <input
              type="file"
              id="myImage"
              accept=".jpg ,.jpeg , .png"
              hidden
            />
            <img
              src="https://img.icons8.com/?size=100&id=6oAufRlrYpcN&format=png&color=000000"
              alt=""
              className="w-24 h-24 inline-block mx-4 mr-7 bg-purple-300 p-2 rounded-full"
            />
            Upload your Image here
          </label>
          <input
            type="text"
            placeholder="Enter Your name bro"
            required
            className="p-2 rounded-sm border-none outline-none text-gray-900"
          />
          <textarea
            placeholder="Write something about yourself.."
            required
            className="p-2 rounded-sm border-none outline-none text-gray-900"
          ></textarea>
          <button
            type="submit"
            className="border-2 py-2 bg-purple-800 hover:border-gray-400 active:translate-y-1 shadow-md duration-200 font-bold text-xl px-7 rounded cursor-pointer transition-all flex items-center gap-2 justify-center"
            onClick={() => navigate("/chat")}
          >
            Save
          </button>
        </form>
        <img
          src="/profile2.jpg"
          alt=""
          className="h-full object-cover rounded-tr-xl rounded-br-xl"
        />
      </div>
    </div>
  );
}

export default Profile;
