import React from 'react';
import { Bell, Check } from 'lucide-react';
import { getNotificationTypeLabel, getNotificationTypeColor, getNotificationTypeIcon, formatNotificationDate } from '../utils/notificationHelpers';

export default function NotificationCard({ notification, onMarkAsRead, onView }) {
  const typeColor = getNotificationTypeColor(notification.type);
  const typeIcon = getNotificationTypeIcon(notification.type);
  const typeLabel = getNotificationTypeLabel(notification.type);

  return (
    <div
      onClick={() => onView(notification)}
      style={{
        backgroundColor: notification.isRead ? '#ffffff' : '#f0f9ff',
        border: notification.isRead ? '1px solid #e5e7eb' : '2px solid #3b82f6',
        borderRadius: '12px',
        padding: '1.25rem',
        marginBottom: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s',
        boxShadow: notification.isRead ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(59, 130, 246, 0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = notification.isRead ? '0 1px 3px rgba(0, 0, 0, 0.1)' : '0 4px 6px rgba(59, 130, 246, 0.1)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{typeIcon}</span>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: typeColor,
                backgroundColor: `${typeColor}20`,
                padding: '0.25rem 0.75rem',
                borderRadius: '12px'
              }}
            >
              {typeLabel}
            </span>
            {!notification.isRead && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}
              />
            )}
          </div>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: notification.isRead ? '600' : '700',
              color: notification.isRead ? '#374151' : '#1f2937',
              marginBottom: '0.5rem'
            }}
          >
            {notification.title}
          </h3>

          <p
            style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.75rem',
              lineHeight: '1.5'
            }}
          >
            {notification.message}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {formatNotificationDate(notification.createdAt)}
            </span>

            {notification.amount && (
              <span
                style={{
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  color: '#10b981'
                }}
              >
                {notification.amount.toFixed(2)} DH
              </span>
            )}
          </div>
        </div>

        {!notification.isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            style={{
              padding: '0.5rem',
              backgroundColor: '#eff6ff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
            title="Marquer comme lu"
          >
            <Check size={16} style={{ color: '#3b82f6' }} />
          </button>
        )}
      </div>
    </div>
  );
}
