import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import SongCard from '../components/cards/SongCard';

export default function SingleAlbumPage() {
  const { albumName } = useParams();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumSongs = async () => {
      try {
        const res = await api.get('/songs');
        const albumSongs = res.data.filter(song => song.album === albumName);
        setSongs(albumSongs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumSongs();
  }, [albumName]);

  if (loading) return <div className="p-10 text-white">Loading...</div>;
  if (songs.length === 0) return <div className="p-10 text-white">Album not found.</div>;

  return (
    <div className="pb-32">
      <div className="relative bg-gradient-to-b from-[#2a2a2a] to-surface pt-20 pb-10 px-6 md:px-10 flex flex-col md:flex-row items-center md:items-end gap-6">
        <div className="w-48 h-48 md:w-64 md:h-64 shadow-2xl overflow-hidden border border-white/10">
          <img src={songs[0].coverUrl} alt={albumName} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4">
          <span className="text-sm font-bold text-white tracking-widest uppercase mb-2">Album</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            {albumName}
          </h1>
          <p className="text-gray-300 font-semibold">{songs[0].artist} • {songs.length} Songs</p>
        </div>
      </div>

      <div className="px-6 md:px-10 mt-8">
        <h2 className="text-2xl font-bold text-white mb-6">Songs in this Album</h2>
        <div className="flex flex-wrap gap-6">
          {songs.map(song => (
            <SongCard key={song._id} song={song} list={songs} />
          ))}
        </div>
      </div>
    </div>
  );
}