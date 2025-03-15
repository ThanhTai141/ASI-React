import { useAuth } from '../context/AuthContext';
import { MapPin, Mail, Phone, Building2, Globe, FileText, Key, Map, Building, File, Edit, Trash2, User, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  if (!user) {
    return (
      <div className="p-6 text-gray-900 dark:text-white">
        <p className="text-red-500 dark:text-red-400">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      {/* Breadcrumb */}
      <div className="flex items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center">
          <Building2 className="w-4 h-4 mr-1" /> Client
        </span>
        <span className="mx-2"> {'>'} </span>
        <span>Client Detail</span>
      </div>

      {/* Tiêu đề và nút Delete */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Client Data</h1>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
          <Trash2 className="w-4 h-4 mr-2" /> Delete Client
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Account Details</h2>
            <button>
              <Edit className="w-5 h-5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500" />
            </button>
          </div>
          <div className="flex items-center mb-4">
            <img
              src={user.img || ''} // Hiển thị avatar riêng cho mỗi user, fallback nếu không có
              alt="Profile"
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-semibold">{user.username || 'Not set'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {user.address || 'Not set'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Mail className="w-4 h-4 mr-1" /> {user.email}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Phone className="w-4 h-4 mr-1" /> {user.phone || 'Not set'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">First Name:</span>
              <span className="ml-2 text-sm">{user.firstName || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">Last Name:</span>
              <span className="ml-2 text-sm">{user.lastName || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400">
                <Calendar className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">Date of Birth:</span>
              <span className="ml-2 text-sm">{user.dateOfBirth || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400">
                <User className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">Gender:</span>
              <span className="ml-2 text-sm">{user.gender || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Company Information & Company Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Information</h2>
                <button>
                  <Edit className="w-5 h-5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Company Name:</span>
                  <span className="ml-2 text-sm">{user.companyName || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Company Website:</span>
                  <span className="ml-2 text-sm">{user.companyWebsite || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Company Description:</span>
                  <span className="ml-2 text-sm">{user.companyDescription || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <Key className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Serial Code:</span>
                  <span className="ml-2 text-sm">{user.serialCode || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Company Address */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Address</h2>
                <button>
                  <Edit className="w-5 h-5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Map className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Country:</span>
                  <span className="ml-2 text-sm">{user.country || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">State:</span>
                  <span className="ml-2 text-sm">{user.state || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">City:</span>
                  <span className="ml-2 text-sm">{user.city || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <File className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Zip Code:</span>
                  <span className="ml-2 text-sm">{user.zipCode || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium">Street Address:</span>
                  <span className="ml-2 text-sm">{user.streetAddress || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="py-2 text-left">Product Category</th>
                  <th className="py-2 text-left">Sub Category</th>
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.products && user.products.length > 0 ? (
                  user.products.map((product, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-2">{product.category}</td>
                      <td className="py-2">{product.subCategory}</td>
                      <td className="py-2">{product.date}</td>
                      <td className="py-2 flex space-x-2">
                        <button>
                          <Edit className="w-4 h-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500" />
                        </button>
                        <button>
                          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 text-center text-gray-500 dark:text-gray-400">
                      No products available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;