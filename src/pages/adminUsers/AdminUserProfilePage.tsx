import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUserStore } from '../../stores/adminUserStore';
import { AdminUserForm } from '../../components/adminUsers/AdminUserForm';
import { AdminUserFormData } from '../../types/adminUser';

interface AdminUserProfilePageProps {
  userId: string;
}

export const AdminUserProfilePage: React.FC<AdminUserProfilePageProps> = ({ userId }) => {
  const navigate = useNavigate();
  const {
    selectedAdminUser,
    fetchAdminUserById,
    updateAdminUser,
    isLoading,
    error,
    clearError
  } = useAdminUserStore();

  const [showEditForm, setShowEditForm] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);

  useEffect(() => {
    fetchAdminUserById(userId);
  }, [userId, fetchAdminUserById]);

  const handleUpdateUser = async (formData: AdminUserFormData) => {
    if (!selectedAdminUser || !selectedAdminUser.schoolId) return;
    
    try {
      await updateAdminUser({
        ...formData,
        id: selectedAdminUser.id,
        schoolId: selectedAdminUser.schoolId
      });
      await fetchAdminUserById(userId);
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update admin user:', error);
    }
  };

  const handleCopyPassword = async () => {
    if (!selectedAdminUser?.password) return;
    
    try {
      await navigator.clipboard.writeText(selectedAdminUser.password);
      setPasswordCopied(true);
      setShowCopiedNotification(true);
      
      // Reset the icon after 2 seconds
      setTimeout(() => {
        setPasswordCopied(false);
      }, 2000);
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowCopiedNotification(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy password:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading User</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchAdminUserById(userId);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedAdminUser && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!selectedAdminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User not found</p>
          <button
            onClick={() => navigate('/admin-users')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Admin Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Copied Notification Toast */}
      {showCopiedNotification && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Password copied to clipboard!</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/admin-users')} className="hover:text-gray-700">
                Admin Users
              </button>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{selectedAdminUser.name}</li>
          </ol>
        </nav>

        {/* User Profile */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {selectedAdminUser.profilePictureUrl ? (
                <img
                  src={`http://localhost:5093/${selectedAdminUser.profilePictureUrl}`}
                  alt={selectedAdminUser.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                  selectedAdminUser.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'
                }`}>
                  {selectedAdminUser.firstName?.charAt(0) || selectedAdminUser.name.charAt(0)}{selectedAdminUser.lastName?.charAt(0) || selectedAdminUser.name.charAt(1) || ''}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedAdminUser.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{selectedAdminUser.schoolName}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    Admin User
                  </span>
                  <span className="text-sm text-gray-600">UIN: {selectedAdminUser.uin}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h3>
              
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedAdminUser.email}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedAdminUser.phoneNumber}</p>
                </div>
              </div>

              {selectedAdminUser.address && (
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{selectedAdminUser.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              
              {selectedAdminUser.gender && (
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-gray-900">{selectedAdminUser.gender}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">UIN</p>
                  <p className="text-gray-900 font-mono text-sm">{selectedAdminUser.uin}</p>
                </div>
              </div>

              {selectedAdminUser.role && (
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-gray-900">{selectedAdminUser.role}</p>
                  </div>
                </div>
              )}

              {selectedAdminUser.password && (
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Password</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 font-mono text-sm">••••••••</p>
                      <button
                        onClick={handleCopyPassword}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200 rounded hover:bg-gray-100"
                        title={passwordCopied ? "Copied!" : "Copy password"}
                      >
                        {passwordCopied ? (
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timestamps */}
          {(selectedAdminUser.createdAt || selectedAdminUser.updatedAt) && (
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                {selectedAdminUser.createdAt && (
                  <div>
                    <span className="font-medium">Created:</span> {new Date(selectedAdminUser.createdAt).toLocaleString()}
                  </div>
                )}
                {selectedAdminUser.updatedAt && (
                  <div>
                    <span className="font-medium">Last Updated:</span> {new Date(selectedAdminUser.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AdminUserForm
                user={selectedAdminUser}
                mode="edit"
                onSubmit={handleUpdateUser}
                onCancel={() => setShowEditForm(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

