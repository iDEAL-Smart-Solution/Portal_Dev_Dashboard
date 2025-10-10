import React from 'react';
import { GetAdminUserResponse } from '../../types/adminUser';
import { Eye, Edit3, UserCheck } from 'lucide-react';

interface AdminUserCardProps {
  user: GetAdminUserResponse;
  onViewProfile: (user: GetAdminUserResponse) => void;
  onEdit: (user: GetAdminUserResponse) => void;
}

export const AdminUserCard: React.FC<AdminUserCardProps> = ({
  user,
  onViewProfile,
  onEdit
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* User Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {user.profilePictureUrl ? (
            <img
              src={`http://localhost:5093/${user.profilePictureUrl}`}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              user.profilePictureUrl ? 'hidden' : ''
            } ${user.gender === 'Male' ? 'bg-blue-600' : 'bg-pink-600'}`}
          >
            {user.firstName?.charAt(0).toUpperCase() || user.name.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase() || user.name.charAt(1)?.toUpperCase() || ''}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <UserCheck className="w-3 h-3 mr-1" />
                Admin
              </span>
              <span className="text-xs text-gray-500">UIN: {user.uin}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{user.schoolName}</p>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {user.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {user.phoneNumber}
        </div>
        {user.gender && (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {user.gender}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onViewProfile(user)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          title="View Profile"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(user)}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
          title="Edit Admin User"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};

