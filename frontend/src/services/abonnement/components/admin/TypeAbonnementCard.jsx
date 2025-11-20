import React from 'react';

export default function TypeAbonnementCard({ type }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      border: type.actif ? '2px solid #38a169' : '2px solid #e2e8f0'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a' }}>
            {type.nom}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#718096', fontFamily: 'monospace' }}>
            {type.code}
          </div>
        </div>
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: type.actif ? '#c6f6d5' : '#e2e8f0',
          color: type.actif ? '#22543d' : '#718096'
        }}>
          {type.actif ? 'Actif' : 'Inactif'}
        </span>
      </div>

      <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
        {type.description}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: '#f7fafc',
        borderRadius: '8px'
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>Prix</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>
            {type.prix} MAD
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>Durée</div>
          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1a1a1a' }}>
            {type.dureeJours} jours
          </div>
        </div>
      </div>
    </div>
  );
}