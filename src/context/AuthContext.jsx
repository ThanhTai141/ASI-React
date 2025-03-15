import PropTypes from 'prop-types'; 
import { createContext, useContext, useState, useEffect } from 'react';

// Tạo AuthContext
const AuthContext = createContext();

// Component AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Kiểm tra localStorage khi ứng dụng khởi động
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Hàm đăng nhập
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;