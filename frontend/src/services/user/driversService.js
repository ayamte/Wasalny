// Drivers Service - Wasalny
import axios from 'axios';

// Get API Gateway URL from environment variable or use default
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
const API_BASE_URL = `${API_GATEWAY_URL}/api`;
const USER_SERVICE_URL = `${API_BASE_URL}/users`;

const api = axios.create({
  baseURL: USER_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Drivers Service
export const driversService = {
  /**
   * Get all drivers (ADMIN only)
   * @returns {Promise} List of drivers
   */
  getAllDrivers: async () => {
    try {
      const response = await api.get('/admin/users/role/CONDUCTEUR', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        params: {
          _t: new Date().getTime() // Add timestamp to prevent caching
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get driver by ID (ADMIN only)
   * @param {string} driverId - UUID of the driver
   * @returns {Promise} Driver details
   */
  getDriverById: async (driverId) => {
    try {
      const response = await api.get(`/${driverId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get driver profile by email (ADMIN only)
   * @param {string} email - Driver's email
   * @returns {Promise} Driver profile
   */
  getDriverByEmail: async (email) => {
    try {
      const response = await api.get(`/conducteur/profile`, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create new driver (ADMIN only)
   * Calls user-service admin endpoint to create conducteur
   * @param {Object} driverData - Driver data
   * @returns {Promise} Created driver
   */
  createDriver: async (driverData) => {
    try {
      // Call user-service admin endpoint to create conducteur
      const response = await api.post('/admin/conducteur/create', {
        username: driverData.username,
        email: driverData.email,
        password: driverData.password,
        nom: driverData.lastName,
        prenom: driverData.firstName,
        telephone: driverData.phone,
        numeroPermis: driverData.licenseNumber,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update driver profile (ADMIN only)
   * @param {string} email - Driver's email
   * @param {Object} driverData - Updated driver data
   * @returns {Promise} Updated driver
   */
  updateDriver: async (email, driverData) => {
    try {
      const response = await api.put('/conducteur/profile',
        {
          nom: driverData.lastName,
          prenom: driverData.firstName,
          telephone: driverData.phone,
          numeroPermis: driverData.licenseNumber,
        },
        {
          params: { email }
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete driver (ADMIN only)
   * @param {string} email - Driver's email
   * @returns {Promise} Deletion confirmation
   */
  deleteDriver: async (email) => {
    try {
      const response = await api.delete(`/admin/users/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Activate driver (ADMIN only)
   * @param {string} email - Driver's email
   * @returns {Promise} Activation confirmation
   */
  activateDriver: async (email) => {
    try {
      const response = await api.put(`/admin/conducteur/${email}/status`, null, {
        params: { statut: 'ACTIF' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Deactivate driver (ADMIN only)
   * @param {string} email - Driver's email
   * @returns {Promise} Deactivation confirmation
   */
  deactivateDriver: async (email) => {
    try {
      const response = await api.put(`/admin/conducteur/${email}/status`, null, {
        params: { statut: 'INACTIF' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Error handling utility
export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
  // Handle different error response formats
  if (error.response?.data) {
    // Check for error field
    if (error.response.data.error) {
      return error.response.data.error;
    }
    // Check for message field
    if (error.response.data.message) {
      return error.response.data.message;
    }
  }
  // Fallback to generic error message
  return error.message || 'Une erreur est survenue';
};

export default api;
