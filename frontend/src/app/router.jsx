import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import GuestRoute from '../components/auth/GuestRoute';

import LandingLayout from '../components/layouts/landingpage/LandingpageLayout';
import DashboardLayout from '../components/layouts/dashboard/DashboardLayout';

import Home from '../features/landing/Home';
import About from '../features/landing/About';
import Services from '../features/landing/Services';
import Fasilitas from '../features/landing/Fasilitas';
import Gallery from '../features/landing/Gallery';
import Faq from '../features/landing/Faq';
import Contact from '../features/landing/Contact';

import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import VerifyCode from '../features/auth/VerifyCode';
import ForgotPassword from '../features/auth/ForgotPassword';
import ResetPassword from '../features/auth/ResetPassword';

import CustomerDashboard from '../features/dashboard/CustomerDashboard';
import MyCats from '../features/cats/MyCats';
import MyReservations from '../features/reservations/MyReservations';
import MyPayments from '../features/payments/MyPayments';
import PaymentUpload from '../features/payments/PaymentUpload';
import CustomerHistory from '../features/dashboard/CustomerHistory';
import Profile from '../features/dashboard/Profile';

import StaffDashboard from '../features/dashboard/StaffDashboard';
import StaffReservations from '../features/reservations/StaffReservations';
import DailyReports from '../features/daily-reports/DailyReports';
import PaymentVerification from '../features/payments/PaymentVerification';

import AdminDashboard from '../features/dashboard/AdminDashboard';
import AdminUsers from '../features/admin/AdminUsers';
import AdminRoles from '../features/admin/AdminRoles';
import AdminPermissions from '../features/admin/AdminPermissions';
import AdminPermissionCategories from '../features/admin/AdminPermissionCategories';
import AdminServices from '../features/admin/AdminServices';
import AdminCages from '../features/admin/AdminCages';
import AdminKategoriProduk from '../features/admin/AdminKategoriProduk';
import AdminProduk from '../features/admin/AdminProduk';
import AdminReports from '../features/admin/AdminReports';
import AdminSettings from '../features/admin/AdminSettings';
import AdminDatabaseBackup from '../features/admin/AdminDatabaseBackup';
import AdminAuditLogs from '../features/admin/AdminAuditLogs';

import NotFound from '../features/landing/NotFound';

const router = createBrowserRouter([
  // Guest routes
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/verify-code', element: <VerifyCode /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
  // Public landing routes
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'fasilitas', element: <Fasilitas /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'faq', element: <Faq /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  // Customer routes
  {
    path: '/customer',
    element: (
      <ProtectedRoute allowedRoles={['user']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <CustomerDashboard />, handle: { title: 'Dashboard' } },
      { path: 'cats', element: <MyCats />, handle: { title: 'Kucing Saya' } },
      { path: 'reservations', element: <MyReservations />, handle: { title: 'Reservasi' } },
      { path: 'payments', element: <MyPayments />, handle: { title: 'Pembayaran' } },
      { path: 'payments/upload/:reservationId', element: <PaymentUpload />, handle: { title: 'Upload Pembayaran' } },
      { path: 'history', element: <CustomerHistory />, handle: { title: 'Riwayat' } },
      { path: 'profile', element: <Profile />, handle: { title: 'Profil Saya' } },
    ],
  },
  // Staff routes
  {
    path: '/staff',
    element: (
      <ProtectedRoute allowedRoles={['staff']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <StaffDashboard />, handle: { title: 'Dashboard Staff' } },
      { path: 'reservations', element: <StaffReservations />, handle: { title: 'Kelola Reservasi' } },
      { path: 'daily-reports', element: <DailyReports />, handle: { title: 'Laporan Harian' } },
      { path: 'payments', element: <PaymentVerification />, handle: { title: 'Verifikasi Pembayaran' } },
      { path: 'profile', element: <Profile />, handle: { title: 'Profil Saya' } },
    ],
  },
  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin', 'staff']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard />, handle: { title: 'Dashboard Overview' } },
      { path: 'users', element: <AdminUsers />, handle: { title: 'Kelola Pengguna' } },
      { path: 'roles', element: <AdminRoles />, handle: { title: 'Kelola Roles' } },
      { path: 'permissions', element: <AdminPermissions />, handle: { title: 'Kelola Permissions' } },
      { path: 'permission-categories', element: <AdminPermissionCategories />, handle: { title: 'Kategori Permission' } },
      { path: 'services', element: <AdminServices />, handle: { title: 'Kelola Layanan' } },
      { path: 'cages', element: <AdminCages />, handle: { title: 'Kelola Kandang' } },
      { path: 'kategori-produk', element: <AdminKategoriProduk />, handle: { title: 'Kelola Kategori Produk' } },
      { path: 'produk', element: <AdminProduk />, handle: { title: 'Kelola Produk' } },
      { path: 'reports', element: <AdminReports />, handle: { title: 'Laporan' } },
      { path: 'settings', element: <AdminSettings />, handle: { title: 'Pengaturan' } },
      { path: 'backup-database', element: <AdminDatabaseBackup />, handle: { title: 'Database' } },
      { path: 'activity-logs', element: <AdminAuditLogs />, handle: { title: 'Audit Log' } },
      { path: 'profile', element: <Profile />, handle: { title: 'Profil Saya' } },
    ],
  },
  // 404
  { path: '*', element: <NotFound /> },
]);

export default router;
