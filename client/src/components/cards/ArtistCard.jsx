import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  return (
    <Link to={`/artist/${artist._id}`} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[120px]">
      <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg group-hover:ring-2 group-hover:ring-spotibaiii transition-all">
        <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
      </div>
      <span className="font-semibold text-sm text-white mt-1 group-hover:underline">{artist.name}</span>
      <span className="text-xs text-gray-400 -mt-1">Artist</span>
    </Link>
  );
}