import React, { useState } from 'react';
import { UpdateSubscriptionRequest, GetSingleSchoolWithSubs } from '../../types/school';

interface SubscriptionFormProps {
  school: GetSingleSchoolWithSubs;
  onSubmit: (data: UpdateSubscriptionRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  school,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [allowedStudentCount, setAllowedStudentCount] = useState(school.schoolSubscription?.allowedStudentCount || 0);
  const [registeredStudentCount, setRegisteredStudentCount] = useState(school.schoolSubscription?.registeredStudentCount || 0);
  const [amountPaid, setAmountPaid] = useState(school.schoolSubscription?.amountPaid || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Safety check
  if (!school.schoolSubscription) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <p className="text-red-600 font-medium">Error: Subscription data not available</p>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (allowedStudentCount <= 0) {
      newErrors.allowedStudentCount = 'Allowed student count must be greater than 0';
    }

    if (registeredStudentCount < 0) {
      newErrors.registeredStudentCount = 'Registered student count cannot be negative';
    }

    if (registeredStudentCount > allowedStudentCount) {
      newErrors.registeredStudentCount = 'Registered students cannot exceed allowed count';
    }

    if (amountPaid < 0) {
      newErrors.amountPaid = 'Amount paid cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit({
      id: school.schoolSubscription.id,
      allowedStudentCount,
      registeredStudentCount,
      amountPaid
    });
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

        {/* Student Usage Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">Student Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Registered Students</span>
              <span className="text-sm font-semibold text-blue-900">{school.schoolSubscription.registeredStudentCount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Allowed Students</span>
              <span className="text-sm font-semibold text-blue-900">{school.schoolSubscription.allowedStudentCount}</span>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Available Slots</span>
                <span className={`text-sm font-semibold ${
                  school.schoolSubscription.allowedStudentCount - school.schoolSubscription.registeredStudentCount > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {school.schoolSubscription.allowedStudentCount - school.schoolSubscription.registeredStudentCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Allowed Student Count */}
        <div>
          <label htmlFor="allowedStudentCount" className="block text-sm font-medium text-gray-700 mb-2">
            Allowed Student Count
          </label>
          <input
            type="number"
            id="allowedStudentCount"
            min="1"
            value={allowedStudentCount}
            onChange={(e) => setAllowedStudentCount(Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.allowedStudentCount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.allowedStudentCount && (
            <p className="mt-1 text-sm text-red-600">{errors.allowedStudentCount}</p>
          )}
        </div>

        {/* Registered Student Count */}
        <div>
          <label htmlFor="registeredStudentCount" className="block text-sm font-medium text-gray-700 mb-2">
            Registered Student Count
          </label>
          <input
            type="number"
            id="registeredStudentCount"
            min="0"
            value={registeredStudentCount}
            onChange={(e) => setRegisteredStudentCount(Number(e.target.value))}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.registeredStudentCount ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.registeredStudentCount && (
            <p className="mt-1 text-sm text-red-600">{errors.registeredStudentCount}</p>
          )}
        </div>

        {/* Amount Paid */}
        <div>
          <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-2">
            Amount Paid
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">₦</span>
            <input
              type="number"
              id="amountPaid"
              min="0"
              step="0.01"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className={`w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.amountPaid ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.amountPaid && (
            <p className="mt-1 text-sm text-red-600">{errors.amountPaid}</p>
          )}
        </div>

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
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Updating...' : 'Update Subscription'}
          </button>
        </div>
      </form>
    </div>
  );
};
