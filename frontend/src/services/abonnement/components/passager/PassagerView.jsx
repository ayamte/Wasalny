import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, CreditCard, Plus } from 'lucide-react';
import ActiveAbonnementCard from './ActiveAbonnementCard';
import AbonnementHistoryItem from './AbonnementHistoryItem';

export default function PassagerView({ abonnements, abonnementActif, onAnnuler, onRenouveler, onViewDetails }) {
  const navigate = useNavigate();

  const handleSouscrire = () => {
    navigate('/abonnement/types');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Abonnements actifs */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle style={{ color: '#38a169' }} />
          Abonnements Actifs
        </h2>

        {abonnementActif && abonnementActif.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            {abonnementActif.map((abo) => (
              <ActiveAbonnementCard
                key={abo.id}
                abonnement={abo}
                onViewDetails={onViewDetails}
                onAnnuler={onAnnuler}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            <CreditCard style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>Aucun abonnement actif</p>
            <button
              onClick={handleSouscrire}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'center',
                width: '100%',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e55a25'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6b35'}
            >
              <Plus size={20} />
              Souscrire à un abonnement
            </button>
          </div>
        )}
      </div>

      {/* Historique */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar style={{ color: '#ff6b35' }} />
          Historique
        </h2>
        
        {abonnements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            <p>Aucun historique</p>
          </div>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {abonnements.map((abo) => (
              <AbonnementHistoryItem
                key={abo.id}
                abonnement={abo}
                onViewDetails={onViewDetails}
                onRenouveler={onRenouveler}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}