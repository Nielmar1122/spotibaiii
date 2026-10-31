import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import SongCard from '../components/cards/SongCard';

export default function RecentlyPlayedPage() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!user) return;
      try {
        const res = await api.get('/auth/recent');
        // Extract just the song object from the history array
        const songList = res.data.map(item => item.song);
        setSongs(songList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [user]);

  if (!user) return <div className="p-10 text-white">Please log in to see your history.</div>;

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Recently Played</h1>
      
      {loading ? (
        <p className="text-gray-400">Loading history...</p>
      ) : songs.length === 0 ? (
        <p className="text-gray-400">You haven't played any songs yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {songs.map(song => (
            <SongCard key={song._id} song={song} list={songs} />
          ))}
        </div>
      )}
    </div>
  );
}