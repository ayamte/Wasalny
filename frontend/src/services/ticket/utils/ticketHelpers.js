export const canAnnuler = (ticket) => ticket.statut === 'ACHETE';

export const canRembourser = (ticket) => ticket.statut === 'ANNULE';

export const formatDate = (date) => {
  return new Date(date).toLocaleString('fr-FR');
};