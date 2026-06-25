import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getReservationReport,
  getFinancialReport,
  getCatReport,
  exportReservationPdf,
  exportFinancialPdf,
  exportCatPdf,
} from '../../services/reports';
import alert from '../../lib/alert';
import DataTable from '../../components/ui/DataTable';
import {
  IconChartBar,
  IconCash,
  IconPaw,
  IconFileDownload,
  IconCalendar,
  IconX,
  IconDownload,
} from '@tabler/icons-react';

const tabs = [
  { key: 'reservations', label: 'Reservasi', icon: IconChartBar },
  { key: 'financial', label: 'Keuangan', icon: IconCash },
  { key: 'cats', label: 'Kucing', icon: IconPaw },
];

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('reservations');
  const [filters, setFilters] = useState({ from: '', to: '', status: '' });
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const reservationQuery = useQuery({
    queryKey: ['report-reservations', filters],
    queryFn: async () => {
      const params = { per_page: 500 };
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.status) params.status = filters.status;
      const res = await getReservationReport(params);
      return res.data;
    },
    enabled: activeTab === 'reservations',
  });

  const financialQuery = useQuery({
    queryKey: ['report-financial', filters],
    queryFn: async () => {
      const params = { per_page: 500 };
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const res = await getFinancialReport(params);
      return res.data;
    },
    enabled: activeTab === 'financial',
  });

  const catQuery = useQuery({
    queryKey: ['report-cats', filters],
    queryFn: async () => {
      const params = { per_page: 500 };
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      const res = await getCatReport(params);
      return res.data;
    },
    enabled: activeTab === 'cats',
  });

  const activeData =
    activeTab === 'reservations'
      ? reservationQuery
      : activeTab === 'financial'
        ? financialQuery
        : catQuery;

  const items = activeData.data?.data || [];
  const summary = activeData.data?.extra?.summary || {};

  const handlePreviewPdf = async () => {
    try {
      const params = {};
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;
      if (filters.status && activeTab === 'reservations') params.status = filters.status;

      const exporters = {
        reservations: exportReservationPdf,
        financial: exportFinancialPdf,
        cats: exportCatPdf,
      };
      const response = await exporters[activeTab](params);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfPreviewUrl(url);
    } catch {
      alert.error('Gagal memuat PDF');
    }
  };

  const handleClosePreview = () => {
    if (pdfPreviewUrl) {
      window.URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
  };

  const handleDownloadPdf = () => {
    if (!pdfPreviewUrl) return;
    const link = document.createElement('a');
    link.href = pdfPreviewUrl;
    link.setAttribute('download', `laporan-${activeTab}-${new Date().toISOString().slice(0, 10)}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reservationColumns = [
    { key: 'user', header: 'Pelanggan', enableSorting: false, render: (r) => r.user?.name || '-' },
    { key: 'cat', header: 'Kucing', enableSorting: false, render: (r) => r.cat?.name || '-' },
    { key: 'service', header: 'Layanan', enableSorting: false, render: (r) => r.service?.name || '-' },
    { key: 'check_in', accessor: 'check_in', header: 'Check-In', enableSorting: true },
    { key: 'check_out', accessor: 'check_out', header: 'Check-Out', enableSorting: true },
    {
      key: 'status',
      accessor: 'status',
      header: 'Status',
      enableSorting: true,
      render: (r) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          r.status === 'konfirmasi' ? 'bg-blue-100 text-blue-700' :
          r.status === 'checkin' ? 'bg-green-100 text-green-700' :
          r.status === 'checkout' ? 'bg-gray-100 text-gray-700' :
          'bg-red-100 text-red-700'
        }`}>{r.status}</span>
      ),
    },
    { key: 'subtotal', accessor: 'subtotal', header: 'Total', enableSorting: true, render: (r) => `Rp ${Number(r.subtotal).toLocaleString('id-ID')}` },
  ];

  const financialColumns = [
    { key: 'date', header: 'Tanggal', enableSorting: false, render: (p) => p.paid_at ? new Date(p.paid_at).toLocaleDateString('id-ID') : '-' },
    { key: 'user', header: 'Pelanggan', enableSorting: false, render: (p) => p.reservation?.user?.name || '-' },
    { key: 'cat', header: 'Kucing', enableSorting: false, render: (p) => p.reservation?.cat?.name || '-' },
    { key: 'payment_method', accessor: 'payment_method', header: 'Metode', enableSorting: true },
    { key: 'amount', accessor: 'amount', header: 'Jumlah', enableSorting: true, render: (p) => `Rp ${Number(p.amount).toLocaleString('id-ID')}` },
    {
      key: 'status',
      accessor: 'status',
      header: 'Status',
      enableSorting: true,
      render: (p) => (
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
          p.status === 'terverifikasi' ? 'bg-green-100 text-green-700' :
          p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>{p.status}</span>
      ),
    },
  ];

  const catColumns = [
    { key: 'name', accessor: 'name', header: 'Nama', enableSorting: true },
    { key: 'owner', header: 'Pemilik', enableSorting: false, render: (c) => c.owner?.name || '-' },
    { key: 'breed', accessor: 'breed', header: 'Ras', enableSorting: true, render: (c) => c.breed || '-' },
    { key: 'gender', accessor: 'gender', header: 'JK', enableSorting: true, render: (c) => c.gender === 'jantan' ? '♂' : c.gender === 'betina' ? '♀' : '-' },
    { key: 'reservations_count', accessor: 'reservations_count', header: 'Total Reservasi', enableSorting: true, render: (c) => `${c.reservations_count || 0}x` },
  ];

  const activeColumns = activeTab === 'reservations' ? reservationColumns : activeTab === 'financial' ? financialColumns : catColumns;

  const renderSummary = () => {
    if (activeTab === 'reservations') {
      return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
          {[
            { label: 'Total', value: summary.total },
            { label: 'Pending', value: summary.pending, color: 'text-yellow-700 bg-yellow-50' },
            { label: 'Konfirmasi', value: summary.konfirmasi, color: 'text-blue-700 bg-blue-50' },
            { label: 'Check-In', value: summary.checkin, color: 'text-green-700 bg-green-50' },
            { label: 'Check-Out', value: summary.checkout, color: 'text-gray-700 bg-gray-100' },
            { label: 'Batal', value: summary.batal, color: 'text-red-700 bg-red-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-3 text-center ${s.color || 'bg-surface-container-lowest'}`}>
              <p className="text-xs text-text-muted">{s.label}</p>
              <p className="text-lg font-bold text-text-dark">{s.value ?? 0}</p>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === 'financial') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Pendapatan', value: `Rp ${(summary.total_pendapatan || 0).toLocaleString('id-ID')}` },
            { label: 'Bulan Ini', value: `Rp ${(summary.pendapatan_bulan_ini || 0).toLocaleString('id-ID')}`, color: 'text-green-700 bg-green-50' },
            { label: 'Terverifikasi', value: summary.terverifikasi ?? 0, color: 'text-green-700 bg-green-50' },
            { label: 'Pending', value: summary.pending ?? 0, color: 'text-yellow-700 bg-yellow-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-3 text-center ${s.color || 'bg-surface-container-lowest'}`}>
              <p className="text-xs text-text-muted">{s.label}</p>
              <p className="text-lg font-bold text-text-dark">{s.value}</p>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === 'cats') {
      return (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Total Kucing', value: summary.total_kucing },
            { label: 'Sedang Dititipkan', value: summary.sedang_dititipkan, color: 'text-green-700 bg-green-50' },
            { label: 'Pernah Dititipkan', value: summary.pernah_dititipkan, color: 'text-blue-700 bg-blue-50' },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-3 text-center ${s.color || 'bg-surface-container-lowest'}`}>
              <p className="text-xs text-text-muted">{s.label}</p>
              <p className="text-lg font-bold text-text-dark">{s.value ?? 0}</p>
            </div>
          ))}
          {summary.ras_terbanyak && Object.keys(summary.ras_terbanyak).length > 0 && (
            <div className="col-span-3 rounded-xl bg-surface-container-lowest p-3">
              <p className="text-xs text-text-muted mb-1">Ras Terbanyak</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(summary.ras_terbanyak).map(([breed, total]) => (
                  <span key={breed} className="text-xs bg-secondary-container text-secondary px-2.5 py-0.5 rounded-full">
                    {breed || '-'} ({total})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-h2-section text-[28px] text-text-dark">Laporan</h1>
            <p className="text-text-muted mt-1">Pilih jenis laporan yang ingin dilihat</p>
          </div>
        </div>
      </div>

      <div className="flex gap-1 mb-6 bg-surface-container-lowest rounded-xl p-1 border border-border-light w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setFilters({ from: '', to: '', status: '' }); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-ui-label transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text-dark'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {renderSummary()}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <IconCalendar size={16} className="text-text-muted" />
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))}
            className="px-3 py-1.5 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary"
          />
          <span className="text-text-muted text-sm">sd</span>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))}
            className="px-3 py-1.5 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary"
          />
        </div>

        {activeTab === 'reservations' && (
          <select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="px-3 py-1.5 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:border-primary"
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="konfirmasi">Konfirmasi</option>
            <option value="checkin">Check-In</option>
            <option value="checkout">Check-Out</option>
            <option value="batal">Batal</option>
          </select>
        )}

        <button
          onClick={handlePreviewPdf}
          className="ml-auto flex items-center gap-1.5 bg-primary hover:bg-on-primary-container text-white px-4 py-1.5 rounded-lg text-sm font-ui-label transition-colors"
        >
          <IconFileDownload size={16} />
          Preview PDF
        </button>
      </div>

      {pdfPreviewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={handleClosePreview}
        >
          <div
            className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
              <h2 className="font-semibold text-text-dark text-lg">
                Preview Laporan {tabs.find((t) => t.key === activeTab)?.label}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 bg-primary hover:bg-on-primary-container text-white px-4 py-2 rounded-lg text-sm font-ui-label transition-colors"
                >
                  <IconDownload size={16} />
                  Download
                </button>
                <button
                  onClick={handleClosePreview}
                  className="p-2 rounded-lg hover:bg-gray-100 text-text-muted transition-colors"
                >
                  <IconX size={20} />
                </button>
              </div>
            </div>
            <iframe
              src={pdfPreviewUrl}
              className="flex-1 w-full bg-gray-100"
              title="Preview PDF"
            />
          </div>
        </div>
      )}

      <DataTable
        columns={activeColumns}
        data={items}
        loading={activeData.isLoading}
        searchPlaceholder={
          activeTab === 'reservations' ? 'Cari pelanggan atau kucing...' :
          activeTab === 'financial' ? 'Cari pembayaran...' :
          'Cari kucing...'
        }
      />
    </div>
  );
};

export default AdminReports;
