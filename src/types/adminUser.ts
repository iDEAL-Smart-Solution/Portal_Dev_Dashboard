// Admin User-related TypeScript interfaces

export interface CreateAdminUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  gender: string;
  address: string;
  schoolId: string;
  profilePicture?: File | null;
}

export interface UpdateAdminUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
  schoolId: string;
  profilePicture?: File | null;
}

export interface GetAdminUserResponse {
  id: string;
  name: string;
  schoolName: string;
  uin: string;
  phoneNumber: string;
  email: string;
  password?: string; // Only in list response, excluded from display
  // Computed fields for display (parsed from name)
  firstName?: string;
  lastName?: string;
  gender?: string;
  address?: string;
  role?: string;
  schoolId?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetSingleAdminUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  address: string;
  uin: string;
  profilePictureUrl?: string;
  password?: string;
  passwordHash?: string;
  schoolName: string;
  schoolId: string;
}

export interface AdminUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  gender: string;
  address: string;
  schoolId: string;
  profilePicture?: File | null;
}

