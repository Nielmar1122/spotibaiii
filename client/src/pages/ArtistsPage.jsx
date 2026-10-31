import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import api from '../api/axios';

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get('/songs');
        const allSongs = res.data;
        const uniqueArtistsMap = {};

        allSongs.forEach(song => {
          if (song.artist && !uniqueArtistsMap[song.artist]) {
            uniqueArtistsMap[song.artist] = song.coverUrl;
          }
        });

        const uniqueArtistsArray = Object.keys(uniqueArtistsMap).map(name => ({
          name: name,
          image: uniqueArtistsMap[name]
        }));

        setArtists(uniqueArtistsArray);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-3xl font-bold text-white mb-6">Artists</h1>
      
      <div className="flex flex-wrap gap-6">
        {artists.map((artist, index) => (
          // WRAP THE CARD IN A LINK to the artist's name
          <Link 
            to={`/artist/${encodeURIComponent(artist.name)}`} 
            key={index} 
            className="flex flex-col items-center gap-2 cursor-pointer group min-w-[120px]"
          >
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg bg-surface group-hover:ring-2 group-hover:ring-spotibaiii transition-all">
              <img 
                src={artist.image} 
                alt={artist.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-semibold text-sm text-white mt-1 group-hover:underline">{artist.name}</span>
            <span className="text-xs text-gray-400 -mt-1">Artist</span>
          </Link>
        ))}
      </div>
    </div>
  );
}