import { create } from 'zustand';
import { GetSchoolResponse, CreateSchoolRequest, UpdateSchoolRequest } from '../types/school';
import axiosInstance from '../config/axios';


interface SchoolState {
  schools: GetSchoolResponse[];
  selectedSchool: GetSchoolResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSchools: () => Promise<void>;
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

  getSchoolById: (id: string) => {
    const { schools } = get();
    return schools.find(school => school.id === id);
  },

  createSchool: async (schoolData: CreateSchoolRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newSchool: GetSchoolResponse = {
        id: Date.now().toString(),
        ...schoolData,
        isSubscrptionActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      set(state => ({
        schools: [...state.schools, newSchool],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create school', isLoading: false });
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
