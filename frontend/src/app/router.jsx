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

import NotFound from '../features/landing/NotFound';

const router = createBrowserRouter([
  // Guest routes
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/verify-code', element: <VerifyCode /> },
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
      { index: true, element: <CustomerDashboard /> },
      { path: 'cats', element: <MyCats /> },
      { path: 'reservations', element: <MyReservations /> },
      { path: 'payments', element: <MyPayments /> },
      { path: 'payments/upload/:reservationId', element: <PaymentUpload /> },
      { path: 'history', element: <CustomerHistory /> },
      { path: 'profile', element: <Profile /> },
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
      { index: true, element: <StaffDashboard /> },
      { path: 'reservations', element: <StaffReservations /> },
      { path: 'daily-reports', element: <DailyReports /> },
      { path: 'payments', element: <PaymentVerification /> },
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
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'roles', element: <AdminRoles /> },
      { path: 'permissions', element: <AdminPermissions /> },
      { path: 'permission-categories', element: <AdminPermissionCategories /> },
      { path: 'services', element: <AdminServices /> },
      { path: 'cages', element: <AdminCages /> },
      { path: 'kategori-produk', element: <AdminKategoriProduk /> },
      { path: 'produk', element: <AdminProduk /> },
      { path: 'reports', element: <AdminReports /> },
      { path: 'settings', element: <AdminSettings /> },
    ],
  },
  // 404
  { path: '*', element: <NotFound /> },
]);

export default router;
