import { create } from 'zustand';
import { GetAdminUserResponse, GetSingleAdminUserResponse, CreateAdminUserRequest, UpdateAdminUserRequest } from '../types/adminUser';
import axiosInstance from '../config/axios';

// Helper function to parse name into first and last name for list view
const parseAdminUserName = (user: GetAdminUserResponse): GetAdminUserResponse => {
  const nameParts = user.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';
  
  return {
    ...user,
    firstName,
    lastName,
    role: 'Admin',
    // Gender can be determined from detailed view
    gender: 'Male' // Default
  };
};

interface AdminUserState {
  adminUsers: GetAdminUserResponse[];
  selectedAdminUser: GetAdminUserResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchAdminUsers: () => Promise<void>;
  fetchAdminUserById: (id: string) => Promise<void>;
  getAdminUserById: (id: string) => GetAdminUserResponse | undefined;
  createAdminUser: (userData: CreateAdminUserRequest) => Promise<void>;
  updateAdminUser: (userData: UpdateAdminUserRequest) => Promise<void>;
  setSelectedAdminUser: (user: GetAdminUserResponse | null) => void;
  clearError: () => void;
}

export const useAdminUserStore = create<AdminUserState>((set, get) => ({
  adminUsers: [],
  selectedAdminUser: null,
  isLoading: false,
  error: null,

  fetchAdminUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/AdminUser/get-all-admins');
      const users: GetAdminUserResponse[] = response.data;
      
      // Parse names and add computed fields
      const parsedUsers = users.map(parseAdminUserName);
      
      set({ adminUsers: parsedUsers, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch admin users';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchAdminUserById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/AdminUser/get-admin/${id}`);
      const singleUser: GetSingleAdminUserResponse = response.data;
      
      // Store as GetSingleAdminUserResponse directly
      // We'll convert it to GetAdminUserResponse format with schoolId included
      const user: GetAdminUserResponse = {
        id: singleUser.id,
        name: `${singleUser.firstName} ${singleUser.lastName}`,
        schoolName: singleUser.schoolName,
        uin: singleUser.uin,
        phoneNumber: singleUser.phoneNumber,
        email: singleUser.email,
        password: singleUser.password || singleUser.passwordHash,
        firstName: singleUser.firstName,
        lastName: singleUser.lastName,
        gender: singleUser.gender,
        address: singleUser.address,
        schoolId: singleUser.schoolId,
        profilePictureUrl: singleUser.profilePictureUrl,
        role: 'Admin'
      };
      
      set({ selectedAdminUser: user, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch admin user details';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false, selectedAdminUser: null });
    }
  },

  getAdminUserById: (id: string) => {
    const { adminUsers } = get();
    return adminUsers.find(user => user.id === id);
  },

  createAdminUser: async (userData: CreateAdminUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('FirstName', userData.firstName);
      formData.append('LastName', userData.lastName);
      formData.append('Email', userData.email);
      formData.append('PhoneNumber', userData.phoneNumber);
      formData.append('Password', userData.password);
      formData.append('Gender', userData.gender);
      formData.append('Address', userData.address);
      formData.append('SchoolId', userData.schoolId);
      
      if (userData.profilePicture) {
        formData.append('ProfilePicture', userData.profilePicture);
      }

      await axiosInstance.post('/AdminUser/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the admin users list after creation
      await get().fetchAdminUsers();
      
      set({ isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to create admin user';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateAdminUser: async (userData: UpdateAdminUserRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Mock update - API integration will come later
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        adminUsers: state.adminUsers.map(user =>
          user.id === userData.id
            ? { ...user, ...userData, updatedAt: new Date().toISOString() }
            : user
        ),
        selectedAdminUser: state.selectedAdminUser?.id === userData.id
          ? { ...state.selectedAdminUser, ...userData, updatedAt: new Date().toISOString() }
          : state.selectedAdminUser,
        isLoading: false
      }));
    } catch (error: any) {
      let errorMessage = 'Failed to update admin user';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedAdminUser: (user: GetAdminUserResponse | null) => {
    set({ selectedAdminUser: user });
  },

  clearError: () => {
    set({ error: null });
  }
}));

