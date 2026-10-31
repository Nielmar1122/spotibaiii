import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: 'fa-house' },
    { name: 'Search', path: '/search', icon: 'fa-magnifying-glass' },
    { name: 'Songs', path: '/songs', icon: 'fa-music' },
    { name: 'Artists', path: '/artists', icon: 'fa-users' },
    { name: 'Albums', path: '/albums', icon: 'fa-record-vinyl' },
    { name: 'Playlists', path: '/playlists', icon: 'fa-list' },
  ];

  const linkClass = ({ isActive }) => 
    `flex items-center gap-4 px-4 py-3 mx-2 rounded-lg font-semibold transition-all ${
      isActive 
        ? 'text-spotibaiii bg-spotibaiii/10' 
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] py-4 pb-28 border-r border-white/5">
      
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-3 px-6 mb-8 group">
        <img 
          src="/logo.png" 
          alt="Spotibaiii Logo" 
          className="w-10 h-10 object-cover rounded-full group-hover:scale-105 transition" 
        />
        <span className="text-2xl font-extrabold tracking-tight text-white">
          Spoti<span className="text-spotibaiii">baiii</span>
        </span>
      </NavLink>

      {/* Main Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} className={linkClass}>
            <i className={`fa-solid ${item.icon} text-lg w-6 text-center`}></i>
            <span className="text-[15px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Navigation */}
      <nav className="flex flex-col gap-1 mb-6">
        {user && (
          <>
            <NavLink to="/favorites" className={linkClass}>
              <i className="fa-solid fa-heart text-lg w-6 text-center"></i>
              <span className="text-[15px]">Favorites</span>
            </NavLink>
            <NavLink to="/recent" className={linkClass}>
              <i className="fa-solid fa-clock-rotate-left text-lg w-6 text-center"></i>
              <span className="text-[15px]">Recently Played</span>
            </NavLink>
          </>
        )}

        {/* 
          THIS IS WHERE THE CODE GOES!
          It replaces the old Profile NavLink.
        */}
        <NavLink to="/profile" className={linkClass}>
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover" 
            />
          ) : (
            <i className="fa-solid fa-circle-user text-lg w-6 text-center"></i>
          )}
          <span className="text-[15px]">{user ? user.username : 'Profile'}</span>
        </NavLink>


      </nav>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <div className="mt-auto border-t border-white/5 pt-4">
          <NavLink to="/admin" className={linkClass}>
            <i className="fa-solid fa-cloud-arrow-up text-lg w-6 text-center"></i>
            <span className="text-[15px]">Admin Upload</span>
          </NavLink>
        </div>
      )}

    </div>
  );
}