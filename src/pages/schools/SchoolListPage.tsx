import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../stores/schoolStore';
import { useAuthStore } from '../../stores/authStore';
import { SchoolCard } from '../../components/schools/SchoolCard';
import { SchoolForm } from '../../components/schools/SchoolForm';
import { SchoolFormData, GetSchoolResponse } from '../../types/school';

export const SchoolListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    schools,
    isLoading,
    error,
    fetchSchools,
    createSchool,
    updateSchool,
    updateSchoolSubscription,
    clearError
  } = useSchoolStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<GetSchoolResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  const handleCreateSchool = async (formData: SchoolFormData) => {
    if (!user?.id) {
      console.error('User ID not found');
      return;
    }
    
    try {
      await createSchool({
        ...formData,
        userId: user.id
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to create school:', error);
    }
  };

  const handleUpdateSchool = async (formData: SchoolFormData) => {
    if (!editingSchool) return;
    
    try {
      await updateSchool({
        ...formData,
        id: editingSchool.id,
        isSubscrptionActive: editingSchool.isSubscrptionActive,
        userId: editingSchool.userId
      });
      setEditingSchool(null);
    } catch (error) {
      console.error('Failed to update school:', error);
    }
  };

  const handleToggleSubscription = async (school: GetSchoolResponse) => {
    try {
      await updateSchoolSubscription(school.id, !school.isSubscrptionActive);
    } catch (error) {
      console.error('Failed to toggle subscription:', error);
    }
  };

  const handleViewProfile = (school: GetSchoolResponse) => {
    navigate(`/schools/${school.id}`);
  };

  const handleEdit = (school: GetSchoolResponse) => {
    setEditingSchool(school);
  };

  // Filter schools based on search term and status
  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.phoneNumber?.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && school.isSubscrptionActive) ||
                         (filterStatus === 'inactive' && !school.isSubscrptionActive);
    
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Schools</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchSchools();
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
              <h1 className="text-3xl font-bold text-gray-900">Platform Schools</h1>
              <p className="text-gray-600 mt-1">Manage all schools registered on the platform</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Register School</span>
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
                  placeholder="Search schools by name, email, or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Schools</option>
                <option value="active">Active Subscriptions</option>
                <option value="inactive">Inactive Subscriptions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-gray-900">{schools.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.filter(s => s.isSubscrptionActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schools.filter(s => !s.isSubscrptionActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading schools...</p>
            </div>
          </div>
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'No schools have been registered on the platform yet.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Register School
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onViewProfile={handleViewProfile}
                onEdit={handleEdit}
                onToggleSubscription={handleToggleSubscription}
              />
            ))}
          </div>
        )}

        {/* Add School Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <SchoolForm
                mode="create"
                onSubmit={handleCreateSchool}
                onCancel={() => setShowAddForm(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Edit School Modal */}
        {editingSchool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <SchoolForm
                school={editingSchool}
                mode="edit"
                onSubmit={handleUpdateSchool}
                onCancel={() => setEditingSchool(null)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
