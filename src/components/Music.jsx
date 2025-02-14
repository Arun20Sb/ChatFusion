import { useState, useRef, useEffect } from "react";

const AudioPlayer = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [fileName, setFileName] = useState("");
  const audioRef = useRef(null);

  // Default track URL as fallback
  const defaultTrack = "/music/gataOnly_FloyyMenor.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("durationchange", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("durationchange", updateDuration);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("audio")) {
      const url = URL.createObjectURL(file);
      setAudioFile(url);
      setFileName(file.name);
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="max-w-md mx-auto text-gray-50 rounded-sm shadow-md overflow-hidden md:max-w-2xl m-4">
      <div className="p-6 rounded-md border-t-[1px] border-green-300 pt-5">
        <div className="flex items-center justify-end mb-4 w-full">
          <div className="flex items-center">
            <img
              //   src="https://img.icons8.com/?size=100&id=W1UrWn4kSdmD&format=png&color=000000"
              src="https://img.icons8.com/?size=100&id=zXD2ZcNjhvjW&format=png&color=000000"
              alt="music icon"
              className="w-4 h-4 mr-2"
            />
            <span className="text-sm truncate max-w-[150px]">
              {fileName || "Gata Only"}
            </span>
          </div>
        </div>

        {/* File upload */}
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <img
              src="https://img.icons8.com/?size=100&id=hwKgsZN5Is2H&format=png&color=000000"
              alt="upload icon"
              className="w-4 h-4"
            />
            Upload Audio File
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Audio element */}
        <audio
          ref={audioRef}
          src={audioFile || defaultTrack}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.01"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg appearance-none cursor-pointer"
            style={{
              "--progress-percent": `${(currentTime / duration) * 100 || 0}%`,
              background:
                "linear-gradient(to right, #3b82f6 var(--progress-percent), #e5e7eb var(--progress-percent))",
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="font-medium py-2 px-4 transition duration-200 flex items-center"
          >
            {isPlaying ? (
              <>
                <img
                  src="https://img.icons8.com/?size=100&id=Z2aInWmsldJ6&format=png&color=000000"
                  alt="pause icon"
                  className="h-5 w-5 mr-1"
                />
                Pause
              </>
            ) : (
              <>
                <img
                  src="https://img.icons8.com/?size=100&id=GwYlS5m5Goz6&format=png&color=000000"
                  alt="play icon"
                  className="h-5 w-5 mr-1"
                />
                Play
              </>
            )}
          </button>

          {/* Volume controls */}
          <div className="flex items-center">
            <button
              onClick={toggleMute}
              className="text-gray-600 hover:text-blue-500 transition duration-200"
            >
              {isMuted ? (
                <img
                  src="https://img.icons8.com/?size=100&id=COB0YebrnabU&format=png&color=000000"
                  alt="mute icon"
                  className="h-5 w-7"
                />
              ) : (
                <img
                  src="https://img.icons8.com/?size=100&id=OO5mJh5xVYHX&format=png&color=000000"
                  alt="volume icon"
                  className="h-5 w-7"
                />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 ml-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                "--volume-percent": `${(isMuted ? 0 : volume) * 100}%`,
                background:
                  "linear-gradient(to right, #3b82f6 var(--volume-percent), #e5e7eb var(--volume-percent))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
