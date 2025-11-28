import React from 'react';
import { Eye } from 'lucide-react';
import { CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { STATUS_CONFIG } from '../constants/ticketConstants';
import { canAnnuler, canRembourser, formatDate } from '../utils/ticketHelpers';

function StatusBadge({ statut }) {
  const { class: statusClass, icon: Icon, label } = STATUS_CONFIG[statut] || {};

  return (
    <span className={`status-badge ${statusClass}`}>
      <Icon className="w-4 h-4" />
      {label || statut}
    </span>
  );
}

export default function TicketCard({ ticket, onView, onAnnuler, onRembourser, actionLoading }) {
  return (
    <div
      style={{
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '0.75rem',
        transition: 'all 0.2s',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = '#ff6b35';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              color: '#1a1a1a'
            }}>
              {ticket.numeroTicket}
            </span>
            <StatusBadge statut={ticket.statut} />
          </div>

          <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
            Trajet: <strong>{ticket.numeroTrip}</strong>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
            Destination: {ticket.nomStationFinale}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
            Acheté le: {formatDate(ticket.dateAchat)}
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            {ticket.prix} MAD
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onView(ticket)}
              style={{
                padding: '0.5rem',
                backgroundColor: '#fff5f0',
                color: '#ff6b35',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ffe5d9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff5f0'}
            >
              <Eye className="w-5 h-5" />
            </button>
            
            {canAnnuler(ticket) && (
              <button
                onClick={() => onAnnuler(ticket.id)}
                disabled={actionLoading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#fed7d7',
                  color: '#c53030',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  opacity: actionLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading) e.target.style.backgroundColor = '#fc8181';
                }}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fed7d7'}
              >
                Annuler
              </button>
            )}

            {canRembourser(ticket) && (
              <button
                onClick={() => onRembourser(ticket.id)}
                disabled={actionLoading}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#bee3f8',
                  color: '#2c5282',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  opacity: actionLoading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!actionLoading) e.target.style.backgroundColor = '#90cdf4';
                }}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#bee3f8'}
              >
                Rembourser
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}