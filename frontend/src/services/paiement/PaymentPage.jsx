import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { ServiceSelection } from './components/ServiceSelection';
import { PaymentForm } from './components/PaymentForm';
import { TransactionHistory } from './components/TransactionHistory';
import './styles/Payment.css';

export const PaymentPage = () => {
  const [view, setView] = useState('selection');
  const [selectedService, setSelectedService] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  
  // Données exemple - Montant retiré
  const mockData = {
    clientId: '550e8400-e29b-41d4-a716-446655440000',
    referenceService: '57e76827-88b9-43c1-a836-c8eb3b6ef003'
  };

  const handleSelectService = (typeService) => {
    setSelectedService(typeService);
    setView('payment');
  };

  const handlePaymentSuccess = (transaction) => {
    setPaymentSuccess(transaction);
    setTimeout(() => {
      setView('history');
      setPaymentSuccess(null);
    }, 3000);
  };

  const handleBack = () => {
    setSelectedService(null);
    setView('selection');
  };

  return (
    <div className="payment-container">
      <div className="max-w-6xl mx-auto">
        <div className="nav-tabs">
          <button
            onClick={() => setView('selection')}
            className={`nav-tab ${view === 'selection' || view === 'payment' ? 'active' : 'inactive'}`}
          >
            Nouveau paiement
          </button>
          <button
            onClick={() => setView('history')}
            className={`nav-tab ${view === 'history' ? 'active' : 'inactive'}`}
          >
            Historique
          </button>
        </div>

        {paymentSuccess && (
          <div className="success-alert">
            <CheckCircle className="success-icon" />
            <div>
              <div className="success-title">Paiement réussi !</div>
              <div className="success-reference">
                Référence: {paymentSuccess.reference}
              </div>
            </div>
          </div>
        )}

        {view === 'selection' && (
          <ServiceSelection onSelectService={handleSelectService} />
        )}

        {view === 'payment' && selectedService && (
          <PaymentForm
            clientId={mockData.clientId}
            typeService={selectedService}
            referenceService={mockData.referenceService}
            onSuccess={handlePaymentSuccess}
            onBack={handleBack}
          />
        )}

        {view === 'history' && (
          <TransactionHistory clientId={mockData.clientId} />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;