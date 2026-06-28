import { Link } from 'react-router-dom';
import {
  IconBowl, IconPaw, IconStar, IconPlus, IconChevronLeft, IconChevronRight,
  IconArrowRight, IconUser, IconCircleCheck
} from '@tabler/icons-react';

const Hero = () => (
  <section className="max-w-container-max mx-auto px-gutter pb-16">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      <div className="md:col-span-4 relative h-full flex flex-col justify-center animate-fade-up">
        <div className="mb-4">
          <IconBowl size={32} className="text-primary" />
        </div>
        <h1 className="font-hero-display text-hero-display text-primary leading-none mb-6">
          YOUR PUPP'S BEST FRIEND
        </h1>
        <p className="text-text-muted text-body-main mb-8 max-w-sm">
          Perawatan, grooming hingga nutrisi & olahraga — semua yang terbaik untuk sahabat berbulu Anda.
        </p>
        <Link to="/services" className="w-fit bg-primary-container text-on-primary px-8 py-4 rounded-full font-ui-label text-ui-label hover:scale-105 transition-transform">
          Lihat Layanan
        </Link>
        <div className="absolute -bottom-10 -left-10 pointer-events-none opacity-20">
          <IconPaw size={120} className="text-ghost-paw" />
        </div>
      </div>
      <div className="md:col-span-4 relative flex justify-center items-end h-full min-h-[500px]">
        <div className="absolute inset-0 bg-tertiary-fixed/30 arc-shape w-full h-[80%] bottom-0 -z-10"></div>
        <img
          alt="Kucing tabby oranye dan putih"
          className="w-full h-auto object-contain z-10"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf4rICfFZsX4EKiukFVVwrGA5KJkFKplDE93sOT5BLnIq3Tk9kPq9p__CRb45p93gSyJ7Kn3F3MNRnLAClMHghTxgcmQuptPCW6vcCZOM_EoKZUxLZ6-KqhGVQ9ytw4fC6eEAh5Mwj6yEuWCEufblaqx3hKz6zLcFhILgqo7mPpovoAi_b_wTgTkeN7XvAUpBceDQI_pSMqK9Q3rzouD8GDtq2kn5QBBoQp5Ou4DLKcGX_c-9bfI90tHHikp9xk3NfzZ32_Hw8rg"
        />
      </div>
      <div className="md:col-span-4 relative flex flex-col justify-between h-full py-8">
        <div className="absolute top-0 right-0">
          <IconPaw size={36} className="text-primary opacity-40" />
        </div>
        <div className="mt-auto">
          <div className="relative mb-8 flex justify-center">
            <img
              alt="Dry cat food bowl"
              className="w-48 h-auto drop-shadow-xl hover:rotate-3 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfhHAqqK9z6lJCt_f9fIZhRzop1VpGIQOfuOOzHn3pGFZt7haN8l1jJJlSZBOOmgmkbnggBacRsfIgZcbMn2nESWtF7I2lhpyFTGv2YDqTDN5zZ7RVq1mVzavS0wEItvXPd1Nb_uWLmQBNLw6_16EuP-lssIP0flzSyf1JBzwOQaQ1W8uewOzCui0cHhXTN-zBHURGzLW-I3iw_c9VvVUnDltdX2In2XYjzMk2yOawatjZ5ZJnNNb674Bb177zCL_GWuCdJz0kuA"
            />
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-border-light shadow-sm relative">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-h3-card text-text-dark">Dry cat food bowl</h3>
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-full border border-border-light flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <IconChevronLeft size={14} />
                </button>
                <button className="w-8 h-8 rounded-full border border-border-light flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <IconChevronRight size={14} />
                </button>
              </div>
            </div>
            <p className="font-price-lg text-primary mb-4">Rp 289.000</p>
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary rounded-full flex items-center justify-center p-2 text-center shadow-lg animate-stamp-rotate border-4 border-surface overflow-hidden">
              <p className="text-[8px] font-bold text-on-primary leading-tight">THE COMPLETE TASTE ISOLATED ON WHIBUY CAT BISCUIT TREAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StatsBar = () => (
  <section className="bg-on-secondary-fixed py-10 mt-8">
    <div className="max-w-container-max mx-auto px-gutter grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {[
        { value: '2.500+', label: 'Pelanggan Puas' },
        { value: '50+', label: 'Produk Premium' },
        { value: '8 Th', label: 'Pengalaman' },
        { value: '4.9★', label: 'Rating Rata-rata' },
      ].map((s, i) => (
        <div key={i}>
          <p className="font-hero-display text-3xl text-on-primary">{s.value}</p>
          <p className="text-secondary-fixed text-body-small mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

const ProductSection = () => {
  const products = [
    { name: 'Fancy Feast', rating: 4.9, reviews: 46, price: 280000, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCg9s2hQowEfvIbPOQNLqJ7_zAq7Tec9vTLFrQgailHaexkSUpRwcFgNuQvo5IEycCPHq3MAiP2w_6RuaTLGegMDSoG704LhoKk0Qcqa4jjfLXmGUYEZnz5GEwINcfAD0nF1bH_u1Ofc462EZIHjbwYP2zWWVozuM2ss8ZYkOOx39cb0qAjGWrIe0miFBHZull3-PU6CIw9RUVQb5xJoq7zP0JQt_NLBrkukydNgjWJvANbaTbJGgkII3hjUuPPUJEvwqvqm9E1pw' },
    { name: 'Purina Pro', rating: 4.9, reviews: 88, price: 140000, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCGcHruM8mpKW_sou5rny4ZAC1yh3nvG-xU75FxcIE_V5mKFEEd7RRkn7GRxj-hWbGI3bhzDXnq_QHzVbtd6SY9FApOf6MPVIsoGS2xKtkh5zNkRiWHO4XvRIMlyR4srH7SzfB2SqLAjN9W8FkY2qqmzODYU1cR_rjAsBiWS6oorprE-Cn6vIGjw5OPdVVcNrwxw-iiSWUU9Nukm6ue9U6lKDSVZo0nLKn11KUt5cWzKLeFMhIxA9yNoD2ZuYut2ef8kAyrLuR7w' },
    { name: 'Science Diet', rating: 4.9, reviews: 46, price: 280000, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt-CRBzXDk5denYUXElA3Y36KjYWn678tTAQGKrm_x912SzUwXQklDhsk3dYyBvzVIWzsTF4Fq8WV15aDFVV3UtSw9udYo6ZrLSdbn84I7p0knLZFjXmum2kDMQX9U0Nb3A1d3-GjwwMm3XDeFLH82VLKzELzzD8ab-vKAircrvP4JslIvvdPfDr-b-_zqhpJxL0VzbGOrjlVMczs8z_uaz9vAHqFrHNxZJI99FT2DjsLMoLSM7WPsmUTpBTdJCMJgxpfdnoLZPQ' },
    { name: 'Blue Buffalo', rating: 4.9, reviews: 46, price: 290000, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVbYceJv-anwyvKrbq4kGTH75uN7lUBEsID3QFwLflRmiuqXVr-jinQvfknGn7ZEcERuhpEew-s-aA0PQ72U_WANjR6GFHx5fl7y7IjDSkFsFPBT7yEs3RA3qcp7SagymIFP0KJCnehbQIXbb3t_Mk2U-KSyravrAcBblavfZueMPew3lvL4FCSMdF9MXTkla_Vk_9T0KfdHRKV204vdCYKhWherzan35sSjlhR9uTf6knoboTj52_AwN8_J1VyNA3nkmHGShNDg' },
  ];

  return (
    <section className="max-w-container-max mx-auto px-gutter py-section-gap">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 bg-on-secondary-fixed rounded-[40px] p-10 flex flex-col justify-between text-on-primary min-h-[400px]">
          <div>
            <h2 className="font-h2-section text-[42px] leading-[1.2] mb-6">BERIKAN NUTRISI LEZAT & BERAGAM</h2>
            <p className="text-secondary-fixed opacity-90 text-body-main mb-8">Topping makanan kucing baik untuk kesehatan, ingat berikan dalam porsi yang tepat.</p>
          </div>
          <Link to="/services" className="flex items-center gap-2 font-ui-label text-ui-label text-on-primary group w-fit">
            Lihat Semua Produk
            <IconArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {products.map((p, i) => (
            <div key={i} className="bg-white border border-border-light p-6 rounded-3xl group hover:custom-shadow transition-all duration-300 relative overflow-hidden">
              <div className="h-40 flex justify-center mb-4">
                <img alt={p.name} className="h-full object-contain group-hover:scale-105 transition-transform" src={p.img} />
              </div>
              <h4 className="font-h3-card text-text-dark mb-1">{p.name}</h4>
              <div className="flex items-center gap-2 mb-4">
                <IconStar size={14} className="text-star-yellow" fill="currentColor" />
                <span className="font-ui-label text-xs text-text-muted">{p.rating} ({p.reviews} Ulasan)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-price-lg text-primary">Rp {p.price.toLocaleString('id-ID')}</span>
                <button className="w-10 h-10 bg-primary-container rounded-xl text-on-primary flex items-center justify-center hover:rotate-90 transition-transform">
                  <IconPlus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    { text: '"Kucing saya jadi lebih aktif dan sehat sejak pakai produk dari Cat House. Pengiriman cepat dan pelayanan sangat ramah!"', name: 'Sari Dewi', city: 'Jakarta', bg: 'bg-primary-fixed', iconColor: 'text-primary' },
    { text: '"Fasilitas grooming-nya luar biasa! Michu terlihat cantik banget setelah perawatan. Pasti balik lagi!"', name: 'Budi Santoso', city: 'Bandung', bg: 'bg-tertiary-fixed', iconColor: 'text-tertiary' },
    { text: '"Cat House adalah toko pet terlengkap yang pernah saya temukan. Produknya ori dan harga bersaing."', name: 'Rina Ayu', city: 'Surabaya', bg: 'bg-secondary-fixed', iconColor: 'text-secondary' },
  ];

  return (
    <section className="bg-surface-container py-16">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="text-center mb-12">
          <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Testimoni</span>
          <h2 className="font-h2-section text-[36px] text-text-dark mt-2">Apa Kata Mereka?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-border-light">
              <div className="flex text-star-yellow mb-3">
                {[...Array(5)].map((_, j) => (
                  <IconStar key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="text-text-muted text-body-small mb-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${t.bg} rounded-full flex items-center justify-center`}>
                  <IconUser size={16} className={t.iconColor} />
                </div>
                <div>
                  <p className="font-ui-label text-sm text-text-dark">{t.name}</p>
                  <p className="text-xs text-text-muted">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <>
      <Hero />
      <StatsBar />
      <ProductSection />
      <TestimonialSection />
    </>
  );
};

export default Home;
