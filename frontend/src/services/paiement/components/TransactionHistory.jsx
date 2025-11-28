import React, { useState, useEffect } from 'react';
import { History, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { paiementService } from '../api/paiementService';
import '../styles/Payment.css';

export const TransactionHistory = ({ clientId }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [clientId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paiementService.getTransactionsClient(clientId);
      console.log('Transactions chargées:', data);
      setTransactions(data);
    } catch (err) {
      console.error('Erreur chargement transactions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (statut) => {
    const config = {
      REUSSIE: { class: 'success', icon: CheckCircle },
      ECHOUEE: { class: 'error', icon: AlertCircle },
      EN_ATTENTE: { class: 'pending', icon: Clock }
    };
    const { class: statusClass, icon: Icon } = config[statut] || { class: 'pending', icon: Clock };

    return (
      <span className={`status-badge ${statusClass}`}>
        <Icon className="w-4 h-4" />
        {statut}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des transactions...</div>;
  }

  if (error) {
    return (
      <div className="payment-card">
        <div className="error-alert">
          <AlertCircle className="error-icon" />
          <div className="error-text">
            Erreur lors du chargement de l'historique: {error}
          </div>
        </div>
        <button onClick={loadTransactions} className="submit-button">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="payment-card">
      <div className="payment-header">
        <History className="payment-icon" />
        <h2 className="payment-title">Historique des paiements</h2>
      </div>

      {transactions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
          Aucune transaction pour le moment
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {transactions.map((transaction) => (
            <div key={transaction.id} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'white'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#6b7280' }}>
                      {transaction.reference}
                    </span>
                    {getStatusBadge(transaction.statut)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(transaction.dateTransaction).toLocaleString('fr-FR')}
                  </div>
                  {transaction.description && (
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                      {transaction.description}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                    {transaction.montant} {transaction.devise}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {transaction.typePaiement}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTransaction(transaction)}
                  style={{
                    marginLeft: '1rem',
                    padding: '0.5rem',
                    color: '#ff6b35',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={20} />
                </button>
              </div>
              {transaction.motifEchec && (
                <div style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#fee',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  color: '#c53030'
                }}>
                  {transaction.motifEchec}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Détails de la transaction
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Référence</div>
                <div style={{ fontFamily: 'monospace' }}>{selectedTransaction.reference}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Statut</div>
                <div>{getStatusBadge(selectedTransaction.statut)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Montant</div>
                <div>{selectedTransaction.montant} {selectedTransaction.devise}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Type de service</div>
                <div>{selectedTransaction.typeService}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Méthode</div>
                <div>{selectedTransaction.typePaiement}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Date</div>
                <div>{new Date(selectedTransaction.dateTransaction).toLocaleString('fr-FR')}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="submit-button"
              style={{ marginTop: '1.5rem', width: '100%' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};