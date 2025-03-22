import { useState, useEffect } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, Mail, Phone, Building2, Globe, FileText, Key, Map, Building, File, Edit, Trash2, User, Calendar, X } from 'lucide-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';


const Profile = ({ onClose }) => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditCompanyInfoModalOpen, setIsEditCompanyInfoModalOpen] = useState(false);
  const [isEditCompanyAddressModalOpen, setIsEditCompanyAddressModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form, setForm] = useState(user ? { ...user } : {});
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  // Kiểm tra trạng thái deleted của tài khoản khi component được tải
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:3001/users/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();

        if (userData.deleted) {
          toast.info('Tài khoản của bạn đã bị đánh dấu để xóa. Vui lòng đăng nhập lại để khôi phục.', {
            autoClose: 3000,
          });

          setTimeout(() => {
            logout();
            navigate('/', { replace: true });
          }, 1000);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        toast.error('Failed to verify user status');
      }
    };

    checkUserStatus();
  }, [user, logout, navigate, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = async (e, section) => {
    e.preventDefault();
    console.log('handleEdit called with section:', section);
    console.log('User in handleEdit:', user);
    if (!user || !user.id) {
      console.error('User or user.id is undefined in handleEdit:', user);
      toast.error('Cannot update user: Invalid user ID');
      return;
    }
    try {
      const EditUser = { ...form, id: user.id, avatar: user.avatar };
      console.log('Sending updated user data:', EditUser);
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(EditUser),
      });
      console.log('PUT response:', response);
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
      }
  
      console.log('Calling fetchUserData...');
      await fetchUserData();
      console.log('fetchUserData completed');
  
      if (section === 'account') setIsEditModalOpen(false);
      if (section === 'companyInfo') setIsEditCompanyInfoModalOpen(false);
      if (section === 'companyAddress') setIsEditCompanyAddressModalOpen(false);
  
      toast.success('User updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(`Failed to update user: ${error.message}`);
    }
  };
  
  const fetchUserData = async () => {
    console.warn('fetchUserData called');
    console.warn('User in fetchUserData:', user);
    if (!user || !user.id) {
      console.error('User or user.id is undefined:', user);
      toast.error('Cannot fetch user data: Invalid user ID', { autoClose: 5000 });
      return;
    }
    try {
      console.warn('Fetching user data for ID:', user.id);
      const response = await fetch(`http://localhost:3001/users/${user.id}`);
      console.warn('GET response:', response);
      if (!response.ok) {
        throw new Error(`Failed to fetch updated user data: ${response.status} ${response.statusText}`);
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      console.warn('Updated user in AuthContext:', updatedUser);
      setForm(updatedUser);
    } catch (error) {
      console.error('Error fetching updated user:', error);
      toast.error(`Failed to refresh user data: ${error.message}`, { autoClose: 5000 });
    }
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (confirmationText !== 'DELETE MY ACCOUNT') {
        toast.error('Vui lòng nhập đúng cụm từ xác nhận!');
        return;
      }

      const userResponse = await fetch(`http://localhost:3001/users/${user.id}`);
      const userData = await userResponse.json();
      if (userData.password !== password) {
        toast.error('Mật khẩu không đúng!');
        return;
      }

      // 3. Xử lý dữ liệu liên quan (xóa sản phẩm)
      const productsResponse = await fetch(`http://localhost:3001/products?userId=${user.id}`);
      const products = await productsResponse.json();
      for (const product of products) {
        await fetch(`http://localhost:3001/products/${product.id}`, {
          method: 'DELETE',
        });
      }

      // 4. Đánh dấu tài khoản là "đã xóa" (soft delete)
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deleted: true,
          deletedAt: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to mark user as deleted');
      }

      await fetch('http://localhost:3001/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_USER',
          userId: user.id,
          username: user.username,
          timestamp: new Date().toISOString(),
        }),
      });

      await fetch('http://localhost:3001/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `User ${user.username} has deleted their account.`,
        }),
      });

      setIsDeleteModalOpen(false);

      toast.info('Tài khoản của bạn đã được đánh dấu để xóa. Bạn có 30 ngày để khôi phục.', {
        autoClose: 3000,
      });

      setTimeout(() => {
        localStorage.removeItem('token');
        fetch('http://localhost:3001/blacklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: localStorage.getItem('token') }),
        });

        logout();

        navigate('/', { replace: true });
      }, 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Kiểm tra nếu không có user hoặc user đã bị xóa
  if (!user) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-950  min-h-screen">
      {/* Tiêu đề và nút Delete */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold ">Client Data</h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsDeleteModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete Client
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Details */}
        <div className="bg-white dark:bg-gray-800  dark:text-white dark:hover:bg-gray-600 dark:shadow-md p-6 rounded-lg  shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold ">Account Details</h2>
            <button onClick={() => setIsEditModalOpen(true)}>
              <Edit className="w-4 h-4 text-blue-500 hover:text-blue-600" />
            </button>
          </div>

          <div className="flex items-center mb-4">
          <div
          style={{ clipPath: 'circle(50% at 50% 50%)' }}
           className="w-16 h-16 rounded-full  bg-gray-200 flex items-center justify-center mr-4 object-cover ">
  <img
    src={user.img || 'path/to/default-avatar.png'}
    alt={user.username}
    className="w-full h-full object-cover rounded-full"
  />
