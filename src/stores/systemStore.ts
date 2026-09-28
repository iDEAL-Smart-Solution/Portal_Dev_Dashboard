import { create } from 'zustand';
import axiosInstance from '../config/axios';

export interface StudentCostConfig {
  pricePerStudent: number;
  updatedAt: string;
}

interface SystemState {
  costConfig: StudentCostConfig | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStudentCostConfig: () => Promise<void>;
  createStudentCostConfig: (pricePerStudent: number) => Promise<void>;
  updateStudentCostConfig: (pricePerStudent: number) => Promise<void>;
  clearError: () => void;
}

export const useSystemStore = create<SystemState>((set) => ({
  costConfig: null,
  isLoading: false,
  error: null,

  fetchStudentCostConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<StudentCostConfig>(
        '/Subscription/student-cost-config'
      );
      set({ costConfig: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch student cost configuration';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createStudentCostConfig: async (pricePerStudent: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<{ success: boolean; message: string }>(
        '/Subscription/student-cost-config',
        { pricePerStudent }
      );
      if (response.data.success) {
        // Re-fetch to get the persisted record with updatedAt
        const getResponse = await axiosInstance.get<StudentCostConfig>(
          '/Subscription/student-cost-config'
        );
        set({ costConfig: getResponse.data, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to create student cost configuration';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateStudentCostConfig: async (pricePerStudent: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch<{ success: boolean; message: string }>(
        '/Subscription/student-cost-config',
        { pricePerStudent }
      );
      if (response.data.success) {
        // Re-fetch to get the updated record with fresh updatedAt
        const getResponse = await axiosInstance.get<StudentCostConfig>(
          '/Subscription/student-cost-config'
        );
        set({ costConfig: getResponse.data, isLoading: false });
      } else {
        set({ error: response.data.message, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to update student cost configuration';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
