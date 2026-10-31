import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('spotibaiii_token');
      const savedUser = localStorage.getItem('spotibaiii_user');

      if (token && savedUser && savedUser !== 'undefined') {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (!parsedUser.favorites) parsedUser.favorites = [];
          setUser(parsedUser);
        } catch (error) {
          localStorage.removeItem('spotibaiii_user');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('spotibaiii_token', res.data.token);
      
      const userData = res.data;
      if (!userData.favorites) userData.favorites = [];
      
      localStorage.setItem('spotibaiii_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      console.error("Login Error in Frontend:", err.response?.data || err.message);
      throw err;
    }
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    localStorage.setItem('spotibaiii_token', res.data.token);
    
    const userData = res.data;
    if (!userData.favorites) userData.favorites = [];
    
    localStorage.setItem('spotibaiii_user', JSON.stringify(userData));
    setUser(userData);
  };

  const updateAvatar = async (file) => {
    if (!user) return;
    
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.put('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = { ...user, avatar: res.data.avatar };
      setUser(updatedUser);
      localStorage.setItem('spotibaiii_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Failed to upload avatar", err);
    }
  };

  const logout = () => {
    localStorage.removeItem('spotibaiii_token');
    localStorage.removeItem('spotibaiii_user');
    setUser(null);
    window.location.reload();
  };

  const toggleFavorite = async (songId) => {
    if (!user) {
      alert("Please log in to favorite songs!");
      return;
    }

    const currentFavorites = user.favorites || [];
    const isFavorite = currentFavorites.includes(songId);

    try {
      if (isFavorite) {
        await api.delete(`/auth/favorites/${songId}`);
      } else {
        await api.post(`/auth/favorites/${songId}`);
      }
      
      const updatedFavorites = isFavorite
        ? currentFavorites.filter(id => id !== songId)
        : [...currentFavorites, songId];
        
      const updatedUser = { ...user, favorites: updatedFavorites };
      setUser(updatedUser);
      localStorage.setItem('spotibaiii_user', JSON.stringify(updatedUser));
      
    } catch (err) {
      console.error("Failed to toggle favorite", err);
    }
  };

  return (
    // ADDED updateAvatar TO THE VALUE OBJECT
    <AuthContext.Provider value={{ user, login, register, logout, toggleFavorite, updateAvatar, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}