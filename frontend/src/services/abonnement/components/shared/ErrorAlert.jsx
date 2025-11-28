import React from 'react';
import { XCircle } from 'lucide-react';

export default function ErrorAlert({ message, onClose }) {
  return (
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
      <span style={{ color: '#c53030', flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#c53030'
        }}
      >
        ✕
      </button>
    </div>
  );
}