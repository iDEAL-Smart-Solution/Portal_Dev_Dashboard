import React, { useState } from 'react';
import { SchoolSubscriptionData, GetSchoolResponse } from '../../types/school';

interface SubscriptionFormProps {
  school: GetSchoolResponse;
  onSubmit: (data: SchoolSubscriptionData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  school,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [isActive, setIsActive] = useState(school.isSubscrptionActive);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ isSubscrptionActive: isActive });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Update Subscription</h2>
        <p className="text-gray-600 mt-1">
          Manage the subscription status for {school.schoolName}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Status Display */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Current Status</h3>
          <div className="flex items-center space-x-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                school.isSubscrptionActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {school.isSubscrptionActive ? 'Active' : 'Inactive'}
            </span>
            <span className="text-sm text-gray-600">
              {school.isSubscrptionActive 
                ? 'School has access to all features' 
                : 'School access is limited'
              }
            </span>
          </div>
        </div>

        {/* Subscription Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Subscription Status
          </label>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setIsActive(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors duration-200 ${
                isActive
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="font-medium">Active</span>
            </button>
            <button
              type="button"
              onClick={() => setIsActive(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors duration-200 ${
                !isActive
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${!isActive ? 'bg-red-500' : 'bg-gray-300'}`}></div>
              <span className="font-medium">Inactive</span>
            </button>
          </div>
        </div>

        {/* Status Change Warning */}
        {isActive !== school.isSubscrptionActive && (
          <div className={`rounded-lg p-4 ${
            isActive 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              <svg 
                className={`w-5 h-5 mt-0.5 ${
                  isActive ? 'text-green-600' : 'text-red-600'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isActive 
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  } 
                />
              </svg>
              <div>
                <h4 className={`font-medium ${
                  isActive ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isActive ? 'Activating Subscription' : 'Deactivating Subscription'}
                </h4>
                <p className={`text-sm mt-1 ${
                  isActive ? 'text-green-700' : 'text-red-700'
                }`}>
                  {isActive 
                    ? 'This will grant the school access to all features and services.'
                    : 'This will restrict the school\'s access to limited features only.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || isActive === school.isSubscrptionActive}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Updating...' : 'Update Subscription'}
          </button>
        </div>
      </form>
    </div>
  );
};
