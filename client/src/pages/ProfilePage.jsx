import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import SongCard from '../components/cards/SongCard';

export default function ProfilePage() {
  const { user, updateAvatar, logout } = useAuth(); // Added logout here
  const [userSongs, setUserSongs] = useState([]);
  const [uniqueArtists, setUniqueArtists] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const res = await api.get('/songs');
        const allSongs = res.data;

        setUserSongs(allSongs.slice(0, 5));

        const artistsMap = {};
        allSongs.forEach(song => {
          if (song.artist && !artistsMap[song.artist]) {
            artistsMap[song.artist] = song.coverUrl;
          }
        });
        
        const artistsArray = Object.keys(artistsMap).map(name => ({
          name: name,
          image: artistsMap[name]
        }));
        
        setUniqueArtists(artistsArray.slice(0, 4));

      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user) {
    return <div className="p-10 text-white text-center">Please log in to view your profile.</div>;
  }

  const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="pb-32">
      
      {/* HEADER SECTION */}
      <div className="relative bg-gradient-to-b from-[#2a2a2a] to-surface pt-20 pb-10 px-6 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          id="avatar-upload" 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => {
            if (e.target.files[0]) updateAvatar(e.target.files[0]);
          }}
        />

        {/* Clickable Avatar */}
        <label 
          htmlFor="avatar-upload"
          className="w-32 h-32 md:w-52 md:h-52 rounded-full bg-black/50 shadow-2xl flex items-center justify-center border border-white/10 cursor-pointer overflow-hidden group relative"
        >
          {user.avatar ? (
            <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl md:text-8xl font-bold text-spotibaiii">{initial}</span>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="fa-solid fa-camera text-3xl text-white mb-2"></i>
            <span className="text-xs text-white font-bold">Change Picture</span>
          </div>
        </label>

        {/* User Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4">
          <span className="text-sm font-bold text-white tracking-widest uppercase mb-2">Profile</span>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-4">
            {user.username}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-300 font-medium">
            <span>{user.favorites?.length || 0} Favorite Songs</span>
            <span>•</span>
            <span>{user.role === 'admin' ? 'Admin Account' : 'Free Account'}</span>
            <span>•</span>
            
            {/* THE NEW LOGOUT BUTTON */}
            <button 
              onClick={logout} 
              className="text-red-400 hover:text-red-300 hover:underline transition font-bold"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="px-6 md:px-10 mt-8">
        
        {/* Top Artists */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-1">Artists in your library</h2>
          <p className="text-sm text-gray-400 mb-6">Extracted from uploaded songs</p>
          
          {uniqueArtists.length === 0 ? (
            <p className="text-gray-500 text-sm">Upload songs to see artists here.</p>
          ) : (
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
              {uniqueArtists.map((artist, index) => (
                <Link 
                  to={`/artist/${encodeURIComponent(artist.name)}`} 
                  key={index} 
                  className="flex flex-col items-center gap-3 min-w-[140px] md:min-w-[160px] cursor-pointer group"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-lg group-hover:ring-2 group-hover:ring-spotibaiii transition-all">
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center mt-2">
                    <h3 className="font-bold text-white text-sm group-hover:underline">{artist.name}</h3>
                    <p className="text-xs text-gray-400">Artist</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recently Uploaded Songs */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Recently Uploaded Songs</h2>
          
          {userSongs.length === 0 ? (
             <p className="text-gray-500 text-sm">No songs in the database yet.</p>
          ) : (
            <div className="flex flex-wrap gap-6">
              {userSongs.map(song => (
                <SongCard key={song._id} song={song} list={userSongs} />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}