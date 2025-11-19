import React, { useState } from 'react';
import { CreditCard, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { paiementService } from '../api/paiementService';
import '../styles/Payment.css';

export const PaymentForm = ({ 
  clientId, 
  typeService, 
  referenceService, 
  onSuccess,
  onBack 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingTransaction, setPendingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    montant: '',
    typePaiement: 'CARTE_BANCAIRE',
    description: '',
    infoCarte: {
      numeroCarte: '',
      nomTitulaire: '',
      dateExpiration: '',
      cvv: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('carte.')) {
      const carteField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        infoCarte: { ...prev.infoCarte, [carteField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Étape 1 : Initier le paiement
  const handleInitierPaiement = async () => {
    if (!formData.montant || parseFloat(formData.montant) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const paiementData = {
        clientId,
        montant: parseFloat(formData.montant),
        typePaiement: formData.typePaiement,
        typeService,
        referenceService,
        description: formData.description,
        infoCarte: formData.typePaiement === 'CARTE_BANCAIRE' ? formData.infoCarte : null
      };

      const transaction = await paiementService.initierPaiement(paiementData);
      setPendingTransaction(transaction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : Traiter le paiement (confirmation)
  const handleTraiterPaiement = async () => {
    if (!pendingTransaction) return;

    setLoading(true);
    setError(null);

    try {
      const result = await paiementService.traiterPaiement(pendingTransaction.id);
      
      if (result.statut === 'REUSSIE') {
        onSuccess(result);
      } else {
        setError(result.motifEchec || 'Paiement échoué');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getServiceLabel = () => {
    return typeService === 'ACHAT_TICKET' ? 'Achat de Ticket' : 'Abonnement';
  };

  // Vue de confirmation après initiation
  if (pendingTransaction) {
    return (
      <div className="payment-card">
        <div className="payment-header">
          <CheckCircle className="payment-icon" />
          <h2 className="payment-title">Confirmer le paiement</h2>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle className="error-icon" />
            <div className="error-text">{error}</div>
          </div>
        )}

        <div className="amount-display">
          <div className="amount-label">Transaction initiée</div>
          <div className="success-reference" style={{ marginTop: '0.5rem' }}>
            Référence: {pendingTransaction.reference}
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <div className="detail-label">Service</div>
            <div className="detail-value">{getServiceLabel()}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Montant</div>
            <div className="detail-value">{pendingTransaction.montant} MAD</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Méthode</div>
            <div className="detail-value">{pendingTransaction.typePaiement}</div>
          </div>
          <div className="detail-item">
            <div className="detail-label">Statut</div>
            <div className="detail-value">{pendingTransaction.statut}</div>
          </div>
        </div>

        {formData.description && (
          <div className="form-group">
            <label className="form-label">Description</label>
            <p className="text-gray-700">{formData.description}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            onClick={() => setPendingTransaction(null)}
            className="back-button"
            style={{ flex: 1, marginBottom: 0 }}
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleTraiterPaiement}
            disabled={loading}
            className="submit-button"
            style={{ flex: 1 }}
          >
            {loading ? 'Traitement en cours...' : 'Confirmer le paiement'}
          </button>
        </div>
      </div>
    );
  }

  // Vue du formulaire initial
  return (
    <div className="payment-card">
      <button onClick={onBack} className="back-button">
        <ArrowLeft className="inline w-4 h-4 mr-2" />
        Retour
      </button>

      <div className="payment-header">
        <CreditCard className="payment-icon" />
        <h2 className="payment-title">Paiement - {getServiceLabel()}</h2>
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle className="error-icon" />
          <div className="error-text">{error}</div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Montant à payer (MAD)</label>
        <input
          type="number"
          name="montant"
          value={formData.montant}
          onChange={handleInputChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Méthode de paiement</label>
        <select
          name="typePaiement"
          value={formData.typePaiement}
          onChange={handleInputChange}
          className="form-select"
        >
          <option value="CARTE_BANCAIRE">Carte Bancaire</option>
          <option value="MOBILE_MONEY">Mobile Money</option>
          <option value="ESPECES">Espèces</option>
        </select>
      </div>

      {formData.typePaiement === 'CARTE_BANCAIRE' && (
        <div className="card-info-section">
          <div className="form-group">
            <label className="form-label">Numéro de carte</label>
            <input
              type="text"
              name="carte.numeroCarte"
              value={formData.infoCarte.numeroCarte}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nom du titulaire</label>
            <input
              type="text"
              name="carte.nomTitulaire"
              value={formData.infoCarte.nomTitulaire}
              onChange={handleInputChange}
              placeholder="JEAN DUPONT"
              className="form-input"
            />
          </div>

          <div className="card-info-grid">
            <div className="form-group">
              <label className="form-label">Date d'expiration</label>
              <input
                type="text"
                name="carte.dateExpiration"
                value={formData.infoCarte.dateExpiration}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">CVV</label>
              <input
                type="text"
                name="carte.cvv"
                value={formData.infoCarte.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={3}
                className="form-input"
              />
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Description (optionnel)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Ajoutez une note..."
          className="form-textarea"
        />
      </div>

      <button
        onClick={handleInitierPaiement}
        disabled={loading}
        className="submit-button"
      >
        {loading ? 'Préparation...' : 'Initier le paiement'}
      </button>
    </div>
  );
};