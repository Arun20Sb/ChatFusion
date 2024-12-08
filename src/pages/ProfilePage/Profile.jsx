import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const [profileImg, setProfileImg] = useState(false);

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
          <label htmlFor="myImage" className="mb-7 text-xl cursor-pointer">
            <input
              type="file"
              id="myImage"
              accept=".jpg ,.jpeg , .png"
              hidden
              onChange={(e) => setProfileImg(e.target.files[0])}
            />
            <img
              src={
                profileImg
                  ? URL.createObjectURL(profileImg)
                  : `https://img.icons8.com/?size=100&id=6oAufRlrYpcN&format=png&color=000000`
              }
              alt=""
              className="w-28 h-28 inline-block mx-4 mr-7 rounded-full object-cover bg-none border-4 border-gray-300"
            />
            Upload your Image here
          </label>
          <input
            type="text"
            placeholder="Enter Your name bro"
            required
            className="py-2 px-3 rounded-sm border-none outline-none text-gray-900"
          />
          <textarea
            placeholder="Write something about yourself.."
            required
            className="py-2 px-3 rounded-sm border-none outline-none text-gray-900"
          ></textarea>
          <button
            type="submit"
            className="border-2 py-2 bg-purple-800 hover:border-gray-400 active:translate-y-1 shadow-md duration-200 font-bold text-xl px-7 rounded cursor-pointer transition-all flex items-center gap-2 justify-center"
            onClick={() => navigate("/chat")}
          >
            Save
          </button>
        </form>
        <div className="relative">
          <img
            src="/profile2.jpg"
            alt=""
            className="h-full absolute z-10 rounded-tr-xl rounded-br-xl object-cover"
          />
          <img
            src={
              profileImg
                ? URL.createObjectURL(profileImg)
                : `https://img.icons8.com/?size=100&id=6oAufRlrYpcN&format=png&color=000000`
            }
            alt=""
            className="relative z-20 mx-auto top-1/2 transform -translate-y-1/2 rounded-full w-60 h-60 object-cover border-4 border-purple-500 bg-gray-900"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
