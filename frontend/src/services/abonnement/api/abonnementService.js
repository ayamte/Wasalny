const API_BASE_URL = 'http://localhost:8080/api/abonnements';

export const abonnementService = {
  // Abonnements client
  getAbonnementsClient: async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/client/${clientId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des abonnements');
    return response.json();
  },

  getAbonnementActif: async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/client/${clientId}/actif`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    return response.json();
  },

  annulerAbonnement: async (abonnementId) => {
    const response = await fetch(`${API_BASE_URL}/${abonnementId}/annuler`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Erreur lors de l\'annulation');
    return response.json();
  },

  renouvelerAbonnement: async (abonnementId) => {
    const response = await fetch(`${API_BASE_URL}/${abonnementId}/renouveler`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Erreur lors du renouvellement');
    return response.json();
  },

  // Types d'abonnement
  getTypesAbonnement: async () => {
    const response = await fetch(`${API_BASE_URL}/types`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des types');
    return response.json();
  },

  getTypesAbonnementActifs: async () => {
    const response = await fetch(`${API_BASE_URL}/types/actifs`);
    if (!response.ok) throw new Error('Erreur lors de la récupération');
    return response.json();
  },

  creerTypeAbonnement: async (data) => {
    const response = await fetch(`${API_BASE_URL}/types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return response.json();
  }
};