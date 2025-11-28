import axios from 'axios';  
  
const API_BASE_URL = 'http://localhost:8080/api/notifications';  
  
// Récupérer le token JWT depuis localStorage  
const getAuthHeader = () => {  
  const token = localStorage.getItem('token');  
  return token ? { Authorization: `Bearer ${token}` } : {};  
};  
  
class NotificationService {  
    
  /**  
   * GET /notifications?userId={userId}  
   * Récupère toutes les notifications d'un utilisateur  
   */  
  async getUserNotifications(userId) {  
    try {  
      const response = await axios.get(`${API_BASE_URL}`, {  
        params: { userId },  
        headers: getAuthHeader()  
      });  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la récupération des notifications:', error);  
      throw error;  
    }  
  }  
  
  /**  
   * GET /notifications/client/{clientId}  
   * Récupère les notifications d'un client spécifique  
   */  
  async getClientNotifications(clientId) {  
    try {  
      const response = await axios.get(`${API_BASE_URL}/client/${clientId}`, {  
        headers: getAuthHeader()  
      });  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la récupération des notifications client:', error);  
      throw error;  
    }  
  }  
  
  /**  
   * GET /notifications/unread?userId={userId}  
   * Récupère les notifications non lues  
   */  
  async getUnreadNotifications(userId) {  
    try {  
      const response = await axios.get(`${API_BASE_URL}/unread`, {  
        params: { userId },  
        headers: getAuthHeader()  
      });  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la récupération des notifications non lues:', error);  
      throw error;  
    }  
  }  
  
  /**  
   * GET /notifications/{id}  
   * Récupère une notification par son ID  
   */  
  async getNotificationById(notificationId) {  
    try {  
      const response = await axios.get(`${API_BASE_URL}/${notificationId}`, {  
        headers: getAuthHeader()  
      });  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors de la récupération de la notification:', error);  
      throw error;  
    }  
  }  
  
  /**  
   * PUT /notifications/{id}/read  
   * Marque une notification comme lue  
   */  
  async markAsRead(notificationId) {  
    try {  
      const response = await axios.put(`${API_BASE_URL}/${notificationId}/read`, {}, {  
        headers: getAuthHeader()  
      });  
      return response.data;  
    } catch (error) {  
      console.error('Erreur lors du marquage de la notification:', error);  
      throw error;  
    }  
  }  
  
  /**  
   * Polling pour récupérer les nouvelles notifications  
   * Appelle getUserNotifications toutes les X secondes  
   */  
  startPolling(userId, callback, intervalMs = 10000) {  
    const intervalId = setInterval(async () => {  
      try {  
        const notifications = await this.getUserNotifications(userId);  
        callback(notifications);  
      } catch (error) {  
        console.error('Erreur polling:', error);  
      }  
    }, intervalMs);  
      
    return intervalId; // Retourne l'ID pour pouvoir arrêter le polling  
  }  
  
  stopPolling(intervalId) {  
    if (intervalId) {  
      clearInterval(intervalId);  
    }  
  }  
}  
  
export default new NotificationService();