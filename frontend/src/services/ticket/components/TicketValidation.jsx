import React, { useState, useRef } from 'react';
import { CheckCircle, XCircle, Upload, QrCode, FileText } from 'lucide-react';

export default function TicketValidation() {
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setValidationResult({
        valid: false,
        message: 'Veuillez télécharger un fichier PDF'
      });
      return;
    }

    setIsValidating(true);
    
    // Simuler la validation (toujours valide pour l'instant)
    setTimeout(() => {
      setIsValidating(false);
      setValidationResult({
        valid: true,
        message: 'Ticket valide',
        ticketInfo: {
          numeroTicket: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          dateAchat: new Date().toLocaleDateString('fr-FR'),
          prix: '30.00',
          destination: 'Station Finale'
        }
      });
    }, 1500);
  };

  const handleManualValidation = () => {
    setIsValidating(true);
    
    // Simuler la validation manuelle (toujours valide)
    setTimeout(() => {
      setIsValidating(false);
      setValidationResult({
        valid: true,
        message: 'Ticket valide',
        ticketInfo: {
          numeroTicket: 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          dateAchat: new Date().toLocaleDateString('fr-FR'),
          prix: '30.00',
          destination: 'Station Finale'
        }
      });
    }, 1000);
  };

  const resetValidation = () => {
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <FileText style={{ width: '2rem', height: '2rem', color: '#ff6b35' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>
            Validation de Ticket
          </h1>
        </div>

        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Téléchargez le PDF du ticket ou validez manuellement en scannant le code QR
        </p>

        {/* Zone de téléchargement */}
        <div style={{
          border: '2px dashed #e5e7eb',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          backgroundColor: '#f9fafb',
          transition: 'all 0.3s',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#ff6b35';
          e.currentTarget.style.backgroundColor = '#fff5f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }}
        onClick={() => fileInputRef.current?.click()}
        >
          <Upload style={{ width: '3rem', height: '3rem', color: '#ff6b35', margin: '0 auto 1rem' }} />
          <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1a1a1a' }}>
            Cliquez pour télécharger le PDF du ticket
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Format accepté: PDF uniquement
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {/* Bouton validation manuelle */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ 
            display: 'inline-block', 
            width: '1px', 
            height: '40px', 
            backgroundColor: '#e5e7eb',
            margin: '0 1rem',
            verticalAlign: 'middle'
          }}></div>
          <span style={{ color: '#6b7280', margin: '0 1rem' }}>OU</span>
          <div style={{ 
            display: 'inline-block', 
            width: '1px', 
            height: '40px', 
            backgroundColor: '#e5e7eb',
            margin: '0 1rem',
            verticalAlign: 'middle'
          }}></div>
        </div>

        <button
          onClick={handleManualValidation}
          disabled={isValidating}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: isValidating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: isValidating ? 0.6 : 1
          }}
        >
          <QrCode size={20} />
          {isValidating ? 'Validation en cours...' : 'Valider manuellement (Scanner QR)'}
        </button>
      </div>

      {/* Résultat de validation */}
      {isValidating && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '4rem',
            height: '4rem',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#3b82f6', fontWeight: '600' }}>Validation en cours...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {validationResult && !isValidating && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          {validationResult.valid ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#f0fff4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <CheckCircle style={{ width: '3rem', height: '3rem', color: '#22c55e' }} />
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#22c55e',
                marginBottom: '1rem'
              }}>
                {validationResult.message}
              </h2>
              
              {validationResult.ticketInfo && (
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  textAlign: 'left'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1a1a1a' }}>
                    Informations du ticket
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Numéro de ticket
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                        {validationResult.ticketInfo.numeroTicket}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Prix
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                        {validationResult.ticketInfo.prix} MAD
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Date d'achat
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                        {validationResult.ticketInfo.dateAchat}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Destination
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1a1a1a' }}>
                        {validationResult.ticketInfo.destination}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={resetValidation}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 2rem',
                  backgroundColor: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Valider un autre ticket
              </button>
            </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                backgroundColor: '#fff5f5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem'
              }}>
                <XCircle style={{ width: '3rem', height: '3rem', color: '#ef4444' }} />
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ef4444',
                marginBottom: '1rem'
              }}>
                {validationResult.message}
              </h2>
              <button
                onClick={resetValidation}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 2rem',
                  backgroundColor: '#e2e8f0',
                  color: '#1a1a1a',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



