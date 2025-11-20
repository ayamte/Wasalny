import React from 'react';
import { CheckCircle, Calendar, CreditCard } from 'lucide-react';
import ActiveAbonnementCard from './ActiveAbonnementCard';
import AbonnementHistoryItem from './AbonnementHistoryItem';

export default function PassagerView({ abonnements, abonnementActif, onAnnuler, onRenouveler, onViewDetails }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Abonnement actif */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle style={{ color: '#38a169' }} />
          Abonnement Actif
        </h2>
        
        {abonnementActif ? (
          <ActiveAbonnementCard 
            abonnement={abonnementActif}
            onViewDetails={onViewDetails}
            onAnnuler={onAnnuler}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
            <CreditCard style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>Aucun abonnement actif</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Souscrivez à un abonnement depuis la page paiement
            </p>
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