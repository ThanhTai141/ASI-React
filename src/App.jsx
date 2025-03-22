import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SetThemeLayout from './components/SetThemeLayout';
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import NotFound from './components/Notfound';
import Login from './auth/Login';
import DelayedFallback from './components/DelayFallBack'; 
import Profile from './components/Profile';
import './App.css';

const Admin = lazy(() =>
  import('./Page/Admin').then((module) => {
    console.log('Admin component loaded dynamically');
    return module;
  })
);

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <SetThemeLayout>
            <Routes>
              <Route path="/" element={
                <DelayedFallback
                  fallback={
                    <div 
                      style={{
                       background: 'rgba(255, 255, 255, 0.5)',
                      }}
                      className="flex justify-center items-center min-h-screen ]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        <span className="ml-4 text-lg font-bold text-black-700">Đang tải...</span>
                      </div>
                  
                }
                delay={3000} 
              >
                <PublicRoute>
                  <Login />
                </PublicRoute>
              </DelayedFallback>
              } />
              <Route
                path="/Admin"
                element={
                  <DelayedFallback
                    fallback={
                      <div 
                      style={{
                       background: 'rgba(255, 255, 255, 0.5)',
                      }}
                      className="flex justify-center items-center min-h-screen ]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
                        <span className="ml-4 text-lg font-bold text-black-700">Đang tải...</span>
                      </div>
                    }
                    delay={2000} 
                  >
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  </DelayedFallback>
                }
              />
              <Route path="/profile" element={<Profile onClose={() => {}} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer position="top-right" autoClose={2000} />
          </SetThemeLayout>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;