import React, { useState, useEffect } from 'react';
import { Ticket, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ticketService } from './api/ticketService';
import { MOCK_CLIENT_ID } from './constants/ticketConstants';
import TicketList from './components/TicketList';
import TicketModal from './components/TicketModal';
import './styles/Ticket.css';

export default function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTicketsClient(MOCK_CLIENT_ID);
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnuler = async (ticketId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce ticket ?')) return;

    try {
      setActionLoading(true);
      setError(null);
      await ticketService.annulerTicket(ticketId);
      setSuccessMessage('Ticket annulé avec succès');
      await loadTickets();
      setSelectedTicket(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRembourser = async (ticketId) => {
    if (!window.confirm('Demander le remboursement de ce ticket ?')) return;

    try {
      setActionLoading(true);
      setError(null);
      await ticketService.rembourserTicket(ticketId);
      setSuccessMessage('Remboursement effectué avec succès');
      await loadTickets();
      setSelectedTicket(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
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
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Ticket style={{ width: '2rem', height: '2rem', color: '#ff6b35' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>
              Mes Tickets
            </h1>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0fff4',
            border: '1px solid #9ae6b4',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <CheckCircle style={{ width: '1.5rem', height: '1.5rem', color: '#38a169' }} />
            <span style={{ color: '#22543d', fontWeight: '600' }}>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fff5f5',
            border: '1px solid #feb2b2',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <XCircle style={{ width: '1.25rem', height: '1.25rem', color: '#e53e3e' }} />
            <span style={{ color: '#c53030' }}>{error}</span>
          </div>
        )}

        {/* Tickets List */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem'
        }}>
          <TicketList
            tickets={tickets}
            onView={setSelectedTicket}
            onAnnuler={handleAnnuler}
            onRembourser={handleRembourser}
            actionLoading={actionLoading}
          />
        </div>
      </div>

      <TicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onAnnuler={handleAnnuler}
        onRembourser={handleRembourser}
        actionLoading={actionLoading}
      />
    </div>
  );
}