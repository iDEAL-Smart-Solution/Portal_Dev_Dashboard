import { create } from 'zustand';
import { GetSchoolResponse, CreateSchoolRequest, UpdateSchoolRequest, GetSingleSchoolWithSubs, UpdateSubscriptionRequest } from '../types/school';
import axiosInstance from '../config/axios';


interface SchoolState {
  schools: GetSchoolResponse[];
  selectedSchool: GetSchoolResponse | null;
  selectedSchoolDetails: GetSingleSchoolWithSubs | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSchools: () => Promise<void>;
  fetchSchoolById: (id: string) => Promise<void>;
  getSchoolById: (id: string) => GetSchoolResponse | undefined;
  createSchool: (schoolData: CreateSchoolRequest) => Promise<void>;
  updateSchool: (schoolData: UpdateSchoolRequest) => Promise<void>;
  updateSchoolSubscription: (data: UpdateSubscriptionRequest) => Promise<void>;
  setSelectedSchool: (school: GetSchoolResponse | null) => void;
  clearError: () => void;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  schools: [],
  selectedSchool: null,
  selectedSchoolDetails: null,
  isLoading: false,
  error: null,

  fetchSchools: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/School/get-all');
      const schools: GetSchoolResponse[] = response.data;
      set({ schools, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch schools';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSchoolById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Fetching school with ID:', id);
      const response = await axiosInstance.get(`/School/get-by-id?id=${id}`);
      // Handle both response.data.data and response.data structures
      const schoolDetails: GetSingleSchoolWithSubs = response.data.data || response.data;
      console.log('Fetched school details:', schoolDetails);
      set({ selectedSchoolDetails: schoolDetails, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch school details';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Error fetching school by ID:', error);
      set({ error: errorMessage, isLoading: false, selectedSchoolDetails: null });
    }
  },

  getSchoolById: (id: string) => {
    const { schools } = get();
    return schools.find(school => school.id === id);
  },

  createSchool: async (schoolData: CreateSchoolRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('SchoolName', schoolData.schoolName);
      formData.append('UserId', schoolData.userId);
      
      if (schoolData.schoolLogoFilePath) {
        formData.append('SchoolLogoFilePath', schoolData.schoolLogoFilePath);
      }
      if (schoolData.colorCode) {
        formData.append('ColorCode', schoolData.colorCode);
      }
      if (schoolData.address) {
        formData.append('Address', schoolData.address);
      }
      if (schoolData.phoneNumber) {
        formData.append('PhoneNumber', schoolData.phoneNumber);
      }
      if (schoolData.email) {
        formData.append('Email', schoolData.email);
      }
      if (schoolData.domain) {
        formData.append('Domain', schoolData.domain);
      }

        await axiosInstance.post('/School/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the schools list after creation
      await get().fetchSchools();
      
      set({ isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to create school';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

    updateSchool: async (schoolData: UpdateSchoolRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/School/update', schoolData);
      await get().fetchSchools();
      set({ isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to update school';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateSchoolSubscription: async (data: UpdateSubscriptionRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put('/Subscription/update-subscription', data);
      console.log('Subscription updated successfully:', response.data);
      set({ isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to update subscription';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Error updating subscription:', error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedSchool: (school: GetSchoolResponse | null) => {
    set({ selectedSchool: school });
  },

  clearError: () => {
    set({ error: null });
  }
}));
