import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      {/* Sidebar - fixed positioned */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top Navbar - sticky */}
        <Navbar setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <div className="flex-1 p-6 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-border-light bg-surface text-center">
          <p className="font-body-small text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Papfum Pet Care. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
