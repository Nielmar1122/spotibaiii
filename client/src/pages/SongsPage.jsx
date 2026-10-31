import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import api from '../api/axios';

export default function SongsPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playSong, currentSong, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await api.get('/songs');
        setSongs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  if (loading) return <div className="p-10 text-white">Loading songs...</div>;

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">All Songs</h1>
      
      <div className="flex flex-col gap-2">
        {songs.map((song, index) => {
          const isCurrent = currentSong?._id === song._id;
          
          // Fix image URL
          const imageUrl = song.coverUrl?.startsWith('/uploads') 
            ? `http://localhost:5000${song.coverUrl}` 
            : song.coverUrl;

          return (
            <div 
              key={song._id} 
              onClick={() => playSong(song, songs)}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 cursor-pointer transition group"
            >
              {/* Index / Play Button */}
              <div className="w-8 text-center text-gray-400 font-bold group-hover:hidden">
                {index + 1}
              </div>
              <div className="w-8 hidden group-hover:flex justify-center text-white">
                <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
              </div>

              {/* Cover Image */}
              <img 
                src={imageUrl} 
                alt={song.title} 
                className="w-12 h-12 rounded object-cover shadow-lg" 
              />

              {/* Song Details */}
              <div className="flex flex-col flex-1 truncate">
                <span className={`font-semibold truncate ${isCurrent ? 'text-spotibaiii' : 'text-white'}`}>
                  {song.title}
                </span>
                <span className="text-sm text-gray-400 truncate">
                  {song.artist} {song.album ? `• ${song.album}` : ''}
                </span>
              </div>

              {/* Genre/Time */}
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs">
                  {song.genre || 'Viral'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}