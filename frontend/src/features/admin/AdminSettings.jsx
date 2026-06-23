const AdminSettings = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-h2-section text-[28px] text-text-dark">Pengaturan</h1>
        <p className="text-text-muted mt-1">Konfigurasi aplikasi</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-border-light shadow-sm p-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Nama Aplikasi
            </label>
            <input
              type="text"
              defaultValue="Cat House"
              className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Email Support
            </label>
            <input
              type="email"
              defaultValue="hello@cathouse.id"
              className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              WhatsApp
            </label>
            <input
              type="text"
              defaultValue="+6281234567890"
              className="w-full px-4 py-2.5 border border-border-light rounded-xl bg-white text-text-dark focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(159,66,12,0.12)] transition"
            />
          </div>
          <button className="bg-primary hover:bg-on-primary-container text-white px-6 py-2.5 rounded-xl font-ui-label text-sm transition-colors">
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
