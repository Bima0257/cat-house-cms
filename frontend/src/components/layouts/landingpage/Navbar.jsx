import { Link, NavLink } from 'react-router-dom';
import {
  IconPaw,
  IconLogin,
  IconUserPlus,
} from '@tabler/icons-react';

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/services', label: 'Layanan' },
  { to: '/fasilitas', label: 'Fasilitas' },
  { to: '/gallery', label: 'Galeri' },
  { to: '/about', label: 'Tentang Kami' },
  { to: '/contact', label: 'Kontak' },
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-border-light">
      <div className="max-w-container-max mx-auto px-gutter py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <IconPaw className="text-primary text-3xl" size={32} fill="currentColor" />
          <span className="font-hero-display text-h3-card text-primary">Cat House</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link font-ui-label text-ui-label transition-colors duration-200 ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-text-dark hover:text-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="flex items-center gap-1.5 border border-primary text-primary px-3 py-1.5 md:px-5 md:py-2 rounded-full font-ui-label text-ui-label hover:bg-primary hover:text-white transition-all duration-200"
          >
            <IconLogin size={16} /> Masuk
          </Link>
          <Link
            to="/register"
            className="hidden md:flex bg-primary hover:bg-on-primary-container text-on-primary px-5 py-2 rounded-full font-ui-label text-ui-label transition-all duration-200 items-center gap-1.5"
          >
            <IconUserPlus size={16} /> Daftar
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
