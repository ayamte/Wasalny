import React from 'react';
import NotificationCard from './NotificationCard';
import { Bell } from 'lucide-react';

export default function NotificationList({ notifications, onMarkAsRead, onView }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        color: '#9ca3af'
      }}>
        <Bell size={64} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
        <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Aucune notification
        </p>
        <p style={{ fontSize: '0.875rem' }}>
          Vous n'avez pas encore de notifications
        </p>
      </div>
    );
  }

  return (
    <div>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onView={onView}
        />
      ))}
    </div>
  );
}
