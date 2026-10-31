import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import SongCard from '../components/cards/SongCard';

export default function SingleArtistPage() {
  const { artistName } = useParams(); 
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistSongs = async () => {
      try {
        const res = await api.get('/songs');
        // Filter songs that match the artist name from the URL
        const artistSongs = res.data.filter(song => song.artist === artistName);
        setSongs(artistSongs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtistSongs(); // <-- THIS WAS THE TYPO. It is now fixed.
  }, [artistName]);

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (songs.length === 0) return <div className="p-10 text-white">Artist not found.</div>;

  // Get the image from the first song, or use a default
  const artistImage = songs[0].coverUrl;

  return (
    <div className="pb-32">
      {/* Artist Header */}
      <div className="relative bg-gradient-to-b from-[#2a2a2a] to-surface pt-20 pb-10 px-6 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6">
        <div className="w-32 h-32 md:w-52 md:h-52 rounded-full shadow-2xl overflow-hidden border border-white/10">
          <img src={artistImage} alt={artistName} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4">
          <span className="text-sm font-bold text-white tracking-widest uppercase mb-2">Artist</span>
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-6">
            {artistName}
          </h1>
          <p className="text-gray-300">{songs.length} Songs</p>
        </div>
      </div>

      {/* Artist Songs */}
      <div className="px-6 md:px-10 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Songs</h2>
        <div className="flex flex-wrap gap-6">
          {songs.map(song => (
            <SongCard key={song._id} song={song} list={songs} />
          ))}
        </div>
      </div>
    </div>
  );
}