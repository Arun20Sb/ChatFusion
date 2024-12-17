import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContextProvider";

function Profile() {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");

  const { setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const profileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!emoji) {
        toast.error("Upload profile picture😴");
        return;
      }
      const docRef = doc(db, "USERS", uid);
      if (emoji) {
        await updateDoc(docRef, {
          avatar: emoji,
          bio: bio,
          name: name,
        });
      }
      toast.success("Profile updated!");

      // Update local user data immediately:
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate("/chat"); 
      setName("");
      setBio("");
      setEmoji("");
    } catch (error) {
      console.error(error);
      toast.error(`Error updating profile: ${error.message}`);
    }
  };

  // Fetch userData on auth state change:
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const docRef = doc(db, "USERS", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }
        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }
        if (docSnap.data().avatar) {
          setEmoji(docSnap.data().avatar);
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe(); // cleanup on unmont
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
              onChange={(e) => setEmoji(e.target.value)}
              value={emoji}
              pattern="[\p{Emoji}]"
              id="emojiInput"
              className="border-2 mr-3 rounded-full w-20 h-20 text-4xl text-center leading-tight outline-none text-gray-900"
            />
            👈🏻 Enter your emoji here
          </label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter Your name"
            required
            className="py-2 px-3 rounded-sm border-none outline-none text-gray-900"
          />
          <textarea
            placeholder="Write something about yourself.."
            onChange={(e) => setBio(e.target.value)}
            value={bio}
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
