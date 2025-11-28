import axiosInstance from '../../axiosConfig';

export const paiementService = {
  initierPaiement: async (data) => {
    const response = await axiosInstance.post('/paiements/initier', data);
    return response.data;
  },

  traiterPaiement: async (transactionId) => {
    const response = await axiosInstance.post(`/paiements/${transactionId}/traiter`);
    return response.data;
  },

  getTransaction: async (transactionId) => {
    const response = await axiosInstance.get(`/paiements/${transactionId}`);
    return response.data;
  },

  getTransactionsClient: async (clientId) => {
    const response = await axiosInstance.get(`/paiements/client/${clientId}`);
    return response.data;
  }
};