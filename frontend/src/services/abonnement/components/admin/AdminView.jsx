import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TypeAbonnementCard from './TypeAbonnementCard';
import TypeAbonnementForm from './TypeAbonnementForm';

export default function AdminView({ types, onRefresh }) {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    onRefresh();
  };

  return (
    <div>
      {!showForm ? (
        <div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Plus className="w-5 h-5" />
            Nouveau Type d'Abonnement
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {types.map((type) => (
              <TypeAbonnementCard key={type.id} type={type} />
            ))}
          </div>
        </div>
      ) : (
        <TypeAbonnementForm 
          onCancel={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}