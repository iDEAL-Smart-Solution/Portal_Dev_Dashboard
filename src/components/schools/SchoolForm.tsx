import React, { useState, useEffect } from 'react';
import { SchoolFormData, GetSchoolResponse } from '../../types/school';
import { resolveMediaUrl } from '../../config/media';

interface SchoolFormProps {
  school?: GetSchoolResponse;
  onSubmit: (data: SchoolFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

export const SchoolForm: React.FC<SchoolFormProps> = ({
  school,
  onSubmit,
  onCancel,
  isLoading = false,
  mode
}) => {
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: '',
    schoolLogoFilePath: null,
    colorCode: '#4F46E5',
    address: '',
    phoneNumber: '',
    email: '',
    domain: ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [errors, setErrors] = useState<Partial<SchoolFormData>>({});

  useEffect(() => {
    if (school && mode === 'edit') {
      setFormData({
        schoolName: school.schoolName,
        schoolLogoFilePath: null,
        colorCode: school.colorCode || '#4F46E5',
        address: school.address || '',
        phoneNumber: school.phoneNumber || '',
        email: school.email || '',
        domain: school.domain || ''
      });
      // Set preview for existing logo
      if (school.schoolLogoFilePath) {
        setLogoPreview(resolveMediaUrl(school.schoolLogoFilePath));
      }
    }
  }, [school, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SchoolFormData> = {};

    if (!formData.schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof SchoolFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'Register New School' : 'Edit School'}
        </h2>
        <p className="text-gray-600 mt-1">
          {mode === 'create' 
            ? 'Register a new school on the platform' 
            : 'Update the school information below'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Name */}
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
            School Name *
          </label>
          <input
            type="text"
            id="schoolName"
            value={formData.schoolName}
            onChange={(e) => handleInputChange('schoolName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.schoolName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter school name"
          />
          {errors.schoolName && (
            <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Domain */}
        <div>
          <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
            Domain
          </label>
          <input
            type="text"
            id="domain"
            value={formData.domain}
            onChange={(e) => handleInputChange('domain', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter school domain (e.g., school.edu)"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter school address"
          />
        </div>

        {/* Color Code */}
        <div>
          <label htmlFor="colorCode" className="block text-sm font-medium text-gray-700 mb-2">
            Brand Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="colorCode"
              value={formData.colorCode}
              onChange={(e) => handleInputChange('colorCode', e.target.value)}
              className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={formData.colorCode}
              onChange={(e) => handleInputChange('colorCode', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="#4F46E5"
            />
          </div>
        </div>

        {/* School Logo Upload */}
        <div>
          <label htmlFor="schoolLogoFilePath" className="block text-sm font-medium text-gray-700 mb-2">
            School Logo
          </label>
          <div className="mt-1 flex items-center space-x-4">
            {logoPreview && (
              <div className="flex-shrink-0">
                <img
                  src={logoPreview}
                  alt="School logo preview"
                  className="h-16 w-16 rounded-lg object-cover border border-gray-300"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                id="schoolLogoFilePath"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, schoolLogoFilePath: file });
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setLogoPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  } else {
                    setLogoPreview('');
                  }
                }}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
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
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create School' : 'Update School'}
          </button>
        </div>
      </form>
    </div>
  );
};
