import axiosInstance from '../../axiosConfig';

export const abonnementService = {
  // Abonnements client
  getAbonnementsClient: async (clientId) => {
    const response = await axiosInstance.get(`/abonnements/client/${clientId}`);
    return response.data;
  },

  getAbonnementActif: async (clientId) => {
    try {
      const response = await axiosInstance.get(`/abonnements/client/${clientId}/actif`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) return null;
      throw new Error('Erreur lors de la récupération');
    }
  },

  souscrireAbonnement: async (clientId, typeAbonnementId) => {
    const response = await axiosInstance.post('/abonnements', {
      clientId,
      typeAbonnementId
    });
    return response.data;
  },

  annulerAbonnement: async (abonnementId) => {
    const response = await axiosInstance.put(`/abonnements/${abonnementId}/annuler`);
    return response.data;
  },

  renouvelerAbonnement: async (abonnementId) => {
    const response = await axiosInstance.put(`/abonnements/${abonnementId}/renouveler`);
    return response.data;
  },

  // Types d'abonnement
  getTypesAbonnement: async () => {
    const response = await axiosInstance.get('/abonnements/types');
    return response.data;
  },

  getTypesAbonnementActifs: async () => {
    const response = await axiosInstance.get('/abonnements/types/actifs');
    return response.data;
  },

  creerTypeAbonnement: async (data) => {
    const response = await axiosInstance.post('/abonnements/types', data);
    return response.data;
  }
};