import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import AppShell from './components/layout/Appshell';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LyricsPage from './pages/LyricsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminUpload from './pages/admin/AdminUploadSong';
import ProtectedRoute from './components/layout/ProtectedRoute';
import SetupAdmin from './pages/SetupAdmin';
import ArtistsPage from './pages/ArtistsPage';
import SingleArtistPage from './pages/SingleArtistPage';
import SongsPage from './pages/SongsPage';
import PlaylistsPage from './pages/PlaylistPage';
import AlbumsPage from './pages/AlbumPage';
import SingleAlbumPage from './pages/SingleAlbumPage';
import FavoritesPage from './pages/FavoritesPage';
import RecentlyPlayedPage from './pages/RecentlyPlayedPage';


// Temporary placeholder for pages we haven't built yet
const ComingSoon = ({ title }) => (
  <div className="p-10 text-white text-center">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="text-gray-400 mt-2">This page is under construction.</p>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/recent" element={<RecentlyPlayedPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/albums" element={<AlbumsPage />} />
              <Route path="/album/:albumName" element={<SingleAlbumPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/songs" element={<SongsPage />} /> {/* <-- Replace the ComingSoon one with this */}
              <Route path="/artist/:artistName" element={<SingleArtistPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/lyrics" element={<LyricsPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/favorites" element={<ComingSoon title="Your Favorites" />} />
                <Route path="/recent" element={<ComingSoon title="Recently Played" />} />
              </Route>

              <Route element={<ProtectedRoute requireAdmin={true} />}>
                <Route path="/admin" element={<AdminUpload />} />
              </Route>
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/setup" element={<SetupAdmin />} />
          </Routes>
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}