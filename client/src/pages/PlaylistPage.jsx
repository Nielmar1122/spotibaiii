import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch playlists on load
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const res = await api.get('/playlists');
      setPlaylists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/playlists', { name, description });
      setName('');
      setDescription('');
      setIsModalOpen(false);
      fetchPlaylists(); // Refresh list
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-6 pb-32 relative min-h-full">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Playlists</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-spotibaiii text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition flex items-center gap-2"
        >
          <i className="fa-solid fa-plus"></i> Create Playlist
        </button>
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist._id} className="bg-surface p-4 rounded-xl hover:bg-surfaceHover transition group cursor-pointer">
            <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-lg relative">
              <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotibaiii rounded-full flex items-center justify-center text-black shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <i className="fa-solid fa-play ml-1"></i>
              </button>
            </div>
            <h3 className="font-bold text-white truncate">{playlist.name}</h3>
            <p className="text-xs text-gray-400 mt-1 truncate">{playlist.description || 'No description'}</p>
          </div>
        ))}
      </div>

      {/* MODERN CREATE PLAYLIST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Create Playlist</h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-400 mb-1 block">Playlist Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spotibaiii"
                  placeholder="My Awesome Mix"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-400 mb-1 block">Description (Optional)</label>
                <textarea 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spotibaiii"
                  placeholder="Give your playlist a vibe..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-spotibaiii text-black font-bold py-3 rounded-full mt-2 hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}