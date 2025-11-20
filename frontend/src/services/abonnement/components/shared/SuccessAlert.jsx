import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessAlert({ message }) {
  return (
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
      <span style={{ color: '#22543d', fontWeight: '600' }}>{message}</span>
    </div>
  );
}