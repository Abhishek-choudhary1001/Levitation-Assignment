import axios from 'axios';

// Create axios instance with baseURL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', // fallback to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, add interceptors here for auth, errors, etc.

export default api;
