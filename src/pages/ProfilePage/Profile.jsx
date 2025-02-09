import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContextProvider";
import { User, SmilePlus, FileText, Loader, Save } from "lucide-react";

function Profile() {
  const [formData, setFormData] = useState({ name: "", emoji: "", bio: "" });
  const [loading, setLoading] = useState(false);

  const { userData, setUserData } = useContext(AppContext); 
  const navigate = useNavigate();

  // Pre-fill form data from context
  useState(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        bio: userData.bio || "",
        emoji: userData.avatar || "",
      });
    }
  }, [userData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "emoji" && value.length > 2) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile
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
        setUserData(snap.data()); // Update context
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6" /> Profile Settings
        </h1>

        <form onSubmit={profileUpdate} className="space-y-6">
          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <SmilePlus className="w-4 h-4" /> Profile Emoji
            </label>
            <input
              type="text"
              name="emoji"
              maxLength="2"
              value={formData.emoji}
              onChange={handleInputChange}
              className="w-full text-center text-2xl h-14 border rounded-lg"
              placeholder="😊"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Write something about yourself..."
              required
              className="w-full px-4 py-2 border rounded-lg h-32 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
              flex items-center justify-center gap-2`}
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Button to go to chat */}
        <button
          onClick={() => navigate("/chat")}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-all"
        >
          Go to Chat Section
        </button>
      </div>
    </div>
  );
}

export default Profile;
