import { Link } from 'react-router-dom';
import { IconMail, IconPaw, IconBuildingStore, IconEye, IconFlag, IconCircleCheck, IconUser } from '@tabler/icons-react';

const About = () => {
  const team = [
    { name: 'drh. Rina Kusuma', role: 'Dokter Hewan', bg: 'bg-primary-fixed', color: 'text-primary' },
    { name: 'Andi Wibowo', role: 'Head Groomer', bg: 'bg-tertiary-fixed', color: 'text-tertiary' },
    { name: 'Dewi Prasetyo', role: 'Cat Hotel Manager', bg: 'bg-secondary-fixed', color: 'text-secondary' },
    { name: 'Bima Arjuna', role: 'Nutrition Consultant', bg: 'bg-amber-100', color: 'text-amber-600' },
  ];

  return (
    <section className="max-w-container-max mx-auto px-gutter py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 animate-fade-up">
        <div>
          <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Siapa Kami</span>
          <h1 className="font-h2-section text-[48px] text-text-dark mt-2 mb-5">Tentang Cat House</h1>
          <p className="text-text-muted text-body-main mb-5">
            Cat House berdiri sejak 2016 dengan misi sederhana: memberikan yang terbaik untuk kucing kesayangan Anda.
            Kami percaya bahwa setiap kucing berhak mendapatkan perawatan premium.
          </p>
          <p className="text-text-muted text-body-main mb-8">
            Dari sebuah toko kecil di Bandung, kini kami telah berkembang menjadi pusat perawatan kucing terlengkap
            dengan lebih dari 2.500 pelanggan setia di seluruh Indonesia.
          </p>
          <div className="flex gap-4">
            <Link to="/contact" className="bg-primary text-white px-6 py-3 rounded-full font-ui-label text-sm hover:bg-on-primary-container transition-all flex items-center gap-2">
              <IconMail size={16} /> Hubungi Kami
            </Link>
            <Link to="/services" className="border border-primary text-primary px-6 py-3 rounded-full font-ui-label text-sm hover:bg-primary hover:text-white transition-all">
              Layanan Kami
            </Link>
          </div>
        </div>
        <div className="relative">
          <div className="bg-primary-fixed/40 rounded-[40px] h-80 flex items-center justify-center">
            <IconBuildingStore size={150} className="text-primary opacity-30 absolute" />
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <IconPaw size={56} className="text-primary" fill="currentColor" />
              <p className="font-hero-display text-primary text-4xl mt-2">Cat House</p>
              <p className="text-text-muted text-sm mt-1">Est. 2016 · Bandung</p>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-5 bg-on-secondary-fixed text-white rounded-2xl p-4 shadow-xl">
            <p className="font-hero-display text-2xl">8+</p>
            <p className="text-secondary-fixed text-xs">Tahun Berpengalaman</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div className="bg-on-secondary-fixed rounded-3xl p-8 text-on-primary">
          <IconEye size={32} className="text-primary-fixed mb-4" />
          <h3 className="font-h3-card text-white mb-3">Visi</h3>
          <p className="text-secondary-fixed text-body-small">
            Menjadi pusat perawatan kucing terpercaya dan terlengkap di Indonesia yang memberikan standar layanan
            setara klinik internasional dengan harga terjangkau.
          </p>
        </div>
        <div className="bg-surface-container rounded-3xl p-8">
          <IconFlag size={32} className="text-primary mb-4" />
          <h3 className="font-h3-card text-text-dark mb-3">Misi</h3>
          <ul className="space-y-2 text-text-muted text-body-small">
            {[
              'Menyediakan produk nutrisi berkualitas tinggi',
              'Melatih tenaga ahli bersertifikasi internasional',
              'Membangun komunitas pecinta kucing yang sehat',
              'Berinovasi dalam layanan perawatan hewan',
            ].map((m, i) => (
              <li key={i} className="flex gap-2">
                <IconCircleCheck size={16} className="text-primary mt-0.5 shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="text-center mb-10">
          <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Orang di Balik Cat House</span>
          <h2 className="font-h2-section text-[36px] text-text-dark mt-2">Tim Kami</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <div key={i} className="text-center">
              <div className={`w-24 h-24 ${t.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <IconUser size={36} className={t.color} />
              </div>
              <p className="font-h3-card text-sm text-text-dark">{t.name}</p>
              <p className="text-text-muted text-xs mt-0.5">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
