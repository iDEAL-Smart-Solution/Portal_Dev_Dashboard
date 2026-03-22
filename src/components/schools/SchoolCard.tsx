import React from 'react';
import { GetSchoolResponse } from '../../types/school';
import { Eye, Edit3, Power } from 'lucide-react';
import { resolveMediaUrl } from '../../config/media';

interface SchoolCardProps {
  school: GetSchoolResponse;
  onViewProfile: (school: GetSchoolResponse) => void;
  onEdit: (school: GetSchoolResponse) => void;
  onToggleSubscription: (school: GetSchoolResponse) => void;
}

export const SchoolCard: React.FC<SchoolCardProps> = ({
  school,
  onViewProfile,
  onEdit,
  onToggleSubscription
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* School Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {school.schoolLogoFilePath ? (
            <img
              src={resolveMediaUrl(school.schoolLogoFilePath)}
              alt={`${school.schoolName} logo`}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                // Fallback to initial if image fails to load
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
              school.schoolLogoFilePath ? 'hidden' : ''
            }`}
            style={{ backgroundColor: school.colorCode || '#6B7280' }}
          >
            {school.schoolName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{school.schoolName}</h3>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  school.isSubscrptionActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {school.isSubscrptionActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* School Details */}
      <div className="space-y-2 mb-4">
        {school.email && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {school.email}
          </div>
        )}
        {school.phoneNumber && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {school.phoneNumber}
          </div>
        )}
        {school.address && (
          <div className="flex items-start text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-2">{school.address}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewProfile(school)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          title="View Profile"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(school)}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          title="Edit School"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onToggleSubscription(school)}
          className={`flex-1 text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2 ${
            school.isSubscrptionActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
          title={school.isSubscrptionActive ? 'Deactivate Subscription' : 'Activate Subscription'}
        >
          <Power className="w-4 h-4" />
          <span>{school.isSubscrptionActive ? 'Off' : 'On'}</span>
        </button>
      </div>
    </div>
  );
};
