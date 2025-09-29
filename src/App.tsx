import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import { SchoolListPage } from './pages/schools/SchoolListPage';
import { SchoolProfilePage } from './pages/schools/SchoolProfilePage';
import LoginPage from './components/LoginPage';
import { useAuthStore } from './stores/authStore';
import logo from './assets/logo.jpg';

// Wrapper component to handle route parameters
const SchoolProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <SchoolProfilePage schoolId={id || ''} />;
};

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated, login, logout, user } = useAuthStore();

  const handleLogin = () => {
    login('DEV/iDL0001');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <>
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/schools" className="flex items-center space-x-3">
                      <img 
                        src={logo} 
                        alt="iDEAL Smart Solution Limited" 
                        className="w-10 h-10 object-contain"
                      />
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">School Management System</span>
                        <span className="text-xs text-blue-600 font-medium">Dev Dashboard</span>
                      </div>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-8">
                    <Link
                      to="/schools"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Schools
                    </Link>
                    <Link
                      to="/users"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Users
                    </Link>
                    <Link
                      to="/settings"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Settings
                    </Link>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Welcome, {user?.uin}</span>
                      <button
                        onClick={logout}
                        className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main Content */}
            <main>
              <Routes>
                <Route path="/" element={<Navigate to="/schools" replace />} />
                <Route path="/schools" element={
                  <ProtectedRoute>
                    <SchoolListPage />
                  </ProtectedRoute>
                } />
                <Route path="/schools/:id" element={
                  <ProtectedRoute>
                    <SchoolProfileWrapper />
                  </ProtectedRoute>
                } />
                <Route path="/login" element={<Navigate to="/schools" replace />} />
              </Routes>
            </main>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}


export default App;
