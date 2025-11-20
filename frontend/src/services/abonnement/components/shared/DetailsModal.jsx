import React from 'react';
import { STATUS_CONFIG } from '../../constants/abonnementConstants';
import DetailItem from './DetailItem';
import { canAnnuler, canRenouveler, formatDate, formatDateTime } from '../../utils/abonnementHelpers';

function StatusBadge({ statut }) {
  const { class: statusClass, icon: Icon, label } = STATUS_CONFIG[statut] || {};

  return (
    <span className={`status-badge ${statusClass}`}>
      <Icon className="w-4 h-4" />
      {label || statut}
    </span>
  );
}

export default function DetailsModal({ abonnement, onClose, onAnnuler, onRenouveler }) {
  if (!abonnement) return null;

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
          Détails de l'abonnement
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <DetailItem label="Numéro" value={abonnement.numeroAbonnement} mono />
          <DetailItem label="Statut" value={<StatusBadge statut={abonnement.statut} />} />
          <DetailItem label="Type" value={abonnement.nomTypeAbonnement} />
          <DetailItem label="Prix" value={`${abonnement.montantPaye} MAD`} />
          <DetailItem label="Date début" value={formatDate(abonnement.dateDebut)} />
          <DetailItem label="Date fin" value={formatDate(abonnement.dateFin)} />
          <DetailItem
            label="Date d'achat"
            value={formatDateTime(abonnement.dateAchat)}
            span2
          />
          <DetailItem label="Transaction ID" value={abonnement.transactionId} mono span2 />
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          {canAnnuler(abonnement) && (
            <button
              onClick={() => onAnnuler(abonnement.id)}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#fed7d7',
                color: '#c53030',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Annuler l'abonnement
            </button>
          )}

          {canRenouveler(abonnement) && (
            <button
              onClick={() => onRenouveler(abonnement.id)}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#bee3f8',
                color: '#2c5282',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Renouveler
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