// Bus Assignment Service - Wasalny
import axios from 'axios';

// Get API Gateway URL from environment variable or use default
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';
const API_BASE_URL = `${API_GATEWAY_URL}/api`;
const TRAJET_SERVICE_URL = `${API_BASE_URL}/trajets`;

const api = axios.create({
  baseURL: TRAJET_SERVICE_URL,
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

// Bus Assignment Service
export const busAssignmentService = {
  /**
   * Assign a bus to a line with a departure station (ADMIN only)
   * @param {Object} assignmentData - Assignment data
   * @param {string} assignmentData.busId - UUID of the bus
   * @param {string} assignmentData.ligneId - UUID of the line
   * @param {string} assignmentData.stationDepartId - UUID of the departure station
   * @returns {Promise} Created assignment
   */
  assignBus: async (assignmentData) => {
    try {
      const response = await api.post('/bus-assignments', {
        busId: assignmentData.busId,
        ligneId: assignmentData.ligneId,
        stationDepartId: assignmentData.stationDepartId,
        stationArriveeId: assignmentData.stationArriveeId,
        heureDepartAller: assignmentData.heureDepartAller ? `${assignmentData.heureDepartAller}:00` : null,
        heureDepartRetour: assignmentData.heureDepartRetour ? `${assignmentData.heureDepartRetour}:00` : null,
        commenceAStationDepart: assignmentData.commenceAStationDepart !== undefined ? assignmentData.commenceAStationDepart : true,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all assignments for a specific line
   * @param {string} ligneId - UUID of the line
   * @returns {Promise} List of assignments
   */
  getAssignmentsByLine: async (ligneId) => {
    try {
      const response = await api.get(`/bus-assignments/ligne/${ligneId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Deactivate a bus assignment (ADMIN only)
   * @param {string} assignmentId - UUID of the assignment
   * @returns {Promise} Deactivation confirmation
   */
  deactivateAssignment: async (assignmentId) => {
    try {
      const response = await api.put(`/bus-assignments/${assignmentId}/desactiver`);
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
  return error.response?.data?.message || error.message || 'Une erreur est survenue';
};

export default api;
