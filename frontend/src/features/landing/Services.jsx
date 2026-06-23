import { Link } from 'react-router-dom';
import {
  IconCircleCheck, IconSparkles, IconStethoscope, IconBuilding,
  IconSchool, IconCamera, IconTruck, IconConfetti
} from '@tabler/icons-react';

const Services = () => {
  const mainServices = [
    {
      icon: IconSparkles, title: 'Grooming Premium', price: 'Mulai Rp 85.000',
      desc: 'Perawatan bulu, mandi, potong kuku, dan ear cleaning oleh groomer berpengalaman bersertifikat.',
      items: ['Mandi & Blow Dry', 'Potong Kuku', 'Ear Cleaning', 'Parfum Khusus Kucing'],
      popular: false,
    },
    {
      icon: IconStethoscope, title: 'Konsultasi Veteriner', price: 'Mulai Rp 120.000',
      desc: 'Konsultasi langsung dengan dokter hewan berpengalaman untuk menjaga kesehatan optimal kucing Anda.',
      items: ['Pemeriksaan Umum', 'Vaksinasi', 'Sterilisasi', 'Konsultasi Nutrisi'],
      popular: true,
    },
    {
      icon: IconBuilding, title: 'Cat Hotel', price: 'Rp 65.000 / malam',
      desc: 'Titipkan kucing kesayangan Anda dengan aman dan nyaman saat bepergian. Dipantau 24 jam.',
      items: ['Kamar Ber-AC', 'Makanan 3x Sehari', 'CCTV 24 Jam', 'Laporan Harian'],
      popular: false,
    },
  ];

  const additionalServices = [
    { icon: IconSchool, name: 'Pelatihan', price: 'Rp 150.000/sesi' },
    { icon: IconCamera, name: 'Foto Profesional', price: 'Rp 200.000/sesi' },
    { icon: IconTruck, name: 'Antar-Jemput', price: 'Rp 50.000/trip' },
    { icon: IconConfetti, name: 'Cat Birthday', price: 'Rp 300.000/paket' },
  ];

  return (
    <section className="max-w-container-max mx-auto px-gutter py-16">
      <div className="text-center mb-14 animate-fade-up">
        <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Apa yang Kami Tawarkan</span>
        <h1 className="font-h2-section text-[48px] text-text-dark mt-2">Layanan Kami</h1>
        <p className="text-text-muted text-body-main mt-3 max-w-xl mx-auto">
          Semua kebutuhan kucing kesayangan Anda tersedia di satu tempat — dari nutrisi terbaik hingga perawatan lengkap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {mainServices.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className={`service-card rounded-3xl p-8 text-center relative overflow-hidden ${
                s.popular
                  ? 'bg-on-secondary-fixed border-2 border-primary'
                  : 'bg-white border border-border-light'
              }`}
            >
              {s.popular && (
                <div className="absolute top-4 right-4 bg-amber-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  Terpopuler
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
                s.popular ? 'bg-white/20' : 'bg-primary-fixed'
              }`}>
                <Icon size={32} className={s.popular ? 'text-white' : 'text-primary'} />
              </div>
              <h3 className={`font-h3-card mb-3 ${s.popular ? 'text-white' : 'text-text-dark'}`}>{s.title}</h3>
              <p className={`text-body-small mb-5 ${s.popular ? 'text-secondary-fixed' : 'text-text-muted'}`}>{s.desc}</p>
              <ul className="text-left space-y-2 mb-6">
                {s.items.map((item, j) => (
                  <li key={j} className={`flex items-center gap-2 text-body-small ${s.popular ? 'text-secondary-fixed' : 'text-text-muted'}`}>
                    <IconCircleCheck size={16} className={s.popular ? 'text-primary-fixed' : 'text-primary'} />
                    {item}
                  </li>
                ))}
              </ul>
              <p className={`font-price-lg mb-4 ${s.popular ? 'text-primary-fixed' : 'text-primary'}`}>{s.price}</p>
              <Link
                to="/register"
                className={`w-full block py-3 rounded-full font-ui-label text-sm transition-all ${
                  s.popular
                    ? 'bg-white text-primary hover:bg-primary-fixed'
                    : 'bg-primary text-white hover:bg-on-primary-container'
                }`}
              >
                {i === 1 ? 'Buat Janji' : 'Pesan Sekarang'}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-container rounded-3xl p-8">
        <h2 className="font-h2-section text-[28px] text-text-dark mb-6">Layanan Tambahan</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {additionalServices.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-border-light">
                <Icon size={24} className="text-primary" />
                <div>
                  <p className="font-ui-label text-sm text-text-dark">{s.name}</p>
                  <p className="text-xs text-text-muted">{s.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
