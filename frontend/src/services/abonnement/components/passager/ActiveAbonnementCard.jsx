import React from 'react';
import { Calendar } from 'lucide-react';
import { STATUS_CONFIG } from '../../constants/abonnementConstants';
import { calculateJoursRestants, formatDate } from '../../utils/abonnementHelpers';

function StatusBadge({ statut }) {
  const { class: statusClass, icon: Icon, label } = STATUS_CONFIG[statut] || {};

  return (
    <span className={`status-badge ${statusClass}`}>
      <Icon className="w-4 h-4" />
      {label || statut}
    </span>
  );
}

export default function ActiveAbonnementCard({ abonnement, onViewDetails, onAnnuler }) {
  const joursRestants = calculateJoursRestants(abonnement.dateFin);
  
  return (
    <div style={{
      border: '3px solid #38a169',
      borderRadius: '12px',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.25rem' }}>
            {abonnement.nomTypeAbonnement}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#718096', fontFamily: 'monospace' }}>
            {abonnement.numeroAbonnement}
          </div>
        </div>
        <StatusBadge statut={abonnement.statut} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Calendar className="w-4 h-4" style={{ color: '#718096' }} />
          <span style={{ fontSize: '0.875rem', color: '#718096' }}>
            Valide jusqu'au {formatDate(abonnement.dateFin)}
          </span>
        </div>
        <div style={{
          padding: '0.75rem',
          background: joursRestants <= 7 ? '#fed7d7' : '#bee3f8',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: '600',
          color: joursRestants <= 7 ? '#c53030' : '#2c5282'
        }}>
          {joursRestants > 0 ? `${joursRestants} jour${joursRestants > 1 ? 's' : ''} restant${joursRestants > 1 ? 's' : ''}` : 'Expiré'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onViewDetails(abonnement)}
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
          Détails
        </button>
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
          Annuler
        </button>
      </div>
    </div>
  );
}