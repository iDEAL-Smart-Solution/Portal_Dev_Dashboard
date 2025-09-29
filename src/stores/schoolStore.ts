import { create } from 'zustand';
import { GetSchoolResponse, CreateSchoolRequest, UpdateSchoolRequest } from '../types/school';

// Mock data for development
const mockSchools: GetSchoolResponse[] = [
  {
    id: '1',
    schoolName: 'Greenwood Elementary School',
    schoolLogoFilePath: '/logos/greenwood-logo.png',
    colorCode: '#4F46E5',
    address: '123 Education St, Learning City, LC 12345',
    phoneNumber: '+1 (555) 123-4567',
    email: 'info@greenwood.edu',
    isSubscrptionActive: true,
    userId: 'user1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    schoolName: 'Riverside High School',
    schoolLogoFilePath: '/logos/riverside-logo.png',
    colorCode: '#059669',
    address: '456 Knowledge Ave, Education Town, ET 67890',
    phoneNumber: '+1 (555) 987-6543',
    email: 'contact@riverside.edu',
    isSubscrptionActive: false,
    userId: 'user2',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z'
  },
  {
    id: '3',
    schoolName: 'Sunshine Middle School',
    colorCode: '#DC2626',
    address: '789 Learning Blvd, Study City, SC 54321',
    phoneNumber: '+1 (555) 456-7890',
    email: 'hello@sunshine.edu',
    isSubscrptionActive: true,
    userId: 'user3',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-19T13:30:00Z'
  }
];

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
  schools: mockSchools,
  selectedSchool: null,
  isLoading: false,
  error: null,

  fetchSchools: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ schools: mockSchools, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch schools', isLoading: false });
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
