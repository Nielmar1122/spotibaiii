import { useState, useEffect } from 'react';
import api from '../api/axios';
import SongCard from '../components/cards/SongCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!query) {
        setSongs([]);
        return;
      }
      
      setLoading(true);
      try {
        // Send the search term to the backend
        const res = await api.get(`/songs?search=${query}`);
        setSongs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // Add a slight delay so it doesn't search on every single keystroke too fast
    const delay = setTimeout(() => {
      fetchSongs();
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
      
      <input 
        type="text" 
        placeholder="Search songs, artists..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-2xl bg-white/10 border border-white/10 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotibaiii mb-10 text-lg"
      />

      {loading && <p className="text-gray-400">Searching...</p>}

      {!loading && query && songs.length === 0 && (
        <p className="text-gray-400">No results found for "{query}".</p>
      )}

      {!loading && songs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6">Songs & Artists</h2>
          <div className="flex flex-wrap gap-6">
            {songs.map(song => (
              <SongCard key={song._id} song={song} list={songs} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}