import React from 'react'  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'  
import PaymentPage from './services/paiement/PaymentPage';
import TicketPage from './services/ticket/TicketPage';
import AbonnementPage from './services/abonnement/AbonnementPage';

function App() {  
  return (  
    <Router>  
      <div className="min-h-screen bg-gray-100">  
        <Routes>  
          {/* Page d'accueil */}  
          <Route path="/" element={  
            <div className="flex items-center justify-center min-h-screen">  
              <div className="text-center">  
                <h1 className="text-4xl font-bold text-blue-600 mb-4">  
                  Wasalny  
                </h1>  
                <p className="text-gray-600">  
                  Plateforme de Gestion de Transport en Commun  
                </p>  
              </div>  
            </div>  
          } />  
            
          {/* Page de paiement */}  
          <Route path="/paiement" element={<PaymentPage />} />
          {/* Page des tickets */}
          <Route path="/tickets" element={<TicketPage />} />
            
          <Route path="/abonnements" element={<AbonnementPage />} />
          {/* Autres routes à ajouter plus tard */}  
          
        </Routes>  
      </div>  
    </Router>  
  )  
}  
  
export default App