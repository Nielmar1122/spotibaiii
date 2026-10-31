import { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/cards/SongCard';
import api from '../api/axios';

export default function HomePage() {
  const { playSong } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real songs from the database
    const fetchSongs = async () => {
      try {
        const res = await api.get('/songs');
        setSongs(res.data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className="pb-10">
      <div className="mx-6 mt-4 mb-10 rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-base p-8 md:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <span className="bg-spotibaiii text-black text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">Trending Now</span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 text-white">Ang soundtracks sang mga bisaya.</h1>
          <p className="mb-6 text-sm md:text-base" style={{ color: '#ffffff', fontWeight: '500' }}> Stream the funniest Bisaya memes, TikTok viral hits.
</p>
          <button onClick={() => songs.length > 0 && playSong(songs[0], songs)} className="bg-spotibaiii text-black font-bold px-6 md:px-8 py-2 md:py-3 rounded-full hover:scale-105 transition flex items-center gap-2 text-sm md:text-base">
            <i className="fa-solid fa-play"></i> Play Viral Hits
          </button>
        </div>
      </div>
      
      <section className="mx-6">
        <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">Viral Songs</h2>
        {loading ? (
          <p className="text-gray-400">Loading songs...</p>
        ) : songs.length === 0 ? (
          <p className="text-gray-400">No songs in the database yet. Upload some as an Admin!</p>
        ) : (
          <div className="flex flex-wrap gap-6">
            {songs.map(song => <SongCard key={song._id} song={song} list={songs} />)}
          </div>
        )}
      </section>
    </div>
  );
}