import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { SchoolListPage } from './pages/schools/SchoolListPage';
import { SchoolProfilePage } from './pages/schools/SchoolProfilePage';
import { AdminUserListPage } from './pages/adminUsers/AdminUserListPage';
import { AdminUserProfilePage } from './pages/adminUsers/AdminUserProfilePage';
import LoginPage from './components/LoginPage';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import { Toaster } from 'sonner';

const isDevRole = (role?: string) => {
  const normalizedRole = role?.trim().toLowerCase();
  return normalizedRole === 'dev' || normalizedRole === 'developer';
};

// Wrapper component to handle route parameters
const SchoolProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <SchoolProfilePage schoolId={id || ''} />;
};

// Wrapper component for Admin User Profile
const AdminUserProfileWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <AdminUserProfilePage userId={id || ''} />;
};

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();

  if (isAuthenticated && user && !isDevRole(user.role)) {
    logout();
    return (
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated ? (
          <Layout onLogout={logout}>
            <Routes>
              <Route path="/" element={<Navigate to="/schools" replace />} />
              <Route path="/schools" element={<SchoolListPage />} />
              <Route path="/schools/:id" element={<SchoolProfileWrapper />} />
              <Route path="/admin-users" element={<AdminUserListPage />} />
              <Route path="/admin-users/:id" element={<AdminUserProfileWrapper />} />
              <Route path="/login" element={<Navigate to="/schools" replace />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        )}
        <Toaster position="top-right" richColors closeButton duration={3500} />
      </div>
    </Router>
  );
}


export default App;
