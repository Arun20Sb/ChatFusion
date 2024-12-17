import React, { useState } from "react";

// Button component that handles music playback
const RightMusic = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio(audioSrc));

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={handlePlayPause}
      className="border-2 border-gray-500 w-48 py-2 hover:bg-gray-800 shadow-md rounded-sm  transition-all duration-400 active:scale-95 "
    >
      <span>{isPlaying ? "Pause Music 🎶" : "Play Music 🎶"}</span>
    </button>
  );
};

export default RightMusic;
