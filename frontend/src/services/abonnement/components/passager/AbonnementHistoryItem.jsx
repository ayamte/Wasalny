import React from 'react';
import { Eye } from 'lucide-react';
import { STATUS_CONFIG } from '../../constants/abonnementConstants';
import { canRenouveler, formatDate } from '../../utils/abonnementHelpers';

function StatusBadge({ statut }) {
  const { class: statusClass, icon: Icon, label } = STATUS_CONFIG[statut] || {};

  return (
    <span className={`status-badge ${statusClass}`}>
      <Icon className="w-4 h-4" />
      {label || statut}
    </span>
  );
}

export default function AbonnementHistoryItem({ abonnement, onViewDetails, onRenouveler }) {
  return (
    <div style={{
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '0.75rem',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#ff6b35';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = '#e2e8f0';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontWeight: '600', color: '#1a1a1a' }}>
            {abonnement.nomTypeAbonnement}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#718096', fontFamily: 'monospace' }}>
            {abonnement.numeroAbonnement}
          </div>
        </div>
        <StatusBadge statut={abonnement.statut} />
      </div>
      
      <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>
        {formatDate(abonnement.dateDebut)} - {formatDate(abonnement.dateFin)}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <button
          onClick={() => onViewDetails(abonnement)}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: '#fff5f0',
            color: '#ff6b35',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          <Eye className="w-4 h-4 inline mr-1" />
          Voir
        </button>
        {canRenouveler(abonnement) && (
          <button
            onClick={() => onRenouveler(abonnement.id)}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: '#bee3f8',
              color: '#2c5282',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Renouveler
          </button>
        )}
      </div>
    </div>
  );
}