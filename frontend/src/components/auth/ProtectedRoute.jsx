import { Navigate } from 'react-router-dom';
import { getAuthState } from '../../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles, requiredPermissions }) => {
  const { isAuth, roles, permissions } = getAuthState();

  if (!isAuth) return <Navigate to='/login' replace />;

  const hasRole = !allowedRoles || roles.some((r) => allowedRoles.includes(r));
  const hasPermission = !requiredPermissions || requiredPermissions.some((p) => permissions.includes(p));

  if (!hasRole || !hasPermission) return <Navigate to='/' replace />;

  return children;
};

export default ProtectedRoute;
