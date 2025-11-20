export const canAnnuler = (abonnement) => abonnement.statut === 'ACTIF';

export const canRenouveler = (abonnement) => abonnement.statut === 'EXPIRE';

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR');
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('fr-FR');
};

export const calculateJoursRestants = (dateFin) => {
  return Math.ceil((new Date(dateFin) - new Date()) / (1000 * 60 * 60 * 24));
};