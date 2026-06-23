import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#fdf5ee] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">😿</div>
        <h1 className="text-4xl font-bold text-[#7a3b1e] mb-4">404</h1>
        <p className="text-gray-600 mb-8">Halaman yang Anda cari tidak ditemukan</p>
        <Link
          to="/"
          className="inline-block bg-[#AB1509] text-white px-6 py-3 rounded-lg hover:bg-[#8f1208] transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
