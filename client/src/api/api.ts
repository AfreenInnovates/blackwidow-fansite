import axios, { AxiosRequestConfig, AxiosError } from 'axios';

const backendURL = 'http://localhost:3000';

const api = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => {
    return status >= 200 && status < 300;
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // If the response indicates mock data, log it in development
    if (response.data?.mock && process.env.NODE_ENV === 'development') {
      console.log('Using mock data:', response.config.url);
    }
    // Return the actual data regardless if it's mock or real
    return response.data?.data || response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 404) {
      console.error('API endpoint not found:', error.config?.url);
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to backend server');
    } else {
      console.error('API error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;