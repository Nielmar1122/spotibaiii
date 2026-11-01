import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) => 
    `flex flex-col items-center justify-center w-full h-full text-xs font-semibold gap-1 transition ${
      isActive ? 'text-spotibaiii' : 'text-gray-400 hover:text-white'
    }`;

  return (
    // Hidden on desktop (md:hidden), fixed to bottom on mobile
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a] border-t border-white/10 z-50 flex items-center justify-around pb-safe">
      
      <NavLink to="/" className={linkClass}>
        <i className="fa-solid fa-house text-lg"></i>
        <span>Home</span>
      </NavLink>

      <NavLink to="/search" className={linkClass}>
        <i className="fa-solid fa-magnifying-glass text-lg"></i>
        <span>Search</span>
      </NavLink>

      <NavLink to="/songs" className={linkClass}>
        <i className="fa-solid fa-music text-lg"></i>
        <span>Songs</span>
      </NavLink>

      <NavLink to="/profile" className={linkClass}>
        {user?.avatar ? (
          <img src={user.avatar} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
        ) : (
          <i className="fa-solid fa-circle-user text-lg"></i>
        )}
        <span>{user ? 'Profile' : 'Log In'}</span>
      </NavLink>

    </div>
  );
}