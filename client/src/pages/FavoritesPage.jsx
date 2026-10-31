import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import SongCard from '../components/cards/SongCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // This effect runs every time the user state changes (i.e., when you click a heart)
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        // Fetch the populated favorite songs from the backend
        const res = await api.get('/auth/favorites');
        setSongs(res.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]); // <-- The [user] dependency is the magic part!

  if (!user) {
    return <div className="p-10 text-white">Please log in to see your favorites.</div>;
  }

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Your Favorites</h1>
      
      {loading ? (
        <p className="text-gray-400">Loading your favorite songs...</p>
      ) : songs.length === 0 ? (
        <p className="text-gray-400">You haven't added any songs to your favorites yet.</p>
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