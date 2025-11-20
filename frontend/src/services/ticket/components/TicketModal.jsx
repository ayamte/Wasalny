import React from 'react';
import { STATUS_CONFIG } from '../constants/ticketConstants';
import TicketDetailItem from './TicketDetailItem';
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

export default function TicketModal({ ticket, onClose, onAnnuler, onRembourser, actionLoading }) {
  if (!ticket) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '42rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Détails du ticket
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <TicketDetailItem label="Numéro" value={ticket.numeroTicket} mono />
          <TicketDetailItem label="Statut" value={<StatusBadge statut={ticket.statut} />} />
          <TicketDetailItem label="Prix" value={`${ticket.prix} MAD`} />
          <TicketDetailItem label="Trajet" value={ticket.numeroTrip} />
          <TicketDetailItem label="Destination" value={ticket.nomStationFinale} span2 />
          <TicketDetailItem
            label="Date d'achat"
            value={formatDate(ticket.dateAchat)}
            span2
          />
          <TicketDetailItem label="Transaction ID" value={ticket.transactionId} mono span2 />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          {canAnnuler(ticket) && (
            <button
              onClick={() => onAnnuler(ticket.id)}
              disabled={actionLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#fed7d7',
                color: '#c53030',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              {actionLoading ? 'Annulation...' : 'Annuler le ticket'}
            </button>
          )}

          {canRembourser(ticket) && (
            <button
              onClick={() => onRembourser(ticket.id)}
              disabled={actionLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#bee3f8',
                color: '#2c5282',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              {actionLoading ? 'Remboursement...' : 'Demander remboursement'}
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#e2e8f0',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}