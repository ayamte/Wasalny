import axios from 'axios';

// Configuration de base pour les appels API
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080';

// Création d'une instance axios configurée
const trajetApi = axios.create({
  baseURL: `${API_GATEWAY_URL}/api/trajets`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT automatiquement
trajetApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Aucun token trouvé pour la requête:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs (sans redirection automatique)
trajetApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas rediriger automatiquement en cas d'erreur 401
    // L'interface gère elle-même les erreurs
    return Promise.reject(error);
  }
);

/**
 * Service pour la gestion des bus
 */
export const busService = {
  /**
   * Récupère le bus assigné au conducteur actuel
   */
  getAssignedBus: async () => {
    try {
      const response = await trajetApi.get('/buses/assigned');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du bus assigné:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les bus
   */
  getAllBuses: async () => {
    try {
      const response = await trajetApi.get('/buses');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des bus:', error);
      throw error;
    }
  },

  /**
   * Récupère un bus par son ID
   */
  getBusById: async (busId) => {
    try {
      const response = await trajetApi.get(`/buses/${busId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du bus ${busId}:`, error);
      throw error;
    }
  }
};

/**
 * Service pour la gestion des trajets
 */
export const tripService = {
  /**
   * Récupère le trajet actif du conducteur
   */
  getActiveTrip: async () => {
    try {
      const response = await trajetApi.get('/trips/active');
      return response.data;
    } catch (error) {
      // Si pas de trajet actif (404), retourner null
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erreur lors de la récupération du trajet actif:', error);
      throw error;
    }
  },

  /**
   * Récupère le trajet assigné au conducteur (pré-planifié)
   */
  getAssignedTrip: async () => {
    try {
      const response = await trajetApi.get('/trips/assigned');
      return response.data;
    } catch (error) {
      // Si pas de trajet assigné (404), retourner null
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Erreur lors de la récupération du trajet assigné:', error);
      throw error;
    }
  },

  /**
   * Démarre un nouveau trajet
   */
  startTrip: async (tripData) => {
    try {
      const response = await trajetApi.post('/trips/start', tripData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du démarrage du trajet:', error);
      throw error;
    }
  },

  /**
   * Confirme l'arrivée à une station
   */
  confirmArrival: async (tripId, stationId, locationData = null) => {
    try {
      const payload = { stationId };
      if (locationData) {
        payload.location = locationData;
      }
      const response = await trajetApi.post(`/trips/${tripId}/confirm-arrival`, payload);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la confirmation d\'arrivée:', error);
      throw error;
    }
  },

  /**
   * Termine un trajet
   */
  endTrip: async (tripId) => {
    try {
      const response = await trajetApi.post(`/trips/${tripId}/end`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la fin du trajet:', error);
      throw error;
    }
  },

  /**
   * Met à jour la position du bus
   */
  updateLocation: async (tripId, locationData) => {
    try {
      const response = await trajetApi.post(`/trips/${tripId}/location`, locationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la position:', error);
      throw error;
    }
  },

  /**
   * Recherche des trips entre deux stations pour une date donnée
   */
  searchTrips: async (stationDepartId, stationArriveeId, date) => {
    try {
      const response = await trajetApi.post('/trips/rechercher', {
        stationDepartId,
        stationArriveeId,
        date
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de trips:', error);
      throw error;
    }
  },

  /**
   * Récupère tous les trips d'une date donnée
   */
  getTripsByDate: async (date) => {
    try {
      const response = await trajetApi.get(`/trips/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des trips par date:', error);
      throw error;
    }
  },

  /**
   * Supprimer un trip
   */
  supprimerTrip: async (tripId) => {
    try {
      await trajetApi.delete(`/trips/${tripId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du trip:', error);
      throw error;
    }
  },

  /**
   * Obtenir tous les trips avec filtres
   */
  obtenirTripsAvecFiltres: async (params) => {
    try {
      const response = await trajetApi.get('/trips', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des trips:', error);
      throw error;
    }
  },

  /**
   * Modifier un trip
   */
  modifierTrip: async (tripId, updateData) => {
    try {
      const response = await trajetApi.put(`/trips/${tripId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification du trip:', error);
      throw error;
    }
  }
};

/**
 * Service pour la gestion des lignes
 */
export const ligneService = {
  /**
   * Récupère toutes les lignes
   */
  getAllLines: async () => {
    try {
      const response = await trajetApi.get('/lignes');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes:', error);
      throw error;
    }
  },

  /**
   * Récupère une ligne par son ID
   */
  getLineById: async (lineId) => {
    try {
      const response = await trajetApi.get(`/lignes/${lineId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ligne ${lineId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les stations d'une ligne
   */
  getLineStations: async (lineId) => {
    try {
      const response = await trajetApi.get(`/lignes/${lineId}/stations`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des stations de la ligne ${lineId}:`, error);
      throw error;
    }
  }
};

/**
 * Service pour la gestion des stations
 */
export const stationService = {
  /**
   * Récupère toutes les stations
   */
  getAllStations: async () => {
    try {
      const response = await trajetApi.get('/stations');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des stations:', error);
      throw error;
    }
  },

  /**
   * Récupère une station par son ID
   */
  getStationById: async (stationId) => {
    try {
      const response = await trajetApi.get(`/stations/${stationId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la station ${stationId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les stations d'une ligne
   */
  getStationsByLine: async (ligneId) => {
    try {
      const response = await trajetApi.get(`/stations/ligne/${ligneId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des stations de la ligne ${ligneId}:`, error);
      throw error;
    }
  }
};

/**
 * Service pour la gestion des configurations horaires
 */
export const configurationHoraireService = {
  /**
   * Crée une nouvelle configuration horaire
   */
  creerConfiguration: async (configData) => {
    try {
      const response = await trajetApi.post('/configurations-horaires', configData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la configuration:', error);
      throw error;
    }
  },

  /**
   * Récupère une configuration par son ID
   */
  obtenirConfiguration: async (id) => {
    try {
      const response = await trajetApi.get(`/configurations-horaires/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les configurations d'une ligne
   */
  obtenirConfigurationsParLigne: async (ligneId) => {
    try {
      const response = await trajetApi.get(`/configurations-horaires/ligne/${ligneId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des configurations de la ligne:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les configurations
   */
  obtenirToutesConfigurations: async () => {
    try {
      const response = await trajetApi.get('/configurations-horaires');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les configurations:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les configurations actives
   */
  obtenirConfigurationsActives: async () => {
    try {
      const response = await trajetApi.get('/configurations-horaires/actives');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des configurations actives:', error);
      throw error;
    }
  },

  /**
   * Met à jour une configuration
   */
  mettreAJourConfiguration: async (id, configData) => {
    try {
      const response = await trajetApi.put(`/configurations-horaires/${id}`, configData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la configuration:', error);
      throw error;
    }
  },

  /**
   * Supprime une configuration
   */
  supprimerConfiguration: async (id) => {
    try {
      await trajetApi.delete(`/configurations-horaires/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la configuration:', error);
      throw error;
    }
  },

  /**
   * Active une configuration
   */
  activerConfiguration: async (id) => {
    try {
      await trajetApi.post(`/configurations-horaires/${id}/activer`);
    } catch (error) {
      console.error('Erreur lors de l\'activation de la configuration:', error);
      throw error;
    }
  },

  /**
   * Désactive une configuration
   */
  desactiverConfiguration: async (id) => {
    try {
      await trajetApi.post(`/configurations-horaires/${id}/desactiver`);
    } catch (error) {
      console.error('Erreur lors de la désactivation de la configuration:', error);
      throw error;
    }
  },

  /**
   * Génère les trips d'une journée à partir d'une configuration
   */
  genererTripsJournee: async (configId, date) => {
    try {
      const response = await trajetApi.post(
        `/configurations-horaires/${configId}/generer-trips`,
        null,
        { params: { date } }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération des trips:', error);
      throw error;
    }
  },

  /**
   * Génère les trips pour une période (plusieurs jours) à partir d'une configuration
   */
  genererTripsPeriode: async (configId, dateDebut, dateFin) => {
    try {
      const response = await trajetApi.post(
        `/configurations-horaires/${configId}/generer-trips-periode`,
        null,
        { params: { dateDebut, dateFin } }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération des trips pour la période:', error);
      throw error;
    }
  }
};

/**
 * Fonction utilitaire pour gérer les erreurs API
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return 'Données invalides';
      case 401:
        return 'Non autorisé - Veuillez vous reconnecter';
      case 403:
        return 'Accès refusé';
      case 404:
        return 'Ressource non trouvée';
      case 500:
        return 'Erreur serveur interne';
      default:
        return data?.message || `Erreur ${status}`;
    }
  } else if (error.request) {
    // Erreur de réseau
    return 'Erreur de connexion réseau';
  } else {
    // Autre erreur
    return error.message || 'Une erreur inconnue s\'est produite';
  }
};

export default {
  busService,
  tripService,
  ligneService,
  stationService,
  configurationHoraireService,
  handleApiError
};