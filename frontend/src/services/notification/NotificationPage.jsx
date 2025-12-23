import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Clock, CheckCheck } from 'lucide-react';
import { notificationService } from './api/notificationService';
import * as authService from '../auth/authService';
import Navbar from '../../components/Navbar';
import NotificationList from './components/NotificationList';
import NotificationModal from './components/NotificationModal';
import NotificationFilter from './components/NotificationFilter';
import { sortNotificationsByDate, filterUnreadNotifications } from './utils/notificationHelpers';
import './styles/Notification.css';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const userId = authService.getUser()?.id;

  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  useEffect(() => {
    applyFilter();
  }, [notifications, activeFilter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getUserNotifications(userId);
      const sortedData = sortNotificationsByDate(data);
      setNotifications(sortedData);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...notifications];

    switch (activeFilter) {
      case 'unread':
        filtered = filterUnreadNotifications(filtered);
        break;
      case 'payment':
        filtered = filtered.filter(n => n.type === 'PAYMENT');
        break;
      case 'ticket':
        filtered = filtered.filter(n => n.type === 'TICKET');
        break;
      case 'subscription':
        filtered = filtered.filter(n => n.type === 'SUBSCRIPTION');
        break;
      default:
        break;
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      setError(null);
      await notificationService.markAsRead(notificationId);
      setSuccessMessage('Notification marquée comme lue');

      // Mettre à jour localement
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = filterUnreadNotifications(notifications);

    if (unreadNotifications.length === 0) {
      setError('Aucune notification non lue');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!window.confirm(`Marquer ${unreadNotifications.length} notification(s) comme lue(s) ?`)) {
      return;
    }

    try {
      setError(null);

      // Marquer toutes les notifications non lues
      await Promise.all(
        unreadNotifications.map(n => notificationService.markAsRead(n.id))
      );

      setSuccessMessage('Toutes les notifications ont été marquées comme lues');
      await loadNotifications();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const unreadCount = filterUnreadNotifications(notifications).length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock className="w-8 h-8 animate-spin" style={{ color: '#ff6b35' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f0 100%)',
        padding: '2rem 1rem'
      }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Bell style={{ width: '2rem', height: '2rem', color: '#ff6b35' }} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '10px',
                      minWidth: '20px',
                      textAlign: 'center'
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>
                  Mes Notifications
                </h1>
                {unreadCount > 0 && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                    {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                <CheckCheck size={20} />
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0fff4',
            border: '1px solid #9ae6b4',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#38a169' }} />
            <span style={{ color: '#22543d', fontWeight: '600' }}>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#e53e3e' }} />
              <span style={{ color: '#c53030' }}>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#c53030'
              }}
            >
              <XCircle size={16} />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          <NotificationFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <NotificationList
            notifications={filteredNotifications}
            onMarkAsRead={handleMarkAsRead}
            onView={setSelectedNotification}
          />
        </div>
      </div>

      {/* Modal */}
      <NotificationModal
        notification={selectedNotification}
        onClose={() => setSelectedNotification(null)}
        onMarkAsRead={handleMarkAsRead}
      />
      </div>
    </>
  );
}
