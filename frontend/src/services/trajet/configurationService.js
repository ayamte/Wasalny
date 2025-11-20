// API Service for Configuration Management - Wasalny
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

// Configuration Horaire Service
export const configurationService = {
  // Create new schedule configuration
  createConfiguration: async (lineId, configData) => {
    try {
      const response = await api.post(`/config-horaire`, {
        lineId,
        ...configData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get configuration by line
  getConfigurationByLine: async (lineId) => {
    try {
      const response = await api.get(`/config-horaire/ligne/${lineId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update configuration
  updateConfiguration: async (configId, configData) => {
    try {
      const response = await api.put(`/config-horaire/${configId}`, configData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete configuration
  deleteConfiguration: async (configId) => {
    try {
      const response = await api.delete(`/config-horaire/${configId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all configurations
  getAllConfigurations: async () => {
    try {
      const response = await api.get(`/config-horaire`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Simulate schedule
  simulateSchedule: async (configData) => {
    try {
      const response = await api.post(`/config-horaire/simuler`, configData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate trips from configuration
  generateTrips: async (configId) => {
    try {
      const response = await api.post(`/config-horaire/${configId}/generer-trips`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Ligne (Route) Service
export const ligneService = {
  // Get all lines
  getAllLines: async () => {
    try {
      const response = await api.get(`/lignes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get line by ID
  getLineById: async (lineId) => {
    try {
      const response = await api.get(`/lignes/${lineId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new line
  createLine: async (lineData) => {
    try {
      const response = await api.post(`/lignes`, lineData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update line
  updateLine: async (lineId, lineData) => {
    try {
      const response = await api.put(`/lignes/${lineId}`, lineData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete line
  deleteLine: async (lineId) => {
    try {
      const response = await api.delete(`/lignes/${lineId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Station Service
export const stationService = {
  // Get all stations
  getAllStations: async () => {
    try {
      const response = await api.get(`/stations`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get stations by line
  getStationsByLine: async (lineId) => {
    try {
      const response = await api.get(`/stations/ligne/${lineId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get station by ID
  getStationById: async (stationId) => {
    try {
      const response = await api.get(`/stations/${stationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create station
  createStation: async (stationData) => {
    try {
      const response = await api.post(`/stations`, stationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update station
  updateStation: async (stationId, stationData) => {
    try {
      const response = await api.put(`/stations/${stationId}`, stationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete station
  deleteStation: async (stationId) => {
    try {
      const response = await api.delete(`/stations/${stationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Bus Service
export const busService = {
  // Get all buses
  getAllBuses: async () => {
    try {
      const response = await api.get(`/buses`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get bus by ID
  getBusById: async (busId) => {
    try {
      const response = await api.get(`/buses/${busId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create bus
  createBus: async (busData) => {
    try {
      const response = await api.post(`/buses`, busData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update bus
  updateBus: async (busId, busData) => {
    try {
      const response = await api.put(`/buses/${busId}`, busData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete bus
  deleteBus: async (busId) => {
    try {
      const response = await api.delete(`/buses/${busId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

// Trip Service
export const tripService = {
  // Get all trips
  getAllTrips: async () => {
    try {
      const response = await api.get(`/trips`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get trip by ID
  getTripById: async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create trip
  createTrip: async (tripData) => {
    try {
      const response = await api.post(`/trips`, tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update trip status
  updateTripStatus: async (tripId, status) => {
    try {
      const response = await api.put(`/trips/${tripId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Start trip
  startTrip: async (tripId) => {
    try {
      const response = await api.post(`/trips/${tripId}/demarrer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // End trip
  endTrip: async (tripId) => {
    try {
      const response = await api.post(`/trips/${tripId}/terminer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get trips by date
  getTripsByDate: async (date) => {
    try {
      const response = await api.get(`/trips/date/${date}`);
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
    window.location.href = '/login';
  }
  return error.response?.data?.message || 'Une erreur est survenue';
};

export default api;
