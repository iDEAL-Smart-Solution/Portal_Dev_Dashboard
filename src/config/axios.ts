import axios from 'axios';

// const BASE_URL = 'http://localhost:5093/api/';
const BASE_URL = 'https://ideal-portal-djhvgncsgdb6fxc5.westus-01.azurewebsites.net/api/';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    const schoolId = sessionStorage.getItem('SchoolId');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      config.headers['SchoolID'] = schoolId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
