import React from 'react';
import { Filter } from 'lucide-react';

export default function NotificationFilter({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'Toutes', count: null },
    { id: 'unread', label: 'Non lues', count: null },
    { id: 'payment', label: 'Paiements', count: null },
    { id: 'ticket', label: 'Tickets', count: null },
    { id: 'subscription', label: 'Abonnements', count: null }
  ];

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Filter size={20} style={{ color: '#6b7280' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280' }}>
          Filtrer par
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeFilter === filter.id ? '#3b82f6' : '#f3f4f6',
              color: activeFilter === filter.id ? 'white' : '#374151',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: activeFilter === filter.id ? '0 4px 6px rgba(59, 130, 246, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeFilter !== filter.id) {
                e.currentTarget.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== filter.id) {
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
