import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContextProvider.jsx";
import { User, SmilePlus, FileText, Loader, Save } from "lucide-react";

function Profile() {
  const [formData, setFormData] = useState({ name: "", emoji: "", bio: "" });
  const [loading, setLoading] = useState(false);

  const { userData, setUserData, UserChatData } = useContext(AppContext);
  const navigate = useNavigate();

  useState(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        bio: userData.bio || "",
        emoji: userData.avatar || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "emoji" && value.length > 2) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const profileUpdate = async (e) => {
    e.preventDefault();
    if (!formData.emoji.trim()) {
      toast.error("Please set a profile emoji!");
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "USERS", userData.id);
      await updateDoc(docRef, {
        avatar: formData.emoji,
        bio: formData.bio,
        name: formData.name,
      });

      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setUserData(snap.data());
        toast.success("Profile updated successfully!");
        navigate("/chat");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row max-md:flex-col items-start w-full min-h-screen p-10 relative justify-evenly pt-24 z-10 bg-gray-950 text-gray-50">
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
      {/* Your Details */}
      <div className="w-full md:max-w-2xl">
        <h1 className="text-4xl font-bold text-white drop-shadow-md">
          Profile Settings
        </h1>

        <div className="w-full shadow-lg rounded-2xl p-8 mt-6">
          <form onSubmit={profileUpdate} className="space-y-7">
            <div>
              <label className="text-[17px] font-medium flex items-center gap-2 text-gray-200 pb-2">
                <SmilePlus className="w-5 h-5 text-blue-400" /> Profile Emoji
              </label>
              <input
                type="text"
                name="emoji"
                maxLength="2"
                value={formData.emoji}
                onChange={handleInputChange}
                className="w-full text-center text-3xl h-16 border rounded-xl bg-gray-800 text-gray-50 shadow-md"
                placeholder="😊"
              />
            </div>

            <div>
              <label className="text-[17px] font-medium flex items-center gap-2 text-gray-200 pb-2">
                <User className="w-5 h-5 text-green-400" /> Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                required
                className="w-full px-4 py-3 border rounded-xl bg-gray-800 text-gray-50 shadow-md"
              />
            </div>

            <div>
              <label className="text-[17px] font-medium flex items-center gap-2 text-gray-200 pb-2">
                <FileText className="w-5 h-5 text-yellow-400" /> Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write something about yourself..."
                required
                className="w-full px-4 py-3 border rounded-xl h-32 resize-none bg-gray-800 text-gray-50 shadow-md"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-fit bg-blue-600 text-white py-3 px-4 rounded-xl font-medium
                ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700 hover:scale-105 transition-all"
                }
                flex items-center justify-center gap-2 shadow-md`}
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      {/* Friend's List */}
      <div className="max-md:pt-16 pb-5">
        <h1 className="text-4xl font-bold pb-2 text-white drop-shadow-md mb-4">
          Your Friends
        </h1>
        <div className="w-full shadow-lg rounded-2xl p-8 space-y-6">
          {UserChatData?.map((friend, index) => (
            <div
              key={index}
              className="flex items-center justify-evenly gap-3 py-3 px-8 bg-gray-800 hover:bg-gray-700 cursor-pointer rounded-lg transition-colors shadow-md"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-2xl text-white">
                {friend.userData.avatar || "✨"}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white">
                  {friend.userData.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {friend.userData.email || "No Email Available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
