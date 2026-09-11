import axios from 'axios';
import { getErrorMessage, showError, showSuccess } from '../lib/notifications';

// const BASE_URL = 'http://localhost:5093/api/';
export const BASE_URL = "https://portal-api.idealsmartsolutions.com/api";

const isDevRole = (role?: string) => {
  const normalizedRole = role?.trim().toLowerCase();
  return normalizedRole === 'dev' || normalizedRole === 'developer';
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const SUCCESS_METHODS = new Set(['post', 'put', 'patch', 'delete']);

const getResponseMessage = (data: any): string | undefined => {
  if (!data) return undefined;
  if (typeof data === 'string') return data;
  return data.message || data.details || data.error;
};

const isAuthLoginRequest = (config?: any) => {
  const requestUrl = String(config?.url || '').toLowerCase();
  return requestUrl.includes('/auth/login');
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    const schoolId = sessionStorage.getItem('SchoolId');
    const authStorage = sessionStorage.getItem('auth-storage');

    if (token && authStorage) {
      try {
        const parsedAuthStorage = JSON.parse(authStorage);
        const role = parsedAuthStorage?.state?.user?.role;

        if (role && !isDevRole(role)) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('SchoolId');
          sessionStorage.removeItem('auth-storage');
          return Promise.reject(new Error('Access denied. Only Developer accounts can access this dashboard.'));
        }
      } catch {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('SchoolId');
        sessionStorage.removeItem('auth-storage');
        return Promise.reject(new Error('Invalid session data. Please login again.'));
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (schoolId) {
      config.headers['SchoolID'] = schoolId;
    }

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const schoolDomain = sessionStorage.getItem('schoolDomain') || 'admin-portal';
      config.headers['X-School-Domain'] = schoolDomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toLowerCase();
    const shouldShowSuccess = method ? SUCCESS_METHODS.has(method) && !isAuthLoginRequest(response.config) : false;

    if (shouldShowSuccess) {
      const message = getResponseMessage(response.data) || 'Operation completed successfully';
      showSuccess(message);
    }

    return response;
  },
  (error) => {
    showError(getErrorMessage(error));
    return Promise.reject(error);
  }
);

export default axiosInstance;
