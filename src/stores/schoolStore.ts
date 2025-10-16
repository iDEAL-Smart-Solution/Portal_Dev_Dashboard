import { create } from 'zustand';
import { GetSchoolResponse, CreateSchoolRequest, UpdateSchoolRequest, GetSingleSchoolWithSubs } from '../types/school';
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
  updateSchoolSubscription: (id: string, isActive: boolean) => Promise<void>;
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
      const response = await axiosInstance.get(`/School/get-by-id?id=${id}`);
      const schoolDetails: GetSingleSchoolWithSubs = response.data.data;
      set({ selectedSchoolDetails: schoolDetails, isLoading: false });
    } catch (error: any) {
      let errorMessage = 'Failed to fetch school details';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set(state => ({
        schools: state.schools.map(school =>
          school.id === schoolData.id
            ? { ...school, ...schoolData, updatedAt: new Date().toISOString() }
            : school
        ),
        selectedSchool: state.selectedSchool?.id === schoolData.id
          ? { ...state.selectedSchool, ...schoolData, updatedAt: new Date().toISOString() }
          : state.selectedSchool,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update school', isLoading: false });
    }
  },

  updateSchoolSubscription: async (id: string, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        schools: state.schools.map(school =>
          school.id === id
            ? { ...school, isSubscrptionActive: isActive, updatedAt: new Date().toISOString() }
            : school
        ),
        selectedSchool: state.selectedSchool?.id === id
          ? { ...state.selectedSchool, isSubscrptionActive: isActive, updatedAt: new Date().toISOString() }
          : state.selectedSchool,
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update subscription', isLoading: false });
    }
  },

  setSelectedSchool: (school: GetSchoolResponse | null) => {
    set({ selectedSchool: school });
  },

  clearError: () => {
    set({ error: null });
  }
}));
