import { useNavigate } from 'react-router-dom';
import { IconMenu2, IconLogout, IconSearch, IconBell } from '@tabler/icons-react';
import { getAuthState } from '../../../hooks/useAuth';
import { useLogout } from '../../../hooks/useLogout';
import { ROLE_PROFILE } from '../../../constants/routes';

const Navbar = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, roles } = getAuthState();
  const handleLogout = useLogout();

  const profilePath = ROLE_PROFILE[roles[0]] || '/customer/profile';

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 bg-white border-b border-border-light flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
      {/* Left side - Mobile menu + Title */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="lg:hidden text-text-dark hover:text-primary p-2 hover:bg-primary-fixed rounded-lg transition"
        >
          <IconMenu2 size={20} />
        </button>

        <h2 className="font-h3-card text-lg text-text-dark">
          Dashboard Overview
        </h2>
      </div>

      {/* Right side - Search, Notifications, Profile, Logout */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            className="bg-surface border border-border-light rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface transition-all relative">
          <IconBell size={20} className="text-text-muted" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-border-light"></div>

        {/* User Avatar */}
        <button onClick={() => navigate(profilePath)} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary-fixed-dim flex items-center justify-center font-bold text-on-primary-fixed text-sm">
            {initials}
          </div>
          <span className="hidden sm:block text-sm text-text-muted group-hover:text-text-dark transition-colors">
            {user?.name?.split(' ')[0] || 'User'}
          </span>
        </button>

        <div className="h-8 w-[1px] bg-border-light"></div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border border-border-light rounded-lg px-3 py-1.5 text-text-muted text-sm hover:bg-error-container hover:text-on-error-container hover:border-error-container transition-all"
        >
          <IconLogout size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
