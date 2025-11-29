import axiosInstance from '../../axiosConfig';

export const notificationService = {
  // Récupérer toutes les notifications d'un utilisateur
  getUserNotifications: async (userId) => {
    const response = await axiosInstance.get(`/notifications?userId=${userId}`);
    return response.data;
  },

  // Récupérer les notifications d'un client par son ID
  getClientNotifications: async (clientId) => {
    const response = await axiosInstance.get(`/notifications/client/${clientId}`);
    return response.data;
  },

  // Récupérer les notifications non lues
  getUnreadNotifications: async (userId) => {
    const response = await axiosInstance.get(`/notifications/unread?userId=${userId}`);
    return response.data;
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Récupérer une notification par ID
  getNotificationById: async (notificationId) => {
    const response = await axiosInstance.get(`/notifications/${notificationId}`);
    return response.data;
  }
};
