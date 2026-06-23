import { Link } from 'react-router-dom';
import { IconPaw, IconPhone, IconMail, IconMapPin, IconCamera, IconThumbUp, IconMessage } from '@tabler/icons-react';

const Footer = () => {
  return (
    <footer className="bg-surface-container-low border-t border-border-light">
      <div className="max-w-container-max mx-auto px-gutter pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <IconPaw className="text-primary text-2xl" fill="currentColor" size={28} />
              <span className="font-hero-display text-h2-section text-on-background">Cat House</span>
            </Link>
            <p className="text-text-muted text-body-small mb-4">
              Pusat perawatan kucing premium untuk sahabat berbulu Anda.
            </p>
          </div>
          <div>
            <p className="font-ui-label text-sm text-text-dark mb-3">Navigasi</p>
            <ul className="space-y-2">
              <li><Link to="/" className="text-text-muted text-body-small hover:text-primary transition-all">Beranda</Link></li>
              <li><Link to="/services" className="text-text-muted text-body-small hover:text-primary transition-all">Layanan</Link></li>
              <li><Link to="/fasilitas" className="text-text-muted text-body-small hover:text-primary transition-all">Fasilitas</Link></li>
              <li><Link to="/gallery" className="text-text-muted text-body-small hover:text-primary transition-all">Galeri</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-ui-label text-sm text-text-dark mb-3">Informasi</p>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-text-muted text-body-small hover:text-primary transition-all">Tentang Kami</Link></li>
              <li><Link to="/contact" className="text-text-muted text-body-small hover:text-primary transition-all">Kontak</Link></li>
              <li><span className="text-text-muted text-body-small cursor-pointer hover:text-primary transition-all">Privacy Policy</span></li>
              <li><span className="text-text-muted text-body-small cursor-pointer hover:text-primary transition-all">Syarat & Ketentuan</span></li>
            </ul>
          </div>
          <div>
            <p className="font-ui-label text-sm text-text-dark mb-3">Kontak</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-text-muted text-body-small">
                <IconPhone size={16} className="text-primary" /> +62 812-3456-7890
              </li>
              <li className="flex items-center gap-2 text-text-muted text-body-small">
                <IconMail size={16} className="text-primary" /> halo@cathouse.id
              </li>
              <li className="flex items-center gap-2 text-text-muted text-body-small">
                <IconMapPin size={16} className="text-primary" /> Bandung, Jawa Barat
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-light pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-body-small text-text-muted">© 2024 Cat House Pet Care. All rights reserved.</p>
          <div className="flex gap-3">
            <button className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all text-text-muted">
              <IconCamera size={16} />
            </button>
            <button className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all text-text-muted">
              <IconThumbUp size={16} />
            </button>
            <button className="w-8 h-8 bg-surface-container rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all text-text-muted">
              <IconMessage size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
