import React, { useState, useEffect } from 'react';  
import { useLocation, useNavigate } from 'react-router-dom';  
import { CheckCircle } from 'lucide-react';  
import * as authService from '../auth/authService';  
import Navbar from '../../components/Navbar';
import { ServiceSelection } from './components/ServiceSelection';  
import { PaymentForm } from './components/PaymentForm';  
import { TransactionHistory } from './components/TransactionHistory';  
import './styles/Payment.css';  
  
export const PaymentPage = () => {  
  const navigate = useNavigate();  
  const location = useLocation();  
  const clientId = authService.getUser()?.id;  
  const [view, setView] = useState('selection');  
  const [selectedService, setSelectedService] = useState(null);  
  const [paymentSuccess, setPaymentSuccess] = useState(null);  
  
  // Récupérer les données depuis l'état de navigation  
  const getInitialData = () => {  
    if (location.state) {  
      return {  
        typeService: location.state.typeService,  
        referenceService: location.state.referenceService,  
        montant: location.state.montant  
      };  
    }  
    return null;  
  };  
  
  const initialData = getInitialData();  
  
  useEffect(() => {  
    if (initialData) {  
      setSelectedService(initialData.typeService);  
      setView('payment');  
    }  
  }, [initialData]);  
  
  const handleSelectService = (typeService) => {  
    setSelectedService(typeService);  
    setView('payment');  
  };  
  
  const handlePaymentSuccess = (transaction) => {
    setPaymentSuccess(transaction);
    setTimeout(() => {
      // Si c'est un abonnement, rediriger vers la page abonnements
      if (initialData?.typeService === 'ABONNEMENT') {
        navigate('/abonnement', { replace: true });
      }
      // Si c'est un ticket ou paiement direct, rester sur historique paiements
      else {
        if (initialData) {
          navigate('/paiement', {
            replace: true,
            state: null // Enlever les données du trajet
          });
        }
        setView('history');
      }
      setPaymentSuccess(null);
    }, 2000);
  };  
  
  const handleBack = () => {  
    if (initialData) {  
      navigate(-1);  
    } else {  
      setSelectedService(null);  
      setView('selection');  
    }  
  };  
  
  if (!clientId) {
    return (
      <>
        <Navbar />
        <div>Chargement...</div>
      </>
    );
  }
  
  return (  
    <>
      <Navbar />
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
  
        {view === 'selection' && !paymentSuccess && (
          <ServiceSelection onSelectService={handleSelectService} />
        )}

        {view === 'payment' && selectedService && !paymentSuccess && (
          <PaymentForm
            clientId={clientId}
            typeService={selectedService}
            referenceService={initialData?.referenceService}
            montant={initialData?.montant}
            onSuccess={handlePaymentSuccess}
            onBack={handleBack}
          />
        )}

        {view === 'history' && (
          <TransactionHistory clientId={clientId} />
        )}
        </div>
      </div>
    </>
  );
};

export default PaymentPage;