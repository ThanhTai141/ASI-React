import { Navigate } from 'react-router-dom';
import propTypes from 'prop-types';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Lấy user từ AuthContext

  // Kiểm tra user từ localStorage (dự phòng)
  let localUser = null;
  try {
    localUser = JSON.parse(localStorage.getItem('user'));
    console.log('ProtectedRoute - User from localStorage:', localUser);
  } catch (error) {
    console.error('ProtectedRoute - Error parsing localStorage user:', error);
  }

  // Nếu không có user (cả từ AuthContext và localStorage), chuyển hướng về /
  if (!user && !localUser) {
    console.log('ProtectedRoute - No user found, redirecting to /');
    return <Navigate to="/" replace />;
  }
  // Nếu có user, render children (Admin component)
  console.log('ProtectedRoute - User authenticated, rendering children');
  return children;
};

ProtectedRoute.propTypes = {
  children: propTypes.node,
};

export default ProtectedRoute;//Chặn người chưa đăng nhập truy cập Admin

