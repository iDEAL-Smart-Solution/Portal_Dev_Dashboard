import axios from 'axios';

const BASE_URL = 'http://localhost:5093/api/';
// const BASE_URL = 'https://ideal-portal-djhvgncsgdb6fxc5.westus-01.azurewebsites.net/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    const schoolId = sessionStorage.getItem('SchoolId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Only add SchoolID if it exists (admin dashboard might not have it)
    if (schoolId) {
      config.headers['SchoolID'] = schoolId;
    }

    // Add X-School-Domain header for localhost development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const schoolDomain = sessionStorage.getItem('schoolDomain') || 'admin-portal';
      config.headers['X-School-Domain'] = schoolDomain;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
