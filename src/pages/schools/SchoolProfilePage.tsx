import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSchoolStore } from '../../stores/schoolStore';
import { SubscriptionDetails } from '../../components/schools/SubscriptionDetails';
import { SubscriptionForm } from '../../components/schools/SubscriptionForm';
import { UpdateSubscriptionRequest } from '../../types/school';
import { resolveMediaUrl } from '../../config/media';

interface SchoolProfilePageProps {
  schoolId: string;
}

export const SchoolProfilePage: React.FC<SchoolProfilePageProps> = ({ schoolId }) => {
  const navigate = useNavigate();
  const {
    selectedSchoolDetails,
    fetchSchoolById,
    updateSchoolSubscription,
    isLoading,
    error,
    clearError
  } = useSchoolStore();

  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  useEffect(() => {
    fetchSchoolById(schoolId);
  }, [schoolId, fetchSchoolById]);

  const handleUpdateSubscription = async (data: UpdateSubscriptionRequest) => {
    if (!selectedSchoolDetails) return;
    
    try {
      await updateSchoolSubscription(data);
      // Close modal immediately
      setShowSubscriptionForm(false);
      
      // Optimistic UI update - update local state immediately
      const updatedSchoolDetails = {
        ...selectedSchoolDetails,
        schoolSubscription: {
          ...selectedSchoolDetails.schoolSubscription,
          allowedStudentCount: data.allowedStudentCount,
          registeredStudentCount: data.registeredStudentCount,
          amountPaid: data.amountPaid
        }
      };
      
      // Update the store directly for instant UI feedback
      useSchoolStore.setState({ selectedSchoolDetails: updatedSchoolDetails });
      
      // Fetch fresh data in background (non-blocking)
      fetchSchoolById(schoolId).catch(err => {
        console.warn('Background refresh failed:', err);
        // If background refresh fails, keep the optimistic update
      });
    } catch (error) {
      console.error('Failed to update subscription:', error);
      setShowSubscriptionForm(false);
    }
  };

  const handleEditSubscription = () => {
    setShowSubscriptionForm(true);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading School</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                fetchSchoolById(schoolId);
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

  if (!selectedSchoolDetails && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading school details...</p>
        </div>
      </div>
    );
  }

  if (!selectedSchoolDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">School not found</p>
          <button
            onClick={() => navigate('/schools')}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Back to Schools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => navigate('/schools')} className="hover:text-gray-700">
                Schools
              </button>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{selectedSchoolDetails.schoolName}</li>
          </ol>
        </nav>

        {/* School Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {selectedSchoolDetails.schoolLogoFilePath ? (
                <img
                  src={resolveMediaUrl(selectedSchoolDetails.schoolLogoFilePath)}
                  alt={`${selectedSchoolDetails.schoolName} logo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-3xl">
                  {selectedSchoolDetails.schoolName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedSchoolDetails.schoolName}</h1>
                <p className="text-sm text-gray-600 mt-1">Plan: {selectedSchoolDetails.planType}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {selectedSchoolDetails.email && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedSchoolDetails.email}</p>
                </div>
              </div>
            )}
            {selectedSchoolDetails.phoneNumber && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedSchoolDetails.phoneNumber}</p>
                </div>
              </div>
            )}
            {selectedSchoolDetails.address && (
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{selectedSchoolDetails.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Details */}
        <SubscriptionDetails
          subscription={selectedSchoolDetails.schoolSubscription}
          isActive={selectedSchoolDetails.isSubscrptionActive}
          onEdit={handleEditSubscription}
        />

        {/* Update Subscription Modal */}
        {showSubscriptionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <SubscriptionForm
                school={selectedSchoolDetails}
                onSubmit={handleUpdateSubscription}
                onCancel={() => setShowSubscriptionForm(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
