import axios from 'axios';

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

export const assignationBusConducteurService = {
  /**
   * Create bus-driver assignment
   * @param {Object} assignmentData
   * @param {string} assignmentData.busId - UUID
   * @param {string} assignmentData.conducteurId - UUID
   * @param {string} assignmentData.dateDebut - ISO date string
   * @param {string} assignmentData.dateFin - ISO date string
   */
  createAssignment: async (assignmentData) => {
    try {
      const response = await api.post('/assignations', assignmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all assignments for a bus
   * @param {string} busId - UUID
   */
  getAssignmentsByBus: async (busId) => {
    try {
      const response = await api.get(`/assignations/bus/${busId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get active assignment for a bus on a specific date
   * @param {string} busId - UUID
   * @param {string} date - ISO date string
   */
  getActiveAssignment: async (busId, date) => {
    try {
      const response = await api.get(`/assignations/bus/${busId}/active`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get all assignments for a driver
   * @param {string} conducteurId - UUID
   */
  getAssignmentsByDriver: async (conducteurId) => {
    try {
      const response = await api.get(`/assignations/conducteur/${conducteurId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Deactivate an assignment
   * @param {string} assignmentId - UUID
   */
  deactivateAssignment: async (assignmentId) => {
    try {
      const response = await api.put(`/assignations/${assignmentId}/desactiver`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Activate an assignment
   * @param {string} assignmentId - UUID
   */
  activateAssignment: async (assignmentId) => {
    try {
      const response = await api.put(`/assignations/${assignmentId}/activer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export const handleApiError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
  return error.response?.data?.message || error.message || 'Une erreur est survenue';
};
