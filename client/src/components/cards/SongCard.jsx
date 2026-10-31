import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';

export default function SongCard({ song, list = [] }) {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayer();
  const isCurrent = currentSong?._id === song._id;
  const { user, toggleFavorite } = useAuth();
  const isFavorite = user?.favorites?.includes(song._id);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, list.length > 0 ? list : [song]);
    }
  };

  return (
    <div onClick={handlePlayClick} className="min-w-[160px] md:min-w-[180px] w-[160px] md:w-[180px] bg-surface hover:bg-surfaceHover p-4 rounded-xl transition duration-300 cursor-pointer group">
      <div className="relative w-full aspect-square mb-5">
        {/* Use the image URL directly from the database */}
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover rounded-lg shadow-lg" 
        />
                {/* Heart Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(song._id);
          }}
          className={`absolute top-2 right-2 text-lg transition ${isFavorite ? 'text-spotibaiii' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white'}`}
        >
          <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
        <button className={`absolute bottom-2 right-2 w-10 h-10 bg-spotibaiii rounded-full flex items-center justify-center text-black shadow-xl hover:scale-105 transition-all duration-300 
            ${isCurrent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play ml-1'} text-lg`}></i>
        </button>
      </div>
      <h3 className={`font-bold text-sm truncate ${isCurrent ? 'text-spotibaiii' : 'text-white'}`}>{song.title}</h3>
      <p className="text-xs text-gray-400 mt-1 truncate">{song.artist || 'Unknown'}</p>
    </div>
  );
}