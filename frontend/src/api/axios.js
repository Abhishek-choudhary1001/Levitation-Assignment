import axios from 'axios';

// Create axios instance with baseURL from environment variable
const api = axios.create({
  baseURL: 'https://levitation-assignment-12.onrender.com' , // fallback to localhost
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally, add interceptors here for auth, errors, etc.

export default api;
