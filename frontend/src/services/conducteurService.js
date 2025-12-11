import axios from './axiosConfig';

/**
 * Service pour gérer les données du conducteur
 */

/**
 * Obtenir les assignations (bus assignés) pour un conducteur
 */
export const getAssignationsConducteur = async (conducteurId) => {
  try {
    const url = `/api/trajets/assignations/conducteur/${conducteurId}`;
    console.log('Calling API:', url);
    console.log('Full URL:', axios.defaults.baseURL + url);
    const response = await axios.get(url);
    console.log('Assignations response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des assignations du conducteur:', error);
    console.error('URL appelée:', `/api/trajets/assignations/conducteur/${conducteurId}`);
    console.error('Status:', error.response?.status);
    console.error('Response:', error.response?.data);
    throw error;
  }
};

/**
 * Obtenir les trips d'un bus pour une date donnée
 */
export const getTripsByBusAndDate = async (busId, date) => {
  try {
    const response = await axios.get(`/api/trajets/trips/bus/${busId}/date/${date}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des trips du bus:', error);
    throw error;
  }
};

/**
 * Obtenir l'assignation active d'un bus pour une date
 */
export const getAssignationActive = async (busId, date) => {
  try {
    const response = await axios.get(`/api/trajets/assignations/bus/${busId}/active`, {
      params: { date }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // Pas d'assignation active
    }
    console.error('Erreur lors de la récupération de l\'assignation active:', error);
    throw error;
  }
};

/**
 * Démarrer un trip
 */
export const demarrerTrip = async (tripId) => {
  try {
    const response = await axios.post(`/api/trajets/trips/${tripId}/demarrer`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du démarrage du trip:', error);
    throw error;
  }
};

/**
 * Terminer un trip
 */
export const terminerTrip = async (tripId) => {
  try {
    const response = await axios.post(`/api/trajets/trips/${tripId}/terminer`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la fin du trip:', error);
    throw error;
  }
};

/**
 * Confirmer le passage à une station
 */
export const confirmerPassage = async (tripId, stationId, heureReelle) => {
  try {
    const response = await axios.post(`/api/trajets/trips/${tripId}/confirmer-passage`, {
      stationId,
      heureReelle
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la confirmation du passage:', error);
    throw error;
  }
};

/**
 * Obtenir les passages d'un trip
 */
export const getPassagesByTrip = async (tripId) => {
  try {
    const response = await axios.get(`/api/trajets/passages/trip/${tripId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des passages:', error);
    throw error;
  }
};

/**
 * Obtenir les passages non confirmés d'un trip
 */
export const getPassagesNonConfirmes = async (tripId) => {
  try {
    const response = await axios.get(`/api/trajets/passages/trip/${tripId}/non-confirmes`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des passages non confirmés:', error);
    throw error;
  }
};

/**
 * Mettre à jour la localisation du bus
 */
export const updateBusLocation = async (tripId, latitude, longitude) => {
  try {
    const response = await axios.post(`/api/trajets/trips/${tripId}/update-location`, {
      latitude,
      longitude
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la localisation:', error);
    throw error;
  }
};

/**
 * Obtenir un trip par ID
 */
export const getTripById = async (tripId) => {
  try {
    const response = await axios.get(`/api/trajets/trips/${tripId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du trip:', error);
    throw error;
  }
};

/**
 * Obtenir le trip assigné au conducteur actuel (prochain trip planifié)
 */
export const getTripAssigne = async () => {
  try {
    const response = await axios.get('/trajets/trips/assigned');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du trip assigné:', error);
    throw error;
  }
};

/**
 * Obtenir le trip actif (en cours) du conducteur actuel
 */
export const getTripActif = async () => {
  try {
    const response = await axios.get('/trajets/trips/active');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du trip actif:', error);
    throw error;
  }
};
