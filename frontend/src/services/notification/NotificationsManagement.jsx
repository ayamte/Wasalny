import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, X, Filter } from 'lucide-react'
import * as notificationService from '../notificationService'
import * as authService from '../auth/authService'
import './NotificationsManagement.css'

const NotificationsManagement = () => {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'payment', 'ticket', 'subscription'
  const [selectedNotification, setSelectedNotification] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const user = authService.getUser()

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [filter, notifications])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      let data

      if (user?.role === 'ADMIN') {
        // Admin peut voir toutes les notifications (à adapter selon votre logique)
        data = await notificationService.getUserNotifications(user.id)
      } else {
        data = await notificationService.getUserNotifications(user.id)
      }

      // Trier par date décroissante
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setNotifications(sortedData)
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = [...notifications]

    switch (filter) {
      case 'unread':
        filtered = filtered.filter(n => !n.isRead)
        break
      case 'payment':
        filtered = filtered.filter(n => n.type === 'PAYMENT')
        break
      case 'ticket':
        filtered = filtered.filter(n => n.type === 'TICKET')
        break
      case 'subscription':
        filtered = filtered.filter(n => n.type === 'SUBSCRIPTION')
        break
      default:
        // 'all' - no filtering
        break
    }

    setFilteredNotifications(filtered)
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      ))
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(notifications)
      setNotifications(notifications.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error)
    }
  }

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
    if (!notification.isRead) {
      handleMarkAsRead(notification.id)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'PAYMENT':
        return '💳'
      case 'TICKET':
        return '🎫'
      case 'SUBSCRIPTION':
        return '📅'
      default:
        return '🔔'
    }
  }

  const getNotificationTypeLabel = (type) => {
    switch (type) {
      case 'PAYMENT':
        return 'Paiement'
      case 'TICKET':
        return 'Ticket'
      case 'SUBSCRIPTION':
        return 'Abonnement'
      default:
        return 'Notification'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="notifications-management">
      <div className="notifications-page-container">
        <div className="notifications-page-header">
          <div className="header-left">
            <h1 className="notifications-page-title">
              <Bell size={32} />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</span>
            )}
          </div>
          <button
            className="notifications-mark-all-btn"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck size={20} />
            Tout marquer comme lu
          </button>
        </div>

        {/* Filtres */}
        <div className="notifications-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({notifications.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Non lues ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === 'payment' ? 'active' : ''}`}
            onClick={() => setFilter('payment')}
          >
            💳 Paiements
          </button>
          <button
            className={`filter-btn ${filter === 'ticket' ? 'active' : ''}`}
            onClick={() => setFilter('ticket')}
          >
            🎫 Tickets
          </button>
          <button
            className={`filter-btn ${filter === 'subscription' ? 'active' : ''}`}
            onClick={() => setFilter('subscription')}
          >
            📅 Abonnements
          </button>
        </div>

        {/* Liste des notifications */}
        <div className="notifications-list">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Chargement des notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={64} className="empty-icon" />
              <h3>Aucune notification</h3>
              <p>Vous n'avez pas de notifications pour le moment</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleViewDetails(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <span className="notification-type-badge">
                      {getNotificationTypeLabel(notification.type)}
                    </span>
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <span className="notification-date">{formatDate(notification.createdAt)}</span>
                </div>
                {!notification.isRead && (
                  <div className="unread-indicator"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Modal de détails */}
        {isModalOpen && selectedNotification && (
          <div className="notifications-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="notifications-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="notifications-modal-header">
                <h2 className="notifications-modal-title">
                  {getNotificationIcon(selectedNotification.type)} Détails de la notification
                </h2>
                <button
                  className="notifications-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="notifications-modal-body">
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">
                    {getNotificationTypeLabel(selectedNotification.type)}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Titre:</span>
                  <span className="detail-value">{selectedNotification.title}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Message:</span>
                  <span className="detail-value">{selectedNotification.message}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {new Date(selectedNotification.createdAt).toLocaleString('fr-FR')}
                  </span>
                </div>

                {selectedNotification.paymentId && (
                  <div className="detail-row">
                    <span className="detail-label">ID Paiement:</span>
                    <span className="detail-value">{selectedNotification.paymentId}</span>
                  </div>
                )}

                {selectedNotification.amount && (
                  <div className="detail-row">
                    <span className="detail-label">Montant:</span>
                    <span className="detail-value">{selectedNotification.amount} DT</span>
                  </div>
                )}

                {selectedNotification.ticketId && (
                  <div className="detail-row">
                    <span className="detail-label">ID Ticket:</span>
                    <span className="detail-value">{selectedNotification.ticketId}</span>
                  </div>
                )}

                {selectedNotification.subscriptionId && (
                  <div className="detail-row">
                    <span className="detail-label">ID Abonnement:</span>
                    <span className="detail-value">{selectedNotification.subscriptionId}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="detail-label">Statut:</span>
                  <span className={`status-badge ${selectedNotification.isRead ? 'read' : 'unread'}`}>
                    {selectedNotification.isRead ? 'Lue' : 'Non lue'}
                  </span>
                </div>
              </div>

              <div className="notifications-modal-footer">
                <button
                  className="notifications-close-modal-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NotificationsManagement
