import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SetupAdmin() {
  const [status, setStatus] = useState('Creating Admin Account...');
  const navigate = useNavigate();

  useEffect(() => {
    const createAdmin = async () => {
      try {
        // Call the secret backend route we created
        const res = await axios.get('http://localhost:5000/api/auth/create-admin-secret');
        setStatus(res.data.message);

        // Now log them in using the frontend AuthContext logic
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
          email: 'admin@spotibaiii.com',
          password: 'password123'
        });

        localStorage.setItem('spotibaiii_token', loginRes.data.token);
        localStorage.setItem('spotibaiii_user', JSON.stringify(loginRes.data.user));

        setStatus('Success! Redirecting to app...');
        
        // Refresh the page to apply the login state
        setTimeout(() => {
          window.location.replace = '/';
          window.location.reload(); // Ensure the app state is updated
        }, 1500);

      } catch (err) {
        setStatus('Error: ' + (err.response?.data?.message || err.message));
      }
    };

    createAdmin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base text-white">
      <div className="text-center bg-surface p-10 rounded-xl border border-white/10">
        <h1 className="text-2xl font-bold mb-4">Spotibaiii Admin Setup</h1>
        <p className="text-spotibaiii">{status}</p>
      </div>
    </div>
  );
}