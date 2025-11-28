import React from 'react';
import { Ticket, CreditCard } from 'lucide-react';
import '../styles/Payment.css';

export const ServiceSelection = ({ onSelectService }) => {
  return (
    <div className="payment-card">
      <div className="payment-header">
        <CreditCard className="payment-icon" />
        <h2 className="payment-title">Choisir un service</h2>
      </div>

      <p className="text-center text-gray-600 mb-6">
        Sélectionnez le type de service pour lequel vous souhaitez effectuer un paiement
      </p>

      <div className="service-selection">
        <div 
          className="service-card"
          onClick={() => onSelectService('ACHAT_TICKET')}
        >
          <Ticket className="service-icon" />
          <h3 className="service-title">Achat de Ticket</h3>
          <p className="service-description">
            Acheter un ticket pour un trajet unique
          </p>
        </div>

        <div 
          className="service-card"
          onClick={() => onSelectService('ABONNEMENT')}
        >
          <CreditCard className="service-icon" />
          <h3 className="service-title">Abonnement</h3>
          <p className="service-description">
            Souscrire à un abonnement mensuel ou annuel
          </p>
        </div>
      </div>
    </div>
  );
};