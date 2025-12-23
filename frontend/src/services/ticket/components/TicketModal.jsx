import React, { useRef } from 'react';
import { Download, QrCode } from 'lucide-react';
import { STATUS_CONFIG } from '../constants/ticketConstants';
import TicketDetailItem from './TicketDetailItem';
import { canAnnuler, canRembourser, formatDate } from '../utils/ticketHelpers';

function StatusBadge({ statut }) {
  const { class: statusClass, icon: Icon, label } = STATUS_CONFIG[statut] || {};

  return (
    <span className={`status-badge ${statusClass}`}>
      <Icon className="w-4 h-4" />
      {label || statut}
    </span>
  );
}

export default function TicketModal({ ticket, onClose, onAnnuler, onRembourser, actionLoading }) {
  const ticketRef = useRef(null);
  
  if (!ticket) return null;

  // Données statiques pour le QR code
  const qrData = JSON.stringify({
    ticketId: ticket.id,
    numeroTicket: ticket.numeroTicket,
    tripId: ticket.tripId,
    clientId: ticket.clientId,
    dateAchat: ticket.dateAchat
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  // Fonction pour télécharger le ticket en PDF
  const handleDownloadPDF = () => {
    if (!ticketRef.current) return;

    // Créer un contenu HTML pour le PDF
    const ticketContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Ticket ${ticket.numeroTicket}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 600px;
              margin: 0 auto;
            }
            .ticket-header {
              text-align: center;
              border-bottom: 3px solid #ff6b35;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .ticket-header h1 {
              color: #ff6b35;
              margin: 0;
            }
            .ticket-body {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 20px;
            }
            .ticket-item {
              padding: 10px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .ticket-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 5px;
            }
            .ticket-value {
              font-size: 16px;
              font-weight: bold;
              color: #1a1a1a;
            }
            .qr-section {
              text-align: center;
              margin: 20px 0;
              padding: 20px;
              border: 2px dashed #e5e7eb;
              border-radius: 8px;
            }
            .qr-section img {
              max-width: 200px;
              height: auto;
            }
            .ticket-footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="ticket-header">
            <h1>WASALNY</h1>
            <p>Ticket de Transport</p>
          </div>
          <div class="ticket-body">
            <div class="ticket-item">
              <div class="ticket-label">Numéro de Ticket</div>
              <div class="ticket-value">${ticket.numeroTicket}</div>
            </div>
            <div class="ticket-item">
              <div class="ticket-label">Statut</div>
              <div class="ticket-value">${ticket.statut}</div>
            </div>
            <div class="ticket-item">
              <div class="ticket-label">Prix</div>
              <div class="ticket-value">${ticket.prix} MAD</div>
            </div>
            <div class="ticket-item">
              <div class="ticket-label">Trajet</div>
              <div class="ticket-value">${ticket.numeroTrip}</div>
            </div>
            <div class="ticket-item" style="grid-column: 1 / -1;">
              <div class="ticket-label">Destination</div>
              <div class="ticket-value">${ticket.nomStationFinale}</div>
            </div>
            <div class="ticket-item" style="grid-column: 1 / -1;">
              <div class="ticket-label">Date d'achat</div>
              <div class="ticket-value">${formatDate(ticket.dateAchat)}</div>
            </div>
            <div class="ticket-item" style="grid-column: 1 / -1;">
              <div class="ticket-label">Transaction ID</div>
              <div class="ticket-value" style="font-family: monospace; font-size: 12px;">${ticket.transactionId}</div>
            </div>
          </div>
          <div class="qr-section">
            <p style="margin-bottom: 10px; font-weight: bold;">Code QR</p>
            <img src="${qrCodeUrl}" alt="QR Code" />
          </div>
          <div class="ticket-footer">
            <p>Merci d'avoir choisi Wasalny</p>
            <p>Présentez ce ticket au conducteur lors de l'embarquement</p>
          </div>
        </body>
      </html>
    `;

    // Ouvrir une nouvelle fenêtre avec le contenu et imprimer
    const printWindow = window.open('', '_blank');
    printWindow.document.write(ticketContent);
    printWindow.document.close();
    
    // Attendre que l'image soit chargée avant d'imprimer
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          maxWidth: '42rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={ticketRef}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Détails du ticket
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginTop: '1rem'
          }}>
            <TicketDetailItem label="Numéro" value={ticket.numeroTicket} mono />
            <TicketDetailItem label="Statut" value={<StatusBadge statut={ticket.statut} />} />
            <TicketDetailItem label="Prix" value={`${ticket.prix} MAD`} />
            <TicketDetailItem label="Trajet" value={ticket.numeroTrip} />
            <TicketDetailItem label="Destination" value={ticket.nomStationFinale} span2 />
            <TicketDetailItem
              label="Date d'achat"
              value={formatDate(ticket.dateAchat)}
              span2
            />
            <TicketDetailItem label="Transaction ID" value={ticket.transactionId} mono span2 />
          </div>

          {/* Section QR Code */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            textAlign: 'center',
            border: '2px dashed #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <QrCode size={20} color="#ff6b35" />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1a1a1a' }}>
                Code QR du Ticket
              </h4>
            </div>
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              style={{
                width: '200px',
                height: '200px',
                margin: '0 auto',
                display: 'block',
                border: '4px solid white',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
            />
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
              Présentez ce code au conducteur
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minWidth: '150px'
            }}
          >
            <Download size={18} />
            Télécharger PDF
          </button>

          {canAnnuler(ticket) && (
            <button
              onClick={() => onAnnuler(ticket.id)}
              disabled={actionLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#fed7d7',
                color: '#c53030',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1,
                minWidth: '150px'
              }}
            >
              {actionLoading ? 'Annulation...' : 'Annuler le ticket'}
            </button>
          )}

          {canRembourser(ticket) && (
            <button
              onClick={() => onRembourser(ticket.id)}
              disabled={actionLoading}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#bee3f8',
                color: '#2c5282',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.6 : 1,
                minWidth: '150px'
              }}
            >
              {actionLoading ? 'Remboursement...' : 'Demander remboursement'}
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#e2e8f0',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              minWidth: '150px'
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}