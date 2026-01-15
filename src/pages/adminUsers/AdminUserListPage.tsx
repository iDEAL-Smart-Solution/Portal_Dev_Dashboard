import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminUserStore } from '../../stores/adminUserStore';
import { useAuthStore } from '../../stores/authStore';
import { AdminUserCard } from '../../components/adminUsers/AdminUserCard';
import { AdminUserForm } from '../../components/adminUsers/AdminUserForm';
import { AdminUserFormData, GetAdminUserResponse } from '../../types/adminUser';

export const AdminUserListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    adminUsers,
    isLoading,
    error,
    fetchAdminUsers,
    createAdminUser,
    updateAdminUser,
    clearError
  } = useAdminUserStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<GetAdminUserResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');

  useEffect(() => {
    fetchAdminUsers();
  }, [fetchAdminUsers]);

  const handleCreateUser = async (formData: AdminUserFormData) => {
    if (!user?.id) {
      console.error('User ID not found');
      return;
    }
    
    try {
      await createAdminUser({
        ...formData,
        password: formData.password || '',
        schoolId: formData.schoolId
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create admin user:', error);
    }
  };

  const handleUpdateUser = async (formData: AdminUserFormData) => {
    if (!editingUser) return;
    
    try {
      await updateAdminUser({
        ...formData,
        id: editingUser.id,
        schoolId: editingUser.schoolId || ''
      });
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update admin user:', error);
    }
  };

  const handleViewProfile = (user: GetAdminUserResponse) => {
    // Use ID from API response for navigation
    navigate(`/admin-users/${user.id}`);
  };

  const handleEdit = (user: GetAdminUserResponse) => {
    setEditingUser(user);
  };

  // Filter admin users based on search term and gender
  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === 'all' || user.gender === genderFilter;
    
    return matchesSearch && matchesGender;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Admin Users</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchAdminUsers();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
              <p className="text-gray-600 mt-1">Manage admin users across all schools</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Admin User</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, email, or UIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as 'all' | 'Male' | 'Female')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Admin Users</p>
                <p className="text-2xl font-bold text-gray-900">{adminUsers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Male Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminUsers.filter(u => u.gender === 'Male').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Female Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminUsers.filter(u => u.gender === 'Female').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No admin users found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || genderFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Get started by adding your first admin user.'
              }
            </p>
            {!searchTerm && genderFilter === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Add Admin User
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <AdminUserCard
                key={user.id}
                user={user}
                onViewProfile={handleViewProfile}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}

        {/* Add User Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AdminUserForm
                mode="create"
                onSubmit={handleCreateUser}
                onCancel={() => setShowAddForm(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AdminUserForm
                user={editingUser}
                mode="edit"
                onSubmit={handleUpdateUser}
                onCancel={() => setEditingUser(null)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

