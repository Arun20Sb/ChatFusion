import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContextProvider";

function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!emoji) {
        toast.error("Upload profile picture😴");
      }
      const docRef = doc(db, "USERS", uid);
      // Updated data prepare:
      const updatedData = {
        name,
        bio,
        ...(emoji && { avatar: emoji }),
      };
      await updateDoc(docRef, updatedData);
      toast.success("Profile updated!");

      // Re-fetch user data:
      const snap = await getDoc(docRef);
      setUserData(snap.data());

      setName("");
      setBio("");
      setEmoji("");

      navigate("/chat");
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    }
  };

  // Fetch userData on auth state change:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "USERS", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists) {
          setName(docSnap.data().name);
          setBio(docSnap.data().bio);
          setEmoji(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe(); // cleanup on unmont
  }, [navigate]);
  // ----------

  return (
    <div className="h-screen w-full bg-slate-300 flex items-center lacquer-font justify-center">
      <div className="w-[70%] h-[85vh] max-sm:block bg-gray-950 text-gray-300 mx-auto rounded-xl grid grid-cols-2 border-2 border-gray-950">
        <form
          onSubmit={profileUpdate}
          className="bg-gray-900 flex flex-col gap-5 px-7 py-7 rounded-tl-lg rounded-bl-xl "
        >
          <h3 className="text-4xl mt-4 mb-7 font-bold underline">
            My Profile Details
          </h3>
          <label
            htmlFor="emojiInput"
            className="mb-7 text-xl cursor-pointer flex gap-0 justify-center items-center"
          >
            <input
              type="text"
              maxLength="2"
              value={emoji}
              pattern="[\p{Emoji}]"
              id="emojiInput"
              className="border-2 mr-3 rounded-full w-20 h-20 text-4xl text-center leading-tight outline-none text-gray-900"
              onChange={(e) => setEmoji(e.target.value)}
            />
            👈🏻 Enter your emoji here
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Your name"
            required
            className="py-2 px-3 rounded-sm border-none outline-none text-gray-900"
          />
          <textarea
            placeholder="Write something about yourself.."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="py-2 px-3 rounded-sm border-none outline-none text-gray-900"
          ></textarea>
          <button
            type="submit"
            className="border-2 py-2 bg-purple-800 hover:border-gray-400 active:translate-y-1 shadow-md duration-200 font-bold text-xl px-7 rounded cursor-pointer transition-all flex items-center gap-2 justify-center"
          >
            Save
          </button>
        </form>
        <div className="relative">
          <img
            src="/profile2.jpg"
            alt=""
            className="h-full w-full absolute z-10 rounded-tr-xl rounded-br-xl object-cover"
          />
          <input
            type="text"
            value={emoji}
            readOnly
            className="absolute z-20 left-1/2 -translate-x-1/2 top-1/2 transform -translate-y-1/2 rounded-full w-60 h-60 object-cover border-4 border-purple-500 bg-gray-900 text-8xl text-center"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
