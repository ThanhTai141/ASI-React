import PropTypes from 'prop-types';
import { useTheme } from '../context/ThemeContext.jsx';

function SetThemeLayout({ children }) {
  const { isDarkTheme } = useTheme();

  return (
    <div
      className={`
        min-h-screen transition-all duration-300
        ${isDarkTheme ? 'bg-gray-950 text-white' : 'bg-gray-100 text-black'}
      `}
    >
      
      {children}
    </div>
  );
}

SetThemeLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SetThemeLayout;