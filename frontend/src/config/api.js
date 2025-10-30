// API Configuration for different environments
const getApiBaseUrl = () => {
  // In production, use environment variable or default to relative path
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || '/api';
  }
  // In development, use local backend
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  ATTENDANCE: `${API_BASE_URL}/attendance`,
  ATTENDANCE_BY_DATE: (date) => `${API_BASE_URL}/attendance/date/${date}`,
  ATTENDANCE_SEARCH: (query) => `${API_BASE_URL}/attendance/search/${query}`,
  ATTENDANCE_STATS: `${API_BASE_URL}/attendance/stats/summary`,
  ATTENDANCE_DELETE: (id) => `${API_BASE_URL}/attendance/${id}`
};

// API configuration
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};
