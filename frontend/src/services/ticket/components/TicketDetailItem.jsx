import React from 'react';

export default function TicketDetailItem({ label, value, mono, span2 }) {
  return (
    <div style={{
      padding: '0.75rem',
      backgroundColor: '#f7fafc',
      borderRadius: '6px',
      gridColumn: span2 ? 'span 2' : 'span 1'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.25rem' }}>
        {label}
      </div>
      <div style={{
        fontWeight: '600',
        color: '#1a1a1a',
        fontFamily: mono ? 'monospace' : 'inherit',
        fontSize: mono ? '0.875rem' : 'inherit'
      }}>
        {value}
      </div>
    </div>
  );
}