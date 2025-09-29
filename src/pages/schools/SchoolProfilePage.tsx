import React, { useState, useEffect } from 'react';
import { useSchoolStore } from '../../stores/schoolStore';
import { SchoolProfile } from '../../components/schools/SchoolProfile';
import { SchoolForm } from '../../components/schools/SchoolForm';
import { SubscriptionForm } from '../../components/schools/SubscriptionForm';
import { SchoolFormData, SchoolSubscriptionData, GetSchoolResponse } from '../../types/school';

interface SchoolProfilePageProps {
  schoolId: string;
}

export const SchoolProfilePage: React.FC<SchoolProfilePageProps> = ({ schoolId }) => {
  const {
    getSchoolById,
    updateSchool,
    updateSchoolSubscription,
    isLoading,
    error,
    clearError
  } = useSchoolStore();

  const [school, setSchool] = useState<GetSchoolResponse | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);

  useEffect(() => {
    const foundSchool = getSchoolById(schoolId);
    if (foundSchool) {
      setSchool(foundSchool);
    }
  }, [schoolId, getSchoolById]);

  const handleUpdateSchool = async (formData: SchoolFormData) => {
    if (!school) return;
    
    try {
      await updateSchool({
        ...formData,
        id: school.id,
        isSubscrptionActive: school.isSubscrptionActive,
        userId: school.userId
      });
      
      // Update local state
      const updatedSchool = getSchoolById(schoolId);
      if (updatedSchool) {
        setSchool(updatedSchool);
      }
      setShowEditForm(false);
    } catch (error) {
      console.error('Failed to update school:', error);
    }
  };

  const handleUpdateSubscription = async (data: SchoolSubscriptionData) => {
    if (!school) return;
    
    try {
      await updateSchoolSubscription(school.id, data.isSubscrptionActive);
      
      // Update local state
      const updatedSchool = getSchoolById(schoolId);
      if (updatedSchool) {
        setSchool(updatedSchool);
      }
      setShowSubscriptionForm(false);
    } catch (error) {
      console.error('Failed to update subscription:', error);
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleUpdateSubscriptionClick = () => {
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
                const foundSchool = getSchoolById(schoolId);
                if (foundSchool) {
                  setSchool(foundSchool);
                }
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

  if (!school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading school profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/schools" className="hover:text-gray-700">
                Schools
              </a>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium">{school.schoolName}</li>
          </ol>
        </nav>

        {/* School Profile */}
        <SchoolProfile
          school={school}
          onEdit={handleEdit}
          onUpdateSubscription={handleUpdateSubscriptionClick}
        />

        {/* Edit School Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <SchoolForm
                school={school}
                mode="edit"
                onSubmit={handleUpdateSchool}
                onCancel={() => setShowEditForm(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        )}

        {/* Update Subscription Modal */}
        {showSubscriptionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <SubscriptionForm
                school={school}
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
