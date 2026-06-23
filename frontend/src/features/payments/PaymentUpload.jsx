import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createPayment } from '../../services/payments';
import alert from '../../lib/alert';

const PaymentUpload = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ payment_method: 'transfer', amount: '' });
  const [file, setFile] = useState(null);

  const mutation = useMutation({
    mutationFn: (formData) => createPayment(formData),
    onSuccess: () => {
      alert.success('Pembayaran berhasil dikirim, menunggu verifikasi');
      navigate('/customer/payments');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reservation_id', reservationId);
    formData.append('payment_method', form.payment_method);
    formData.append('amount', form.amount);
    if (file) formData.append('proof', file);
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Pembayaran</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
            <select
              value={form.payment_method}
              onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="transfer">Transfer Bank</option>
              <option value="tunai">Tunai</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
            <input
              type="number"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Masukkan jumlah pembayaran"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bukti Transfer</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Kirim Pembayaran
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentUpload;
