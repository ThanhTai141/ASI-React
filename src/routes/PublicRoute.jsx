import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  console.log('PublicRoute - User from AuthContext:', user);

  let localUser = null;
  try {
    localUser = JSON.parse(localStorage.getItem('user'));
    console.log('PublicRoute - User from localStorage:', localUser);
  } catch (error) {
    console.error('PublicRoute - Error parsing localStorage user:', error);
  }
// Kiểm tra xem người dùng đã đăng nhập chưa: Nếu user (từ AuthContext) hoặc localUser (từ localStorage) tồn tại
  if (user || localUser) {
    console.log('PublicRoute - User is authenticated, redirecting to /admin');
    return <Navigate to="/Admin" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node,
};

export default PublicRoute;//Chặn người đã đăng nhập truy cập Login