const Faq = () => {
  const faqs = [
    { q: 'Bagaimana cara melakukan reservasi?', a: 'Daftar akun terlebih dahulu, lalu tambahkan data kucing Anda, dan pilih layanan reservasi yang diinginkan.' },
    { q: 'Apa saja yang perlu dibawa saat check-in?', a: 'Bawa vaksinasi terbaru, makanan khusus jika ada, dan mainan kesayangan kucing Anda.' },
    { q: 'Bagaimana cara pembayaran?', a: 'Pembayaran dapat dilakukan melalui transfer bank setelah reservasi dikonfirmasi.' },
    { q: 'Apakah ada layanan grooming?', a: 'Ya, kami menyediakan layanan grooming terpisah yang dapat ditambahkan ke paket penitipan.' },
    { q: 'Bisakah saya memantau kucing saya?', a: 'Tentu! Staff kami akan memberikan laporan harian berupa foto dan kondisi kucing Anda.' },
  ];

  return (
    <div className="min-h-screen bg-[#fdf5ee] py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-[#7a3b1e] mb-12">FAQ</h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-[#7a3b1e] text-lg">{faq.q}</h3>
              <p className="text-gray-600 mt-2">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
