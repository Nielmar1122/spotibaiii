import { usePlayer } from "../../context/PlayerContext";
import { formatTime } from "../../utils/formatTime";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PlayerBar() {
  const [isHovered, setIsHovered] = useState(false);
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    playNext,
    playPrev,
    seek,
    setVolume,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = usePlayer();

  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [volume, setVolumeState] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const volumeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolume(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!currentSong) return null;

  const isFavorite = user?.favorites?.includes(currentSong._id);

  const imageUrl = currentSong.coverUrl?.startsWith("/uploads")
    ? `http://localhost:5000${currentSong.coverUrl}`
    : currentSong.coverUrl ||
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400";

  // Logic to determine if the bar should be visible
  const isVisible = isPlaying || isHovered;

  return (
    // Invisible hover zone at the bottom of the screen
    <div
      className="fixed bottom-0 left-0 right-0 z-50 h-24 flex items-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-full glass px-4 py-3 md:px-6 transition-transform duration-500 ease-in-out pb-20 md:pb-3 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Responsive Layout */}
        <div className="max-w-[1600px] mx-auto flex flex-col md:grid md:grid-cols-3 items-center gap-4 md:gap-2">
          {/* LEFT: Song Info */}
          <div className="flex items-center justify-between w-full md:justify-start gap-3">
            <div className="flex items-center gap-3">
              <img
                src={imageUrl}
                alt="cover"
                className="w-12 h-12 md:w-14 md:h-14 rounded-md shadow-lg object-cover"
              />
              <div className="flex flex-col overflow-hidden max-w-[150px] md:max-w-[200px]">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">
                    {currentSong.title}
                  </span>
                  {user && (
                    <button
                      onClick={() => toggleFavorite(currentSong._id)}
                      className={`transition ${isFavorite ? "text-spotibaiii" : "text-gray-400 hover:text-white"}`}
                    >
                      <i
                        className={`${isFavorite ? "fa-solid" : "fa-regular"} fa-heart text-xs`}
                      ></i>
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-400 truncate">
                  {currentSong.artist || "Unknown Artist"}
                </span>
              </div>
            </div>

            {/* Mobile Mic Button */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => navigate("/lyrics")}
                className="text-gray-400 hover:text-white"
              >
                <i className="fa-solid fa-microphone-lines"></i>
              </button>
            </div>
          </div>

          {/* CENTER: Player Controls */}
          <div className="flex flex-col items-center justify-center w-full max-w-[500px] mx-auto">
            <div className="flex items-center gap-4 md:gap-6 mb-1 md:mb-2">
              <button
                onClick={toggleShuffle}
                className={`hidden md:block transition ${isShuffle ? "text-spotibaiii" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fa-solid fa-shuffle text-sm"></i>
              </button>

              <button
                onClick={playPrev}
                className="text-gray-400 hover:text-white transition"
              >
                <i className="fa-solid fa-backward-step text-lg"></i>
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                <i
                  className={`fa-solid ${isPlaying ? "fa-pause" : "fa-play ml-1"} text-lg`}
                ></i>
              </button>

              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition"
              >
                <i className="fa-solid fa-forward-step text-lg"></i>
              </button>

              <button
                onClick={toggleRepeat}
                className={`hidden md:block transition relative ${repeatMode !== "off" ? "text-spotibaiii" : "text-gray-400 hover:text-white"}`}
              >
                <i className="fa-solid fa-repeat text-sm"></i>
                {repeatMode === "one" && (
                  <span className="absolute -top-1 -right-2 text-[9px] font-bold bg-spotibaiii text-black w-3 h-3 rounded-full flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full mt-1 md:mt-0">
              <span className="text-[10px] md:text-[11px] text-gray-400 font-medium w-8 md:w-10 text-right">
                {formatTime(progress)}
              </span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1 h-1 md:h-1.5 rounded-full appearance-none cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right, #fffefe ${(progress / duration) * 100}%, #3a4047 ${(progress / duration) * 100}%)`,
                }}
              />
              <span className="text-[10px] md:text-[11px] text-gray-400 font-medium w-8 md:w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: Volume & Extra Controls */}
          <div className="hidden md:flex items-center justify-end gap-4 w-full">
            <button
              onClick={() => {
                setShowVolume(false);
                location.pathname === "/lyrics"
                  ? navigate(-1)
                  : navigate("/lyrics");
              }}
              className="text-gray-400 hover:text-spotibaiii transition"
            >
              <i className="fa-solid fa-microphone-lines text-lg"></i>
            </button>

            <div
              className="relative flex items-center justify-center"
              ref={volumeRef}
            >
              <button onClick={() => setShowVolume(!showVolume)}>
                <i
                  className={`fa-solid ${volume === 0 ? "fa-volume-xmark" : "fa-volume-high"} text-gray-400 hover:text-white transition cursor-pointer text-lg`}
                ></i>
              </button>

              {showVolume && (
                <div className="absolute bottom-full mb-3 flex flex-col items-center justify-between bg-[#181818] border border-white/10 p-3 rounded-xl shadow-2xl w-14 h-44 z-50">
                  <span className="text-[12px] text-gray-300 font-bold">
                    {Math.round(volume * 100)}
                  </span>
                  <div className="flex-1 flex items-center justify-center w-full relative py-2">
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={volume}
                      onChange={(e) => {
                        setVolumeState(Number(e.target.value));
                        setVolume(Number(e.target.value));
                      }}
                      className="w-28 h-1.5 rounded-full appearance-none cursor-pointer outline-none absolute -rotate-90"
                      style={{
                        background: `linear-gradient(to right, #1DB954 ${volume * 100}%, #3a4047 ${volume * 100}%)`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
