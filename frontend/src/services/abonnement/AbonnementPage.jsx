import React, { useState, useEffect } from 'react';
import { CreditCard, Clock } from 'lucide-react';
import { abonnementService } from './api/abonnementService';
import { MOCK_CLIENT_ID } from './constants/abonnementConstants';
import PassagerView from './components/passager/PassagerView';
import AdminView from './components/admin/AdminView';
import DetailsModal from './components/shared/DetailsModal';
import SuccessAlert from './components/shared/SuccessAlert';
import ErrorAlert from './components/shared/ErrorAlert';
import './styles/Abonnement.css';

export default function AbonnementPage() {
  const [view, setView] = useState('passager'); // 'passager' ou 'admin'
  const [abonnements, setAbonnements] = useState([]);
  const [abonnementActif, setAbonnementActif] = useState(null);
  const [typesAbonnement, setTypesAbonnement] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAbonnement, setSelectedAbonnement] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Mock data - à remplacer par auth
  const isAdmin = true; // À remplacer par vérification du rôle

  useEffect(() => {
    if (view === 'passager') {
      loadAbonnements();
    } else {
      loadTypesAbonnement();
    }
  }, [view]);

  const loadAbonnements = async () => {
    try {
      setLoading(true);
      const [abos, actif] = await Promise.all([
        abonnementService.getAbonnementsClient(MOCK_CLIENT_ID),
        abonnementService.getAbonnementActif(MOCK_CLIENT_ID)
      ]);
      setAbonnements(abos);
      setAbonnementActif(actif);
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Clock className="w-8 h-8 animate-spin" style={{ color: '#ff6b35' }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header avec navigation */}
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
                Abonnements
              </h1>
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setView('passager')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: view === 'passager' ? '#ff6b35' : 'white',
                    color: view === 'passager' ? 'white' : '#2d3748',
                    border: view === 'passager' ? 'none' : '2px solid #e2e8f0'
                  }}
                >
                  Vue Passager
                </button>
                <button
                  onClick={() => setView('admin')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    backgroundColor: view === 'admin' ? '#ff6b35' : 'white',
                    color: view === 'admin' ? 'white' : '#2d3748',
                    border: view === 'admin' ? 'none' : '2px solid #e2e8f0'
                  }}
                >
                  Gestion Types
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        {successMessage && <SuccessAlert message={successMessage} />}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Contenu selon la vue */}
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

      {/* Modal Détails */}
      <DetailsModal
        abonnement={selectedAbonnement}
        onClose={() => setSelectedAbonnement(null)}
        onAnnuler={handleAnnuler}
        onRenouveler={handleRenouveler}
      />
    </div>
  );
}