import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../config/axios';
import { LoginRequest, GetUser } from '../types/auth';

const isDevRole = (role?: string) => {
  const normalizedRole = role?.trim().toLowerCase();
  return normalizedRole === 'dev' || normalizedRole === 'developer';
};

interface AuthState {
  isAuthenticated: boolean;
  user: GetUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axiosInstance.post('/Auth/login', credentials);
          const { success, data, message } = response.data;

          if (success && data) {
            if (!isDevRole(data.user.role)) {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('SchoolId');

              set({
                isAuthenticated: false,
                user: null,
                token: null,
                isLoading: false,
                error: 'Access denied. Only Developer accounts can access this dashboard.',
              });

              return false;
            }

            // Store token and school ID in session storage
            sessionStorage.setItem('token', data.token);
            if (data.user.schoolId) {
              sessionStorage.setItem('SchoolId', data.user.schoolId);
            }

            set({
              isAuthenticated: true,
              user: data.user,
              token: data.token,
              isLoading: false,
              error: null,
            });

            return true;
          } else {
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              isLoading: false,
              error: message || 'Login failed',
            });
            return false;
          }
        } catch (error: any) {
          let errorMessage = 'Login failed. Please try again.';
          
          if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }

          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: errorMessage,
          });
          
          return false;
        }
      },

      logout: () => {
        // Clear session storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('SchoolId');
        
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (!state?.user || isDevRole(state.user.role)) {
          return;
        }

        sessionStorage.removeItem('token');
        sessionStorage.removeItem('SchoolId');

        state.logout();
      },
      // Only persist essential data, not sensitive information
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
