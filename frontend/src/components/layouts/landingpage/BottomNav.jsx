import { NavLink } from 'react-router-dom';
import {
  IconHome,
  IconBriefcase,
  IconPhoto,
  IconInfoCircle,
  IconMail,
} from '@tabler/icons-react';

const bottomNavItems = [
  { to: '/', label: 'Beranda', icon: IconHome },
  { to: '/services', label: 'Layanan', icon: IconBriefcase },
  { to: '/gallery', label: 'Galeri', icon: IconPhoto },
  { to: '/about', label: 'Tentang', icon: IconInfoCircle },
  { to: '/contact', label: 'Kontak', icon: IconMail },
];

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-t border-border-light px-2">
      <div className="flex items-center justify-around">
        {bottomNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 py-2 px-3 min-w-0 transition-colors duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-text-muted hover:text-primary'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px] leading-tight font-ui-label whitespace-nowrap">
              {label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
