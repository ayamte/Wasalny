import React from 'react';
import { X, Check } from 'lucide-react';
import { getNotificationTypeLabel, getNotificationTypeColor, getNotificationTypeIcon, formatNotificationDate } from '../utils/notificationHelpers';

export default function NotificationModal({ notification, onClose, onMarkAsRead }) {
  if (!notification) return null;

  const typeColor = getNotificationTypeColor(notification.type);
  const typeIcon = getNotificationTypeIcon(notification.type);
  const typeLabel = getNotificationTypeLabel(notification.type);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: notification.isRead ? '#ffffff' : '#f0f9ff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{typeIcon}</span>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Détails de la notification
              </h2>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: typeColor,
                  backgroundColor: `${typeColor}20`,
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  display: 'inline-block',
                  marginTop: '0.25rem'
                }}
              >
                {typeLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem',
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
              {notification.title}
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
              {formatNotificationDate(notification.createdAt)}
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}
          >
            <p style={{ fontSize: '1rem', color: '#374151', lineHeight: '1.6', margin: 0 }}>
              {notification.message}
            </p>
          </div>

          {/* Métadonnées */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {notification.amount && (
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #bbf7d0'
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#166534', marginBottom: '0.25rem', fontWeight: '600' }}>
                  Montant
                </p>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#15803d', margin: 0 }}>
                  {notification.amount.toFixed(2)} DH
                </p>
              </div>
            )}

            {notification.paymentId && (
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem', fontWeight: '600' }}>
                  ID Paiement
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', margin: 0, wordBreak: 'break-all' }}>
                  {notification.paymentId}
                </p>
              </div>
            )}

            {notification.ticketId && (
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem', fontWeight: '600' }}>
                  ID Ticket
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e3a8a', margin: 0, wordBreak: 'break-all' }}>
                  {notification.ticketId}
                </p>
              </div>
            )}

            {notification.subscriptionId && (
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #fde68a'
                }}
              >
                <p style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem', fontWeight: '600' }}>
                  ID Abonnement
                </p>
                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#78350f', margin: 0, wordBreak: 'break-all' }}>
                  {notification.subscriptionId}
                </p>
              </div>
            )}
          </div>

          {!notification.isRead && (
            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={() => {
                  onMarkAsRead(notification.id);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
              >
                <Check size={20} />
                Marquer comme lu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
