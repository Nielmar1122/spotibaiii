import { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import KaraokeLine from '../components/lyrics/KaraokeLine';

export default function LyricsPage() {
  const { currentSong, progress, duration } = usePlayer();

  if (!currentSong) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 mt-20">
        <i className="fa-solid fa-microphone-slash text-6xl text-gray-600 mb-6"></i>
        <h2 className="text-2xl font-bold text-white mb-2">No song playing</h2>
        <p className="text-gray-400">Play a song to view the karaoke lyrics.</p>
      </div>
    );
  }

  const lyrics = currentSong.lyrics || [];
  
  if (lyrics.length === 0) {
    return <div className="p-10 text-center text-gray-400 mt-20">No lyrics uploaded for this song.</div>;
  }

  // Calculate how many seconds each lyric line should display
  const timePerLine = duration > 0 ? duration / lyrics.length : 5;

  // Find which line should be active based on the current progress
  const activeIndex = Math.floor(progress / timePerLine);

  // Background image URL fix
  const imageUrl = currentSong.coverUrl?.startsWith('/uploads') 
    ? `http://localhost:5000${currentSong.coverUrl}` 
    : currentSong.coverUrl;

  return (
    <div className="relative min-h-full pb-32">
      
      {/* Blurred Background */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-40">
        <img src={imageUrl} alt="bg" className="w-full h-full object-cover blur-3xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-base via-base/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Album Art & Info */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left">
          <img 
            src={imageUrl} 
            alt={currentSong.title} 
            className="w-48 h-48 md:w-full md:h-auto aspect-square object-cover rounded-2xl shadow-2xl mb-6"
          />
          <h1 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h1>
          <p className="text-gray-400 text-lg">{currentSong.artist}</p>
          
          <div className="mt-6 flex gap-4">
            <span className="bg-spotibaiii/20 text-spotibaiii px-4 py-1 rounded-full text-xs font-bold border border-spotibaiii/30">
              Auto-Scroll Mode
            </span>
          </div>
        </div>

        {/* Right Side: Lyrics Scroller */}
        <div className="w-full md:w-2/3 h-[65vh] overflow-y-auto scrollbar-hide py-[30vh]">
          <div className="flex flex-col items-start text-left w-full">
            {lyrics.map((line, index) => (
              <KaraokeLine
                key={index}
                text={line.text}
                isActive={index === activeIndex}
                isPast={index < activeIndex}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}