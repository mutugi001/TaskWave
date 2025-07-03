import axios, { AxiosInstance } from 'axios'; // Import AxiosInstance type

// Get backend URL from environment variables
const API_BASE_URL: string = import.meta.env.VITE_BACKEND_URL

const token = localStorage.getItem('accessToken');
// Explicitly type the apiClient instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Crucial for Sanctum cookie auth
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
     Authorization: `Bearer ${token}`,
  }
});

// apiClient.interceptors.request.use(
//   config => {
//     console.log('Axios Request Config Headers:', config.headers);
//     // Check specifically if X-XSRF-TOKEN is present here
//     if (config.headers) {
//          console.log('Does config.headers have X-XSRF-TOKEN?', config.headers['X-XSRF-TOKEN']);
//     }
//     return config; // Must return config for request to proceed
//   },
//   error => {
//     console.error('Axios Request Interceptor Error:', error);
//     return Promise.reject(error);
//   }
// );
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for potential error handling (optional but good practice)
apiClient.interceptors.response.use(
  response => response, // Pass successful responses through
  error => {
    // Handle specific errors globally if desired
    // e.g., if (error.response?.status === 401) { /* redirect to login */ }
    console.error("API call error:", error);
    return Promise.reject(error); // Important: Reject the promise so '.catch()' works downstream
  }
);

export default apiClient;
