import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { SchoolListPage } from './pages/schools/SchoolListPage';
import { SchoolProfilePage } from './pages/schools/SchoolProfilePage';
import { AdminUserListPage } from './pages/adminUsers/AdminUserListPage';
import { AdminUserProfilePage } from './pages/adminUsers/AdminUserProfilePage';
import LoginPage from './components/LoginPage';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';

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
  const { isAuthenticated, logout } = useAuthStore();

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
      </div>
    </Router>
  );
}


export default App;
