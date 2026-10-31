import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [easterEgg, setEasterEgg] = useState(null);
  const lastKeystroke = useRef(0);
  const easterTimeout = useRef(null);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const now = Date.now();
    const timeDiff = now - lastKeystroke.current;
    clearTimeout(easterTimeout.current);

    if (val.length > 0) {
      if (timeDiff > 0 && timeDiff < 100) setEasterEgg('fast');
      else if (timeDiff > 700) setEasterEgg('slow');
      easterTimeout.current = setTimeout(() => setEasterEgg(null), 2500);
    } else {
      setEasterEgg(null);
    }
    lastKeystroke.current = now;
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-surface/80 backdrop-blur-md sticky top-0 z-30">
      <div className="md:hidden flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-white">Spoti<span className="text-spotibaiii">baiii</span></span>
      </div>
      <div className="relative w-full max-w-md mx-auto md:mx-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          
        </div>
        
      </div>
      <div className="hidden md:flex items-center gap-4">
        {user?.role === 'admin' && <span className="text-xs font-bold bg-spotibaiii/20 text-spotibaiii px-3 py-1 rounded-full border border-spotibaiii/30">Admin Mode</span>}
      </div>
    </header>
  );
}