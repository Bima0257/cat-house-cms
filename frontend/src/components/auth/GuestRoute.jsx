import { Navigate, Outlet } from 'react-router-dom';
import { getAuthState } from '../../hooks/useAuth';

const GuestRoute = () => {
  const { isAuth, roles } = getAuthState();

  if (!isAuth) return <Outlet />;

  if (roles.includes('admin') || roles.includes('super_admin')) return <Navigate to='/admin' replace />;
  if (roles.includes('staff')) return <Navigate to='/staff' replace />;

  return <Navigate to='/customer' replace />;
};

export default GuestRoute;
