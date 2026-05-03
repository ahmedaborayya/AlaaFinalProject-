import axios from 'axios';

export const BACKEND_URL = 'http://localhost:5000';

const API = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Converts a relative image path like "/uploads/products/..." 
 * into a full URL like "http://localhost:5000/uploads/products/..."
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path; // already absolute
  return `${BACKEND_URL}${path}`;
}

export default API;
