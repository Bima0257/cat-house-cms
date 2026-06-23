import { useState } from 'react';
import { IconSparkles, IconBuilding, IconShoppingCart, IconPaw, IconPackage, IconShoppingBag, IconBed, IconHeart, IconCamera, IconShare } from '@tabler/icons-react';

const categories = ['semua', 'grooming', 'hotel', 'produk'];

const items = [
  { cat: 'grooming', h: 48, bg: 'bg-primary-fixed', icon: IconSparkles, color: 'text-primary' },
  { cat: 'hotel', h: 64, bg: 'bg-tertiary-fixed', icon: IconBuilding, color: 'text-tertiary' },
  { cat: 'produk', h: 48, bg: 'bg-secondary-fixed', icon: IconShoppingCart, color: 'text-secondary' },
  { cat: 'grooming', h: 64, bg: 'bg-primary-fixed', icon: IconPaw, color: 'text-primary' },
  { cat: 'produk', h: 64, bg: 'bg-amber-100', icon: IconShoppingBag, color: 'text-amber-600' },
  { cat: 'hotel', h: 48, bg: 'bg-tertiary-fixed', icon: IconBed, color: 'text-tertiary' },
  { cat: 'grooming', h: 56, bg: 'bg-secondary-fixed', icon: IconHeart, color: 'text-secondary' },
  { cat: 'produk', h: 48, bg: 'bg-primary-fixed', icon: IconPackage, color: 'text-primary' },
];

const Gallery = () => {
  const [filter, setFilter] = useState('semua');

  const filtered = filter === 'semua' ? items : items.filter((i) => i.cat === filter);

  return (
    <section className="max-w-container-max mx-auto px-gutter py-16">
      <div className="text-center mb-14 animate-fade-up">
        <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Foto & Momen</span>
        <h1 className="font-h2-section text-[48px] text-text-dark mt-2">Galeri Kami</h1>
        <p className="text-text-muted text-body-main mt-3 max-w-xl mx-auto">
          Setiap momen berharga kucing kesayangan Anda terdokumentasi dengan baik di Cat House.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full font-ui-label text-sm transition-all ${
              filter === cat
                ? 'bg-primary text-white'
                : 'border border-border-light text-text-muted hover:border-primary hover:text-primary'
            }`}
          >
            {cat === 'semua' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`gallery-item h-${item.h} ${item.bg}`}>
              <div className="w-full h-full flex items-center justify-center">
                <Icon size={48} className={item.color} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-surface-container rounded-3xl p-8 text-center">
        <IconCamera size={36} className="text-primary mx-auto" />
        <h3 className="font-h3-card text-text-dark mt-3 mb-2">Bagikan Momen Kucingmu!</h3>
        <p className="text-text-muted text-body-small mb-5">
          Tag kami di Instagram <strong>@cathouse.id</strong> dengan foto kucing Anda setelah perawatan di sini.
        </p>
        <button className="bg-primary text-white px-8 py-3 rounded-full font-ui-label text-sm hover:bg-on-primary-container transition-all flex items-center gap-2 mx-auto">
          <IconShare size={16} />
          Bagikan ke Instagram
        </button>
      </div>
    </section>
  );
};

export default Gallery;
