import { IconChartBar, IconCash, IconPaw } from '@tabler/icons-react';

const AdminReports = () => {
  const reports = [
    {
      title: 'Laporan Reservasi',
      desc: 'Lihat statistik reservasi berdasarkan periode',
      icon: IconChartBar,
      color: 'bg-primary-fixed text-primary',
    },
    {
      title: 'Laporan Keuangan',
      desc: 'Rekap pendapatan dan pembayaran',
      icon: IconCash,
      color: 'bg-green-50 text-green-700',
    },
    {
      title: 'Laporan Kucing',
      desc: 'Data kucing yang pernah dititipkan',
      icon: IconPaw,
      color: 'bg-tertiary-fixed text-tertiary',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-h2-section text-[28px] text-text-dark">Laporan</h1>
        <p className="text-text-muted mt-1">Pilih jenis laporan yang ingin dilihat</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {reports.map((report, i) => {
          const IconComponent = report.icon;
          return (
            <div
              key={i}
              className="bg-surface-container-lowest p-6 rounded-xl border border-border-light shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${report.color}`}>
                <IconComponent size={22} />
              </div>
              <h3 className="font-h3-card text-text-dark mb-2">{report.title}</h3>
              <p className="text-body-small text-text-muted leading-relaxed">
                {report.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReports;
