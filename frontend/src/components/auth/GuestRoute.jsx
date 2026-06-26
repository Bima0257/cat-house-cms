import { Navigate, Outlet } from 'react-router-dom';
import { getAuthState } from '../../hooks/useAuth';
import { ROLE_DASHBOARD } from '../../constants/routes';

const GuestRoute = () => {
  const { isAuth, roles } = getAuthState();

  if (!isAuth) return <Outlet />;

  const dashboard = ROLE_DASHBOARD[roles[0]] || ROLE_DASHBOARD.user;
  return <Navigate to={dashboard} replace />;
};

export default GuestRoute;
