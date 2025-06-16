import axios from 'axios';
import { store } from '../store';
import { logoutSuccess } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "ngrok-skip-browser-warning": "*",
    'Content-Type': 'application/json',
  },
});

// Queue to store failed requests during token refresh
let isRefreshing = false;
let failedQueue = [];

// Process the queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    console.error('API Error:', error);
    
    const originalRequest = error.config;
    
    // Check if error is 401 and related to expired access token
    if (error.response?.status === 401  &&
        !originalRequest._retry) {
      
      console.log('Access token expired, starting refresh process...');
      
      if (isRefreshing) {
        console.log('Token refresh already in progress, queuing request...');
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          console.log('Retrying queued request after token refresh...');
          return api(originalRequest);
        }).catch(err => {
          console.error('Failed to retry queued request:', err);
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh token...');
        
        // Attempt to refresh the token
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );
        
        console.log('Token refreshed successfully:', response.data);
        
        // Process all queued requests
        processQueue(null, response.data.token);
        isRefreshing = false;
        
        // Retry the original request
        console.log('Retrying original request after token refresh...');
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Process queue with error
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Dispatch logout action
        console.log('Logging out user due to refresh failure...');
        store.dispatch(logoutSuccess());
        
        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  },
);

const apiDefaultUpload = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Test function to verify token refresh functionality
// You can call this from browser console: window.testTokenRefresh()
const testTokenRefresh = async () => {
  try {
    console.log('Testing token refresh functionality...');
    
    // Make a request to a protected endpoint
    const response = await api.get('/auth/me');
    console.log('Protected endpoint response:', response);
    
    return response;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  window.testTokenRefresh = testTokenRefresh;
}

export { api, apiDefaultUpload, testTokenRefresh };
