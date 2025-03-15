import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mt-4">Page Not Found</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
        Return 
        </Link>
      </div>
    </div>
  );
};

export default NotFound;