import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/songs');
        const allSongs = res.data;

        // Group songs by album
        const albumMap = {};
        allSongs.forEach(song => {
          if (song.album) {
            if (!albumMap[song.album]) {
              albumMap[song.album] = {
                name: song.album,
                artist: song.artist,
                coverUrl: song.coverUrl,
                songCount: 1
              };
            } else {
              albumMap[song.album].songCount += 1;
            }
          }
        });

        setAlbums(Object.values(albumMap));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  if (loading) return <div className="p-10 text-white">Loading albums...</div>;
  if (albums.length === 0) return <div className="p-10 text-white">No albums found. Upload a song with an album name!</div>;

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Albums</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {albums.map((album, index) => (
          <Link to={`/album/${encodeURIComponent(album.name)}`} key={index} className="bg-surface p-4 rounded-xl hover:bg-surfaceHover transition group cursor-pointer">
            <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg shadow-lg">
              <img src={album.coverUrl} alt={album.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            </div>
            <h3 className="font-bold text-white truncate">{album.name}</h3>
            <p className="text-xs text-gray-400 mt-1 truncate">{album.artist} • {album.songCount} songs</p>
          </Link>
        ))}
      </div>
    </div>
  );
}