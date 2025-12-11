import axios from './axiosConfig';

// Récupérer les tickets achetés par le client
export const getMyTickets = async () => {
  // Récupérer l'userId depuis le localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }

  const response = await axios.get(`/tickets/client/${user.id}`);
  return response.data;
};

// Récupérer les abonnements actifs du client
export const getMyAbonnements = async () => {
  const response = await axios.get('/abonnements/mes-abonnements');
  return response.data;
};

// Récupérer les détails d'un trip
export const getTripDetails = async (tripId) => {
  const response = await axios.get(`/trajets/trips/${tripId}`);
  return response.data;
};

// Récupérer la dernière position d'un bus
export const getBusLatestLocation = async (busId) => {
  const response = await axios.get(`/geolocalisation/locations/latest?busId=${busId}`);
  return response.data;
};

// Récupérer les détails d'une ligne
export const getLigneDetails = async (ligneId) => {
  const response = await axios.get(`/trajets/lignes/${ligneId}`);
  return response.data;
};

// Calculer le temps estimé d'arrivée (ETA)
export const calculateETA = (currentLocation, destinationStation, averageSpeed = 30) => {
  if (!currentLocation || !destinationStation) return null;

  // Formule Haversine pour calculer la distance
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = currentLocation.latitude;
  const lon1 = currentLocation.longitude;
  const lat2 = destinationStation.latitude;
  const lon2 = destinationStation.longitude;

  const R = 6371; // Rayon de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance en km

  // Temps en heures = distance / vitesse
  const timeInHours = distance / averageSpeed;
  const timeInMinutes = Math.round(timeInHours * 60);

  return {
    distance: distance.toFixed(2),
    eta: timeInMinutes
  };
};
