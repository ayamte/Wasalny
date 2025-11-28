import React from 'react';
import { Ticket } from 'lucide-react';
import TicketCard from './TicketCard';

export default function TicketList({ tickets, onView, onAnnuler, onRembourser, actionLoading }) {
  if (tickets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#718096' }}>
        <Ticket style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', opacity: 0.5 }} />
        <p>Aucun ticket pour le moment</p>
        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
          Vos tickets apparaîtront ici après vos achats
        </p>
      </div>
    );
  }

  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          onView={onView}
          onAnnuler={onAnnuler}
          onRembourser={onRembourser}
          actionLoading={actionLoading}
        />
      ))}
    </div>
  );
}