const API_BASE_URL = 'http://localhost:8080/api/paiements';

export const paiementService = {
  initierPaiement: async (data) => {
    const response = await fetch(`${API_BASE_URL}/initier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erreur lors de l\'initiation du paiement');
    return response.json();
  },

  traiterPaiement: async (transactionId) => {
    const response = await fetch(`${API_BASE_URL}/${transactionId}/traiter`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Erreur lors du traitement du paiement');
    return response.json();
  },

  getTransaction: async (transactionId) => {
    const response = await fetch(`${API_BASE_URL}/${transactionId}`);
    if (!response.ok) throw new Error('Transaction introuvable');
    return response.json();
  },

  getTransactionsClient: async (clientId) => {
    const response = await fetch(`${API_BASE_URL}/client/${clientId}`);
    if (!response.ok) throw new Error('Erreur lors de la récupération des transactions');
    return response.json();
  }
};