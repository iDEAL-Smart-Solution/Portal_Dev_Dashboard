import React from 'react';
import { GetSchoolResponse } from '../../types/school';

interface SchoolProfileProps {
  school: GetSchoolResponse;
  onEdit: () => void;
  onUpdateSubscription: () => void;
}

export const SchoolProfile: React.FC<SchoolProfileProps> = ({
  school,
  onEdit,
  onUpdateSubscription
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          {school.schoolLogoFilePath ? (
            <img
              src={school.schoolLogoFilePath}
              alt={`${school.schoolName} logo`}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-2xl"
              style={{ backgroundColor: school.colorCode || '#6B7280' }}
            >
              {school.schoolName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{school.schoolName}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  school.isSubscrptionActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {school.isSubscrptionActive ? 'Subscription Active' : 'Subscription Inactive'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
          >
            Edit Details
          </button>
          <button
            onClick={onUpdateSubscription}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              school.isSubscrptionActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {school.isSubscrptionActive ? 'Deactivate Subscription' : 'Activate Subscription'}
          </button>
        </div>
      </div>

      {/* School Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Contact Information
          </h3>
          
          {school.email && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{school.email}</p>
              </div>
            </div>
          )}

          {school.phoneNumber && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">{school.phoneNumber}</p>
              </div>
            </div>
          )}

          {school.address && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-gray-900">{school.address}</p>
              </div>
            </div>
          )}
        </div>

        {/* School Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            School Information
          </h3>
          
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">School ID</p>
              <p className="text-gray-900 font-mono text-sm">{school.id}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="text-gray-900 font-mono text-sm">{school.userId}</p>
            </div>
          </div>

          {school.colorCode && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-500">Brand Color</p>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: school.colorCode }}
                  ></div>
                  <p className="text-gray-900 font-mono text-sm">{school.colorCode}</p>
                </div>
              </div>
            </div>
          )}

          {school.schoolLogoFilePath && (
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-500">Logo Path</p>
                <p className="text-gray-900 font-mono text-sm">{school.schoolLogoFilePath}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timestamps */}
      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
          <div>
            <span className="font-medium">Created:</span> {new Date(school.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(school.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
