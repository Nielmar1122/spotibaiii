import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // This calls the backend to create the user
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account.');
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4 py-10">
      <div className="max-w-md w-full bg-surface p-8 rounded-2xl shadow-2xl border border-white/10">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-spotibaiii rounded-full flex items-center justify-center text-black mb-4 shadow-[0_0_15px_rgba(29,185,84,0.5)]">
            <i className="fa-solid fa-music text-2xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-white text-center">Sign up to start listening</h2>
        </div>

        {error && <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-400 mb-1 block">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spotibaiii"
              placeholder="bisayagamer123"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 mb-1 block">Email address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spotibaiii"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-400 mb-1 block">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spotibaiii"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-spotibaiii text-black font-bold py-3 rounded-full mt-4 hover:scale-[1.02] transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account? <Link to="/login" className="text-white hover:underline font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}