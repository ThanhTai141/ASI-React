import { Bell, User } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white dark:bg-gray-950 shadow-md p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <img
          src="/logo-vtc-academy-blue.png" 
          alt="Logo"
          className="h-[27px] w-[200px] mr-3"
        />
      </div>

      {/* Notification và Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification */}
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </div>

        {/* Profile */}
        <div className="relative group">
          <User className="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer" />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md hidden group-hover:block">
            <ul className="py-2 text-gray-900 dark:text-white">
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Profile</li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Settings</li>
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;