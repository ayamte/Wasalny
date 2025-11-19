
import React, { useState, useEffect } from 'react';
import { History, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { paiementService } from '../api/paiementService';
import '../styles/Payment.css';

export const TransactionHistory = ({ clientId }) => {
const [transactions, setTransactions] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedTransaction, setSelectedTransaction] = useState(null);

useEffect(() => {
loadTransactions();
}, [clientId]);

const loadTransactions = async () => {
try {
const data = await paiementService.getTransactionsClient(clientId);
setTransactions(data);
} catch (err) {
console.error(err);
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
const { class: statusClass, icon: Icon } = config[statut];

return (
<span className={`status-badge ${statusClass}`}>
<Icon className="w-4 h-4" />
{statut}
</span>
);
};

if (loading) {
return <div className="text-center py-8">Chargement...</div>;
}

return (
<div className="history-card">
<div className="payment-header">
<History className="payment-icon" />
<h2 className="payment-title">Historique des paiements</h2>
</div>

{transactions.length === 0 ? (
<div className="text-center py-8 text-gray-500">
Aucune transaction pour le moment
</div>
) : (
<div>
{transactions.map((transaction) => (
<div key={transaction.id} className="transaction-item">
<div className="flex items-center justify-between">
  <div className="flex-1">
    <div className="flex items-center gap-3 mb-2">
      <span className="font-mono text-sm text-gray-600">
        {transaction.reference}
      </span>
      {getStatusBadge(transaction.statut)}
    </div>
    <div className="text-sm text-gray-600">
      {new Date(transaction.dateTransaction).toLocaleString('fr-FR')}
    </div>
    {transaction.description && (
      <div className="text-sm text-gray-500 mt-1">
        {transaction.description}
      </div>
    )}
  </div>
  <div className="text-right">
    <div className="text-2xl font-bold text-gray-800">
      {transaction.montant} {transaction.devise}
    </div>
    <div className="text-sm text-gray-500">
      {transaction.typePaiement}
    </div>
  </div>
  <button
    onClick={() => setSelectedTransaction(transaction)}
    className="ml-4 p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
  >
    <Eye className="w-5 h-5" />
  </button>
</div>
{transaction.motifEchec && (
  <div className="mt-3 p-3 bg-red-50 rounded text-sm text-red-700">
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
<h3 className="text-xl font-bold mb-4">Détails de la transaction</h3>
<div className="details-grid">
<div className="detail-item">
  <div className="detail-label">Référence</div>
  <div className="detail-value font-mono">{selectedTransaction.reference}</div>
</div>
<div className="detail-item">
  <div className="detail-label">Statut</div>
  <div>{getStatusBadge(selectedTransaction.statut)}</div>
</div>
<div className="detail-item">
  <div className="detail-label">Montant</div>
  <div className="detail-value">
    {selectedTransaction.montant} {selectedTransaction.devise}
  </div>
</div>
<div className="detail-item">
  <div className="detail-label">Type de service</div>
  <div className="detail-value">{selectedTransaction.typeService}</div>
</div>
<div className="detail-item">
  <div className="detail-label">Méthode</div>
  <div className="detail-value">{selectedTransaction.typePaiement}</div>
</div>
<div className="detail-item">
  <div className="detail-label">Date</div>
  <div className="detail-value">
    {new Date(selectedTransaction.dateTransaction).toLocaleString('fr-FR')}
  </div>
</div>
</div>
<button
onClick={() => setSelectedTransaction(null)}
className="submit-button mt-6"
>
Fermer
</button>
</div>
</div>
)}
</div>
);
};