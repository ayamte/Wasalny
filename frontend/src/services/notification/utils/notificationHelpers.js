import { NOTIFICATION_TYPE_LABELS, NOTIFICATION_TYPE_COLORS, NOTIFICATION_TYPE_ICONS } from '../constants/notificationConstants';

export const getNotificationTypeLabel = (type) => {
  return NOTIFICATION_TYPE_LABELS[type] || type;
};

export const getNotificationTypeColor = (type) => {
  return NOTIFICATION_TYPE_COLORS[type] || '#6b7280';
};

export const getNotificationTypeIcon = (type) => {
  return NOTIFICATION_TYPE_ICONS[type] || '🔔';
};

export const formatNotificationDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // Moins d'une minute
  if (diff < 60000) {
    return 'À l\'instant';
  }

  // Moins d'une heure
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }

  // Moins d'un jour
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }

  // Moins d'une semaine
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }

  // Sinon, afficher la date complète
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const sortNotificationsByDate = (notifications) => {
  return [...notifications].sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

export const filterUnreadNotifications = (notifications) => {
  return notifications.filter(n => !n.isRead);
};
