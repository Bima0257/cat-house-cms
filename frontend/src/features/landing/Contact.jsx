import { useState } from 'react';
import alert from '../../lib/alert';
import {
  IconMapPin, IconPhone, IconMail, IconClock,
  IconCamera, IconThumbUp, IconMessage, IconSend
} from '@tabler/icons-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert.success('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section className="max-w-container-max mx-auto px-gutter py-16">
      <div className="text-center mb-14 animate-fade-up">
        <span className="text-primary font-ui-label text-sm uppercase tracking-widest">Kami Siap Membantu</span>
        <h1 className="font-h2-section text-[48px] text-text-dark mt-2">Hubungi Kami</h1>
        <p className="text-text-muted text-body-main mt-3 max-w-xl mx-auto">
          Ada pertanyaan atau ingin membuat janji? Tim kami siap membantu Anda setiap hari.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="space-y-5 mb-10">
            {[
              { icon: IconMapPin, bg: 'bg-primary-fixed', color: 'text-primary', title: 'Alamat', content: 'Jl. Sukajadi No. 88, Bandung, Jawa Barat 40162' },
              { icon: IconPhone, bg: 'bg-tertiary-fixed', color: 'text-tertiary', title: 'Telepon / WhatsApp', content: '+62 812-3456-7890', content2: '+62 22 1234 5678' },
              { icon: IconMail, bg: 'bg-secondary-fixed', color: 'text-secondary', title: 'Email', content: 'halo@cathouse.id', content2: 'support@cathouse.id' },
              { icon: IconClock, bg: 'bg-amber-100', color: 'text-amber-600', title: 'Jam Operasional', content: 'Senin – Jumat: 08.00 – 21.00', content2: 'Sabtu – Minggu: 08.00 – 20.00' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-5 bg-surface-container-low rounded-2xl">
                  <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon size={24} className={item.color} />
                  </div>
                  <div>
                    <p className="font-ui-label text-sm text-text-dark">{item.title}</p>
                    <p className="text-text-muted text-body-small mt-1">{item.content}</p>
                    {item.content2 && <p className="text-text-muted text-body-small">{item.content2}</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <p className="font-ui-label text-sm text-text-dark mb-3">Ikuti Kami</p>
            <div className="flex gap-3">
              {[IconCamera, IconThumbUp, IconMessage].map((Icon, i) => (
                <button key={i} className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-on-primary-container transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-border-light rounded-3xl p-8">
          <h3 className="font-h3-card text-text-dark mb-6">Kirim Pesan</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-ui-label text-sm text-text-dark block mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Masukkan nama Anda"
                className="w-full border border-border-light rounded-xl px-4 py-3 text-body-small text-text-dark bg-surface-container-lowest transition-all"
              />
            </div>
            <div>
              <label className="font-ui-label text-sm text-text-dark block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full border border-border-light rounded-xl px-4 py-3 text-body-small text-text-dark bg-surface-container-lowest transition-all"
              />
            </div>
            <div>
              <label className="font-ui-label text-sm text-text-dark block mb-1.5">Subjek</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full border border-border-light rounded-xl px-4 py-3 text-body-small text-text-dark bg-surface-container-lowest transition-all"
              >
                <option value="">Pilih topik...</option>
                <option>Layanan Grooming</option>
                <option>Cat Hotel</option>
                <option>Konsultasi Veteriner</option>
                <option>Pembelian Produk</option>
                <option>Lainnya</option>
              </select>
            </div>
            <div>
              <label className="font-ui-label text-sm text-text-dark block mb-1.5">Pesan</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tulis pesan Anda di sini..."
                className="w-full border border-border-light rounded-xl px-4 py-3 text-body-small text-text-dark bg-surface-container-lowest transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3.5 rounded-full font-ui-label text-sm hover:bg-on-primary-container transition-all flex items-center justify-center gap-2"
            >
              <IconSend size={16} />
              Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