</div>
            <div>
              <h3 className="text-lg font-semibold">{user.username || 'Not set'}</h3>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="w-4 h-4 mr-1" /> {user.address || 'Not set'}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" /> {user.email}
              </p>
              <p className="text-sm text-gray-500 flex items-center">
                <Phone className="w-4 h-4 mr-1" /> {user.phone || 'Not set'}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">First Name:</span>
              <span className="ml-2 text-sm">{user.firstName || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Last Name:</span>
              <span className="ml-2 text-sm">{user.lastName || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Date of Birth:</span>
              <span className="ml-2 text-sm">{user.dateOfBirth || 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">Gender:</span>
              <span className="ml-2 text-sm">{user.gender || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* Edit Modal for Account Details */}
        {isEditModalOpen && (
          <div
          style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
           className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white  dark:bg-gray-900  dark:text-white dark:shadow-md  p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button onClick={() => setIsEditModalOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={(e) => handleEdit(e, 'account')} className="space-y-4">
                
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <select
                    name="gender"
                    value={form.gender || ''}
                    onChange={handleInputChange}
                    className="w-full p-2  mt-1 border rounded"
                  >
                    <option className='dark:text-black ' value="Male">Male</option>
                    <option className='dark:text-black ' value="Female">Female</option>
                    <option className='dark:text-black ' value="Other">Other</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white  dark:bg-gray-800  dark:text-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-4 text-red-500">
                Cảnh báo: Tài khoản của bạn sẽ được đánh dấu để xóa. Tất cả dữ liệu liên quan (sản phẩm, thông tin công ty) sẽ bị xóa. Bạn có 30 ngày để khôi phục tài khoản trước khi nó bị xóa vĩnh viễn!
              </p>
              <div className="mb-4">
                <label className="text-sm font-medium">Nhập mật khẩu để xác nhận:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mt-1 border rounded"
                  placeholder="Enter your password"
                />
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium">
                  Nhập DELETE MY ACCOUNT để xác nhận:
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full p-2 mt-1 border rounded"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDeleteModalOpen(false);
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Company Information & Company Address */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Information */}
            <div className="bg-white dark:bg-gray-800  dark:text-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold ">Company Information</h2>
                <button onClick={() => setIsEditCompanyInfoModalOpen(true)}>
                  <Edit className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Company Name:</span>
                  <span className="ml-2 text-sm">{user.companyName || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Company Website:</span>
                  <span className="ml-2 text-sm">{user.companyWebsite || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Company Description:</span>
                  <span className="ml-2 text-sm">{user.companyDescription || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <Key className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Serial Code:</span>
                  <span className="ml-2 text-sm">{user.serialCode || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Edit Modal for Company Information */}
            {isEditCompanyInfoModalOpen && (
              <div
              style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
               className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white  dark:bg-gray-800  dark:text-white p-6 rounded-lg w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Company Information</h2>
                    <button onClick={() => setIsEditCompanyInfoModalOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={(e) => handleEdit(e, 'companyInfo')} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={form.companyName || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company Website</label>
                      <input
                        type="text"
                        name="companyWebsite"
                        value={form.companyWebsite || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company Description</label>
                      <input
                        type="text"
                        name="companyDescription"
                        value={form.companyDescription || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Serial Code</label>
                      <input
                        type="text"
                        name="serialCode"
                        value={form.serialCode || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsEditCompanyInfoModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Company Address */}
            <div className="bg-white  dark:bg-gray-800  dark:text-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold ">Company Address</h2>
                <button onClick={() => setIsEditCompanyAddressModalOpen(true)}>
                  <Edit className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Map className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Country:</span>
                  <span className="ml-2 text-sm">{user.country || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">State:</span>
                  <span className="ml-2 text-sm">{user.state || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">City:</span>
                  <span className="ml-2 text-sm">{user.city || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <File className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Zip Code:</span>
                  <span className="ml-2 text-sm">{user.zipCode || 'Not set'}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Street Address:</span>
                  <span className="ml-2 text-sm">{user.streetAddress || 'Not set'}</span>
                </div>
              </div>
            </div>

            {/* Edit Modal for Company Address */}
            {isEditCompanyAddressModalOpen && (
              <div
              style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
               className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white  dark:bg-gray-800  dark:text-white p-6 rounded-lg w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Company Address</h2>
                    <button onClick={() => setIsEditCompanyAddressModalOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <form onSubmit={(e) => handleEdit(e, 'companyAddress')} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={form.country || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">State</label>
                      <input
                        type="text"
                        name="state"
                        value={form.state || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">City</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Zip Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={form.zipCode || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Street Address</label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={form.streetAddress || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsEditCompanyAddressModalOpen(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Product Table */}
          <div className="bg-white  dark:bg-gray-800  dark:text-white  p-6 rounded-lg shadow-md">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Product Category</th>
                  <th className="py-2 text-left">Sub Category</th>
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {user.products && user.products.length > 0 ? (
                  user.products.map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{product.category}</td>
                      <td className="py-2">{product.subCategory}</td>
                      <td className="py-2">{product.date}</td>
                      <td className="py-2 flex space-x-2">
                        <button>
                          <Edit className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                        </button>
                        <button>
                          <Trash2 className="w-4 h-4 text-red-500 hover:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 text-center text-gray-500">
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

Profile.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Profile;