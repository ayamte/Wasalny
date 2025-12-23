import axiosInstance from '../../axiosConfig';

export const paiementService = {
  initierPaiement: async (data) => {
    const response = await axiosInstance.post('/api/paiements/initier', data);
    return response.data;
  },

  traiterPaiement: async (transactionId) => {
    const response = await axiosInstance.post(`/api/paiements/${transactionId}/traiter`);
    return response.data;
  },

  getTransaction: async (transactionId) => {
    const response = await axiosInstance.get(`/api/paiements/${transactionId}`);
    return response.data;
  },

  getTransactionsClient: async (clientId) => {
    const response = await axiosInstance.get(`/api/paiements/client/${clientId}`);
    return response.data;
  }
};