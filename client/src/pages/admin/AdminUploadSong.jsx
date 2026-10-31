import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function AdminUpload() {
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState(''); // NEW
  const [genre, setGenre] = useState(''); // NEW
  const [coverFile, setCoverFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [lyricsText, setLyricsText] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    formData.append('genre', genre);
    formData.append('lyricsText', lyricsText);
    
    if (coverFile) formData.append('cover', coverFile);
    if (audioFile) formData.append('audio', audioFile);

    try {
      await api.post('/songs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Song uploaded successfully!');
      setTitle(''); setArtist(''); setAlbum(''); setGenre('');
      setCoverFile(null); setAudioFile(null); setLyricsText('');
      
      document.getElementById('cover-input').value = '';
      document.getElementById('audio-input').value = '';
      
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to upload song.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto pb-32">
      <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
      
      {message && (
        <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-spotibaiii/20 text-spotibaiii' : 'bg-red-500/20 text-red-400'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface p-6 rounded-xl border border-white/10 flex flex-col gap-5">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Song Title</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-spotibaiii" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Artist Name</label>
            <input required type="text" value={artist} onChange={e => setArtist(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-spotibaiii" />
          </div>
        </div>

        {/* NEW ALBUM AND GENRE INPUTS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Album Name</label>
            <input type="text" value={album} onChange={e => setAlbum(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-spotibaiii" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Genre</label>
            <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-spotibaiii" placeholder="e.g. Viral, Hugot, Karaoke" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400">Upload Album Cover (Image)</label>
            <input id="cover-input" required type="file" accept="image/*" onChange={e => setCoverFile(e.target.files[0])} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-spotibaiii file:text-black hover:file:bg-green-400 cursor-pointer" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Upload Music File (MP3)</label>
            <input id="audio-input" required type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files[0])} className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-spotibaiii file:text-black hover:file:bg-green-400 cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400">Karaoke Lyrics (Format: Seconds|Text)</label>
          <textarea rows="4" value={lyricsText} onChange={e => setLyricsText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-spotibaiii" placeholder="0|🎵 (Instrumental) 🎵&#10;5|Kung ikaw ang akong...&#10;10|Palawan Pawnshop, remix!" />
        </div>

        <button type="submit" disabled={loading} className="bg-spotibaiii text-black font-bold py-3 rounded mt-2 hover:scale-[1.01] transition disabled:opacity-50">
          {loading ? 'Uploading...' : 'Upload Song'}
        </button>
      </form>
    </div>
  );
}