import axios from './axiosConfig';

/**
 * Service pour gérer les notifications
 */

/**
 * Récupérer toutes les notifications d'un utilisateur
 */
export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`/notifications`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    throw error;
  }
};

/**
 * Récupérer les notifications d'un client par son ID
 */
export const getClientNotifications = async (clientId) => {
  try {
    const response = await axios.get(`/notifications/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications du client:', error);
    throw error;
  }
};

/**
 * Récupérer les notifications non lues d'un utilisateur
 */
export const getUnreadNotifications = async (userId) => {
  try {
    const response = await axios.get(`/notifications/unread`, {
      params: { userId }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications non lues:', error);
    throw error;
  }
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (notificationId) => {
  try {
    const response = await axios.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors du marquage de la notification comme lue:', error);
    throw error;
  }
};

/**
 * Récupérer une notification par ID
 */
export const getNotificationById = async (notificationId) => {
  try {
    const response = await axios.get(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la notification:', error);
    throw error;
  }
};

/**
 * Marquer toutes les notifications d'un utilisateur comme lues
 */
export const markAllAsRead = async (notifications) => {
  try {
    const promises = notifications
      .filter(n => !n.isRead)
      .map(n => markAsRead(n.id));
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications comme lues:', error);
    throw error;
  }
};

/**
 * Obtenir le nombre de notifications non lues
 */
export const getUnreadCount = async (userId) => {
  try {
    const notifications = await getUnreadNotifications(userId);
    return notifications.length;
  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    return 0;
  }
};
