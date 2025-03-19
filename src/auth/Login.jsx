import { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation cho Sign Up
    if (!username.trim()) {
      console.log('Validation failed: Username is empty or whitespace');
      toast.error('Vui lòng nhập tên đăng nhập!');
      return;
    }
    if (!email.trim()) {
      console.log('Validation failed: Email is empty or whitespace');
      toast.error('Vui lòng nhập email!');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.log('Validation failed: Email is invalid', email);
      toast.error('Email không hợp lệ!');
      return;
    }
    if (!password.trim() || password.trim().length < 6) {
      console.log('Validation failed: Password is too short or empty', password);
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      // Kiểm tra xem username hoặc email đã tồn tại chưa
      const checkResponse = await axios.get('http://localhost:3001/users');
      const users = checkResponse.data;
      console.log('Danh sách users hiện tại:', users);
      if (users.some((u) => u.username === username.trim())) {
        toast.error('Tên đăng nhập đã tồn tại!');
        return;
      }
      if (users.some((u) => u.email === email.trim())) {
        toast.error('Email đã tồn tại!');
        return;
      }

      const newUser = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        createdAt: new Date().toISOString(), 
        firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      address: "",
      companyName: "",
      companyWebsite: "",
      companyDescription: "",
      serialCode: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      streetAddress: "",
      };
      const response = await axios.post('http://localhost:3001/users', newUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Phản hồi từ server khi thêm user:', response.data);

      toast.success('Đăng ký thành công!',{autoClose: 2000,});
      setUsername('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setIsSignUp(false);
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi đăng ký:', err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      toast.error(errorMessage);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    console.log('handleSignIn called with:', { loginInput, password });

    // Validation cho Sign In,loại khoảng trống 
    if (!loginInput.trim()) {
      console.log('Validation failed: LoginInput is empty or whitespace');
      toast.error('Vui lòng nhập tên đăng nhập hoặc email!');
      return;
    }
    if (!password.trim()) {
      console.log('Validation failed: Password is empty or whitespace');
      toast.error('Vui lòng nhập mật khẩu!');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (loginInput.trim().includes('@') && !emailRegex.test(loginInput.trim())) {
      console.log('Validation failed: Email is invalid', loginInput);
      toast.error('Email không hợp lệ!');
      return;
    }
    if (password.trim().length < 6) {
      console.log('Validation failed: Password is too short', password);
      toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      const queryKey = loginInput.trim().includes('@') ? 'email' : 'username';
      const response = await axios.get('http://localhost:3001/users', {
        params: {
          [queryKey]: loginInput.trim(),
        },
      });

      const users = response.data;

      if (users.length === 0) {
        toast.error('Tên đăng nhập hoặc email không tồn tại!');
        return;
      }

      const user = users.find((u) => u.password === password.trim());
      if (!user) {
        toast.error('Mật khẩu không đúng!');
        return;
      }

      const fakeToken = `fake-jwt-${user.id}-${Date.now()}`;
      const userData = { ...user, token: fakeToken };
      login(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', fakeToken);

      toast.success('Đăng nhập thành công!');
      setTimeout(() => {
        navigate('/Admin');
      }, 1000);
    } catch (err) {
      console.error('Lỗi khi đăng nhập:', err.response ? err.response.data : err.message);
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại!';
      toast.error(errorMessage);
    }
  };

 
  return (
    <div
      className="min-h-screen bg-gradient-to-r from-blue-600 to-pink-500 flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%23ffffff33\' stroke-width=\'2\'/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className="absolute left-10 top-10 text-white flex items-center">
        <svg
          className="w-8 h-8 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 11c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-6c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4zm0 2c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
          />
        </svg>
        <span className="text-xl font-bold">MyDiscountedLabs</span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform translate-y-[-10%]">
        <div className="text-center mb-6">
          <h2 className="text-gray-600 font-semibold text-lg">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </h2>
        </div>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          {isSignUp ? (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  placeholder="Username or Email"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'} 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"

            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-800">
            <i className="fab fa-google"></i>
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
        Copyright © 2025 MyDiscountedLabs. All rights reserved.
      </div>
    </div>
  );
};

export default Login;