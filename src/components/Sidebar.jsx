import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';

function Sidebar({ menuItems, onItemClick }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const { toggleTheme } = useTheme();
  const {  logout } = useAuth();
  const navigate = useNavigate(); 

  const handleMouseEnter = (item) => {
    console.log('Hovering item:', item);
    console.log('isCollapsed:', isCollapsed);
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    console.log('Hovering item:');
    setHoveredItem(null);
  };

  const handleClick = (item) => {
    if (item.id === 'theme') {
      toggleTheme();
    } else if (item.id === 'logout') {
      handleLogout(); 
    } else {
      onItemClick(item.id);
    }
  };

  const handleLogout = () => {
    logout(); 
    toast.success('Logout successfully', { autoClose: 2000 });
    localStorage.removeItem('activeView');
    localStorage.removeItem('user'); 
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div
      className={`bg-white text-gray-900 dark:bg-gray-800 dark:text-white shadow-md p-4 transition-all duration-300 flex flex-col min-h-screen ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >

      {/* Menu Items */}
      <ul className="space-y-4 flex-1">
        {menuItems.map((item, index) => (
          <li key={index} className="relative mb-2 list-none">
            <button
              onClick={() => handleClick(item)}
              className={`flex items-center p-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
                isCollapsed ? 'justify-center' : '' 
              } ${item.isActive ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={handleMouseLeave}
            >
              <span className="mr-2 text-xl">{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>} 
              {isCollapsed && hoveredItem === item && (
                <span
                  className="absolute z-50 left-full ml-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
                  style={{ top: '50%', transform: 'translateY(-50%)' }}
                >
                  {item.label}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-2 mt-4 shadow-md text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md flex items-center justify-center"
      >
        {isCollapsed ? '<' : '>'}
      </button>
    </div>
  );
}

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired, 
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default Sidebar;