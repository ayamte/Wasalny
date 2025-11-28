import React, { useState, useEffect } from 'react';  
import notificationService from '../../notificationService';  
import './notifications.css';  
  
const NotificationsPage = () => {  
  const [notifications, setNotifications] = useState([]);  
  const [filteredNotifications, setFilteredNotifications] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);  
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, PAYMENT, SUBSCRIPTION, TRIP, SYSTEM  
  const [pollingInterval, setPollingInterval] = useState(null);  
  
  // Récupérer l'userId depuis localStorage (ou context)  
  const userId = localStorage.getItem('userId');  
  
  useEffect(() => {  
    loadNotifications();  
      
    // Démarrer le polling pour les nouvelles notifications  
    const intervalId = notificationService.startPolling(userId, (newNotifications) => {  
      setNotifications(newNotifications);  
    }, 10000); // Toutes les 10 secondes  
      
    setPollingInterval(intervalId);  
  
    // Cleanup: arrêter le polling quand le composant est démonté  
    return () => {  
      notificationService.stopPolling(intervalId);  
    };  
  }, [userId]);  
  
  useEffect(() => {  
    applyFilter();  
  }, [notifications, filter]);  
  
  const loadNotifications = async () => {  
    try {  
      setLoading(true);  
      const data = await notificationService.getUserNotifications(userId);  
      setNotifications(data);  
      setError(null);  
    } catch (err) {  
      setError('Impossible de charger les notifications');  
      console.error(err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const applyFilter = () => {  
    let filtered = [...notifications];  
  
    if (filter === 'UNREAD') {  
      filtered = filtered.filter(n => !n.isRead);  
    } else if (filter !== 'ALL') {  
      filtered = filtered.filter(n => n.type === filter);  
    }  
  
    setFilteredNotifications(filtered);  
  };  
  
  const handleMarkAsRead = async (notificationId) => {  
    try {  
      await notificationService.markAsRead(notificationId);  
        
      // Mettre à jour l'état local  
      setNotifications(prev =>   
        prev.map(n =>   
          n.id === notificationId ? { ...n, isRead: true } : n  
        )  
      );  
    } catch (err) {  
      console.error('Erreur lors du marquage:', err);  
    }  
  };  
  
  const handleMarkAllAsRead = async () => {  
    try {  
      const unreadNotifications = notifications.filter(n => !n.isRead);  
        
      // Marquer toutes les notifications non lues  
      await Promise.all(  
        unreadNotifications.map(n => notificationService.markAsRead(n.id))  
      );  
        
      // Recharger les notifications  
      await loadNotifications();  
    } catch (err) {  
      console.error('Erreur lors du marquage multiple:', err);  
    }  
  };  
  
  const getNotificationIcon = (type) => {  
    switch (type) {  
      case 'PAYMENT':  
        return '💳';  
      case 'SUBSCRIPTION':  
        return '📅';  
      case 'TRIP':  
        return '🚌';  
      case 'SYSTEM':  
        return '⚙️';  
      default:  
        return '🔔';  
    }  
  };  
  
  const formatDate = (dateString) => {  
    const date = new Date(dateString);  
    const now = new Date();  
    const diffMs = now - date;  
    const diffMins = Math.floor(diffMs / 60000);  
    const diffHours = Math.floor(diffMs / 3600000);  
    const diffDays = Math.floor(diffMs / 86400000);  
  
    if (diffMins < 1) return 'À l\'instant';  
    if (diffMins < 60) return `Il y a ${diffMins} min`;  
    if (diffHours < 24) return `Il y a ${diffHours}h`;  
    if (diffDays < 7) return `Il y a ${diffDays}j`;  
      
    return date.toLocaleDateString('fr-FR', {  
      day: '2-digit',  
      month: 'short',  
      year: 'numeric'  
    });  
  };  
  
  const unreadCount = notifications.filter(n => !n.isRead).length;  
  
  if (loading) {  
    return (  
      <div className="notifications-container">  
        <div className="loading-spinner">  
          <div className="spinner"></div>  
          <p>Chargement des notifications...</p>  
        </div>  
      </div>  
    );  
  }  
  
  if (error) {  
    return (  
      <div className="notifications-container">  
        <div className="error-message">  
          <span className="error-icon">⚠️</span>  
          <p>{error}</p>  
          <button onClick={loadNotifications} className="retry-button">  
            Réessayer  
          </button>  
        </div>  
      </div>  
    );  
  }  
  
  return (  
    <div className="notifications-container">  
      <div className="notifications-header">  
        <div className="header-title">  
          <h1>Notifications</h1>  
          {unreadCount > 0 && (  
            <span className="unread-badge">{unreadCount}</span>  
          )}  
        </div>  
          
        {unreadCount > 0 && (  
          <button   
            onClick={handleMarkAllAsRead}  
            className="mark-all-read-button"  
          >  
            Tout marquer comme lu  
          </button>  
        )}  
      </div>  
  
      <div className="notifications-filters">  
        <button  
          className={`filter-button ${filter === 'ALL' ? 'active' : ''}`}  
          onClick={() => setFilter('ALL')}  
        >  
          Toutes ({notifications.length})  
        </button>  
        <button  
          className={`filter-button ${filter === 'UNREAD' ? 'active' : ''}`}  
          onClick={() => setFilter('UNREAD')}  
        >  
          Non lues ({unreadCount})  
        </button>  
        <button  
          className={`filter-button ${filter === 'PAYMENT' ? 'active' : ''}`}  
          onClick={() => setFilter('PAYMENT')}  
        >  
          💳 Paiements  
        </button>  
        <button  
          className={`filter-button ${filter === 'SUBSCRIPTION' ? 'active' : ''}`}  
          onClick={() => setFilter('SUBSCRIPTION')}  
        >  
          📅 Abonnements  
        </button>  
        <button  
          className={`filter-button ${filter === 'TRIP' ? 'active' : ''}`}  
          onClick={() => setFilter('TRIP')}  
        >  
          🚌 Trajets  
        </button>  
        <button  
          className={`filter-button ${filter === 'SYSTEM' ? 'active' : ''}`}  
          onClick={() => setFilter('SYSTEM')}  
        >  
          ⚙️ Système  
        </button>  
      </div>  
  
      <div className="notifications-list">  
        {filteredNotifications.length === 0 ? (  
          <div className="empty-state">  
            <span className="empty-icon">📭</span>  
            <p>Aucune notification</p>  
          </div>  
        ) : (  
          filteredNotifications.map((notification) => (  
            <div  
              key={notification.id}  
              className={`notification-card ${!notification.isRead ? 'unread' : ''}`}  
              onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}  
            >  
              <div className="notification-icon">  
                {getNotificationIcon(notification.type)}  
              </div>  
                
              <div className="notification-content">  
                <div className="notification-header-row">  
                  <h3 className="notification-title">{notification.title}</h3>  
                  {!notification.isRead && (  
                    <span className="unread-dot"></span>  
                  )}  
                </div>  
                  
                <p className="notification-message">{notification.message}</p>  
                  
                <div className="notification-footer">  
                  <span className="notification-date">  
                    {formatDate(notification.createdAt)}  
                  </span>  
                  <span className="notification-type-badge">  
                    {notification.type}  
                  </span>  
                </div>  
              </div>  
            </div>  
          ))  
        )}  
      </div>  
    </div>  
  );  
};  
  
export default NotificationsPage;