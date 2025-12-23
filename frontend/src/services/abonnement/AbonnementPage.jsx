
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Clock, Plus } from 'lucide-react';
import { abonnementService } from './api/abonnementService';
import * as authService from '../auth/authService';
import Navbar from '../../components/Navbar';
import PassagerView from './components/passager/PassagerView';    
import AdminView from './components/admin/AdminView';    
import DetailsModal from './components/shared/DetailsModal';    
import SuccessAlert from './components/shared/SuccessAlert';    
import ErrorAlert from './components/shared/ErrorAlert';    
import './styles/Abonnement.css';    
    
export default function AbonnementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [view, setView] = useState('passager');
  const [abonnements, setAbonnements] = useState([]);
  const [abonnementActif, setAbonnementActif] = useState([]);  // Tableau au lieu de null
  const [typesAbonnement, setTypesAbonnement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const clientId = authService.getUser()?.id;
  const user = authService.getUser();
  const isAdmin = user?.role === 'ADMIN';    
    
  useEffect(() => {
    if (clientId) {
      // Admin voit directement la vue admin, client voit vue passager
      if (isAdmin) {
        setView('admin');
        loadTypesAbonnement();
      } else {
        setView('passager');
        loadAbonnements();
      }
    }
  }, [clientId, isAdmin, location.pathname]);  // Recharger aussi quand on navigue vers cette page    
    
  const loadAbonnements = async () => {
    try {
      setLoading(true);
      const abos = await abonnementService.getAbonnementsClient(clientId);

      // Filtrer les abonnements actifs (statut ACTIF)
      const abonnementsActifs = abos.filter(abo => abo.statut === 'ACTIF');

      setAbonnements(abos);  // Tous les abonnements pour l'historique
      setAbonnementActif(abonnementsActifs);  // Tableau des abonnements actifs
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };    
    
  const loadTypesAbonnement = async () => {    
    try {    
      setLoading(true);    
      const types = await abonnementService.getTypesAbonnement();    
      setTypesAbonnement(types);    
    } catch (err) {    
      setError(err.message);    
    } finally {    
      setLoading(false);    
    }    
  };    
    
  const handleAnnuler = async (abonnementId) => {    
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cet abonnement ?')) return;    
        
    try {    
      setError(null);    
      await abonnementService.annulerAbonnement(abonnementId);    
      setSuccessMessage('Abonnement annulé avec succès');    
      await loadAbonnements();    
      setSelectedAbonnement(null);    
      setTimeout(() => setSuccessMessage(null), 3000);    
    } catch (err) {    
      setError(err.message);    
    }    
  };    
    
  const handleRenouveler = async (abonnementId) => {    
    if (!window.confirm('Renouveler cet abonnement ?')) return;    
        
    try {    
      setError(null);    
      await abonnementService.renouvelerAbonnement(abonnementId);    
      setSuccessMessage('Abonnement renouvelé avec succès');    
      await loadAbonnements();    
      setSelectedAbonnement(null);    
      setTimeout(() => setSuccessMessage(null), 3000);    
    } catch (err) {    
      setError(err.message);    
    }    
  };    
    
  if (loading) {    
    return (    
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>    
          <Clock className="w-8 h-8 animate-spin" style={{ color: '#ff6b35' }} />    
        </div>    
      </>
    );    
  }    
    
  return (    
    <>
      <Navbar />
      <div style={{    
        minHeight: '100vh',    
        background: 'linear-gradient(135deg, #ffffff 0%, #fff5f0 100%)',    
        padding: '2rem 1rem'    
      }}>    
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>    
        <div style={{    
          background: 'white',    
          borderRadius: '12px',    
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',    
          padding: '2rem',    
          marginBottom: '1.5rem'    
        }}>    
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>    
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>    
              <CreditCard style={{ width: '2rem', height: '2rem', color: '#ff6b35' }} />    
              <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>    
                {isAdmin ? 'Gestion des Types d\'Abonnements' : 'Mes Abonnements'}    
              </h1>    
            </div>    
            {isAdmin ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setView('admin')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Gestion Types
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/abonnement/types')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e55a25'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6b35'}
              >
                <Plus size={20} />
                Souscrire à un abonnement
              </button>
            )}    
          </div>    
        </div>    
    
        {successMessage && <SuccessAlert message={successMessage} />}    
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}    
    
        {view === 'passager' ? (    
          <PassagerView    
            abonnements={abonnements}    
            abonnementActif={abonnementActif}    
            onAnnuler={handleAnnuler}    
            onRenouveler={handleRenouveler}    
            onViewDetails={setSelectedAbonnement}    
          />    
        ) : (    
          <AdminView    
            types={typesAbonnement}    
            onRefresh={loadTypesAbonnement}    
          />    
        )}    
      </div>    
    
      <DetailsModal    
        abonnement={selectedAbonnement}    
        onClose={() => setSelectedAbonnement(null)}    
        onAnnuler={handleAnnuler}    
        onRenouveler={handleRenouveler}    
      />    
      </div>    
    </>
  );
}