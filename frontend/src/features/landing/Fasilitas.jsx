import { IconSparkles, IconBuilding, IconStethoscope, IconShoppingCart, IconShieldCheck, IconClock, IconShield, IconWifi } from '@tabler/icons-react';

const Fasilitas = () => {
  const facilities = [
    {
      icon: IconSparkles, title: 'Salon & Grooming', subtitle: 'Ruang Grooming Modern',
      desc: 'Peralatan profesional berstandar internasional. Ruangan bersih, steril, dan anti-alergi.',
      tags: ['Steril', 'AC Central', 'Peralatan Pro'],
      gradient: 'from-primary-fixed to-primary-fixed-dim', iconColor: 'text-primary', tagBg: 'bg-primary-fixed', tagColor: 'text-on-primary-fixed',
    },
    {
      icon: IconBuilding, title: 'Cat Hotel', subtitle: 'Kamar Tidur Mewah',
      desc: '20+ kamar nyaman dengan desain yang mengurangi stress. Dilengkapi tempat tidur empuk dan mainan.',
      tags: ['20+ Kamar', 'CCTV 24 Jam', 'Ber-AC'],
      gradient: 'from-tertiary-fixed to-tertiary-fixed-dim', iconColor: 'text-tertiary', tagBg: 'bg-tertiary-fixed', tagColor: 'text-on-tertiary-fixed',
    },
    {
      icon: IconStethoscope, title: 'Klinik Hewan', subtitle: 'Klinik Berstandar Tinggi',
      desc: 'Dilengkapi peralatan diagnostik modern termasuk X-Ray dan USG. Ditangani 2 dokter hewan berpengalaman.',
      tags: ['X-Ray & USG', 'Drh. Bersertifikat', 'Laboratorium'],
      gradient: 'from-secondary-fixed to-secondary-fixed-dim', iconColor: 'text-secondary', tagBg: 'bg-secondary-fixed', tagColor: 'text-on-secondary-fixed',
    },
    {
      icon: IconShoppingCart, title: 'Pet Shop', subtitle: 'Toko Produk Lengkap',
      desc: '200+ produk pilihan dari merek terpercaya dunia. Makanan premium, aksesoris, obat-obatan.',
      tags: ['200+ Produk', 'Merek Ori', 'Stok Selalu Ada'],
      gradient: 'from-amber-50 to-amber-100', iconColor: 'text-amber-accent', tagBg: 'bg-amber-100', tagColor: 'text-amber-800',
    },
  ];

  const advantages = [
    { icon: IconShieldCheck, title: 'Bersertifikasi Resmi', desc: 'Semua layanan kami telah mendapat izin operasional resmi dari dinas terkait.' },
    { icon: IconClock, title: 'Buka 7 Hari Seminggu', desc: 'Senin–Minggu, pukul 08.00–21.00 WIB. Siap melayani kapan pun Anda butuh.' },
    { icon: IconShield, title: 'Keamanan Terjamin', desc: 'Sistem CCTV menyeluruh dan staf yang selalu siaga menjaga keamanan hewan peliharaan Anda.' },
    { icon: IconWifi, title: 'Area Tunggu Nyaman', desc: 'WiFi gratis, minuman, dan area bermain anak tersedia di ruang tunggu kami yang luas dan sejuk.' },
  ];

  return (
    <section className="max-w-container-max mx-auto px-gutter py-16">
      <div className="text-center mb-14 animate-fade-up">
        <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Kenali Tempat Kami</span>
        <h1 className="font-h2-section text-[48px] text-text-dark mt-2">Fasilitas Kami</h1>
        <p className="text-text-muted text-body-main mt-3 max-w-xl mx-auto">
          Dirancang dengan penuh kasih untuk memberikan kenyamanan maksimal bagi kucing dan pemiliknya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {facilities.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white border border-border-light rounded-3xl overflow-hidden group">
              <div className={`h-56 bg-gradient-to-br ${f.gradient} flex items-center justify-center relative overflow-hidden`}>
                <Icon size={120} className={`${f.iconColor} opacity-20 absolute`} />
                <div className="text-center z-10">
                  <Icon size={56} className={`${f.iconColor} mx-auto`} />
                  <p className={`font-h2-section mt-2 ${f.iconColor}`}>{f.title}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-h3-card text-text-dark mb-2">{f.subtitle}</h3>
                <p className="text-text-muted text-body-small mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((tag, j) => (
                    <span key={j} className={`${f.tagBg} ${f.tagColor} text-xs px-3 py-1 rounded-full`}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-on-secondary-fixed rounded-3xl p-10 text-on-primary">
        <h2 className="font-h2-section text-[32px] mb-6">Keunggulan Cat House</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {advantages.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={24} className="text-primary-fixed" />
                </div>
                <div>
                  <p className="font-ui-label text-sm text-white">{a.title}</p>
                  <p className="text-secondary-fixed text-xs mt-1">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Fasilitas;
