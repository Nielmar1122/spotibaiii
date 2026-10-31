import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/axios';

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [adPending, setAdPending] = useState(false);
  const [adSeenForCurrentSong, setAdSeenForCurrentSong] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  
  // NEW: Repeat State ('off', 'all', or 'one')
  const [repeatMode, setRepeatMode] = useState('off');

  const currentSong = queue[currentIndex] || null;

  useEffect(() => {
    if (!currentSong) return;
    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.load();
    setAdSeenForCurrentSong(false);
    if (isPlaying) audioRef.current.play().catch(e => console.log("Play error:", e));
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong) return;
    if (isPlaying) audioRef.current.play().catch(e => console.log(e));
    else audioRef.current.pause();
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setProgress(audio.currentTime);
      if (audio.duration && !adSeenForCurrentSong && !adPending) {
        if (audio.currentTime >= audio.duration * 0.5) {
          audio.pause();
          setIsPlaying(false);
          setAdPending(true);
        }
      }
    };
    const setAudioData = () => setDuration(audio.duration);
    
    // NEW: Handle what happens when the song ends based on repeat mode
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all') {
        playNext(); // It will loop back to the start automatically due to modulo
      } else {
        // 'off' mode: If it's the last song, stop playing. Otherwise, go next.
        if (currentIndex < queue.length - 1) {
          playNext();
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [adSeenForCurrentSong, adPending, currentIndex, repeatMode, queue.length]);

  const playSong = (song, list = [song]) => {
    setQueue(list);
    const idx = list.findIndex(s => s._id === song._id);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setIsPlaying(true);

    if (localStorage.getItem('spotibaiii_token')) {
      api.post(`/auth/recent/${song._id}`).catch(err => console.log(err));
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleShuffle = () => setIsShuffle(!isShuffle);
  
  // NEW: Cycle through repeat modes
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const playNext = () => { 
    if (queue.length > 1) {
      if (isShuffle) {
        let nextIndex = currentIndex;
        while (nextIndex === currentIndex) {
          nextIndex = Math.floor(Math.random() * queue.length);
        }
        setCurrentIndex(nextIndex);
      } else {
        setCurrentIndex((prev) => (prev + 1) % queue.length); 
      }
    }
  };

  const playPrev = () => { if (queue.length > 1) setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length); };
  const seek = (time) => { audioRef.current.currentTime = time; setProgress(time); };
  const setVolume = (vol) => { audioRef.current.volume = vol; };
  const finishAd = () => { setAdPending(false); setAdSeenForCurrentSong(true); setIsPlaying(true); };

  return (
    <PlayerContext.Provider value={{ 
      currentSong, isPlaying, progress, duration, queue, adPending, 
      playSong, togglePlay, playNext, playPrev, seek, setVolume, finishAd, 
      isShuffle, toggleShuffle, repeatMode, toggleRepeat // Added repeatMode and toggleRepeat
    }}>
      {children}
    </PlayerContext.Provider>
  );
}