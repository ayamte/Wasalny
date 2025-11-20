const API_BASE_URL = 'http://localhost:8080/api/tickets';

export const ticketService = {
  getTicketsClient: async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/client/${clientId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des tickets');
    return response.json();
  },

  getTicket: async (ticketId) => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}`);
    if (!response.ok) throw new Error('Ticket introuvable');
    return response.json();
  },

  annulerTicket: async (ticketId) => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/annuler`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Erreur lors de l\'annulation');
    return response.json();
  },

  rembourserTicket: async (ticketId) => {
    const response = await fetch(`${API_BASE_URL}/${ticketId}/rembourser`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Erreur lors du remboursement');
    return response.json();
  }
};