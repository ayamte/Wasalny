import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { abonnementService } from '../../api/abonnementService';
import { INITIAL_FORM_DATA } from '../../constants/abonnementConstants';

function FormInput({ label, value, onChange, type = 'text', placeholder, required, textarea }) {
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem'
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
        {label} {required && <span style={{ color: '#e53e3e' }}>*</span>}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={inputStyle}
        />
      )}
    </div>
  );
}

export default function TypeAbonnementForm({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [newLigne, setNewLigne] = useState({ ligneId: '', nomLigne: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await abonnementService.creerTypeAbonnement(formData);
      setFormData(INITIAL_FORM_DATA);
      onSuccess();
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const addLigne = () => {
    if (newLigne.ligneId && newLigne.nomLigne) {
      setFormData(prev => ({
        ...prev,
        lignesAutorisees: [...prev.lignesAutorisees, { ...newLigne, ligneId: newLigne.ligneId }]
      }));
      setNewLigne({ ligneId: '', nomLigne: '' });
    }
  };

  const removeLigne = (index) => {
    setFormData(prev => ({
      ...prev,
      lignesAutorisees: prev.lignesAutorisees.filter((_, i) => i !== index)
    }));
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Nouveau Type d'Abonnement
      </h2>
      
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="MENSUEL"
          required
        />
        <FormInput
          label="Nom"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          placeholder="Abonnement Mensuel"
          required
        />
        <FormInput
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Valable 30 jours"
          textarea
        />
        <FormInput
          label="Prix (MAD)"
          type="number"
          value={formData.prix}
          onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
          placeholder="150"
          required
        />
        <FormInput
          label="Durée (jours)"
          type="number"
          value={formData.dureeJours}
          onChange={(e) => setFormData({ ...formData, dureeJours: e.target.value })}
          placeholder="30"
          required
        />

        {/* Lignes autorisées */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
            Lignes Autorisées
          </label>
          {formData.lignesAutorisees.map((ligne, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: '#f7fafc',
              borderRadius: '6px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ flex: 1, fontSize: '0.875rem' }}>{ligne.nomLigne}</span>
              <button
                type="button"
                onClick={() => removeLigne(index)}
                style={{
                  padding: '0.25rem',
                  backgroundColor: '#fed7d7',
                  color: '#c53030',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              placeholder="ID Ligne (UUID)"
              value={newLigne.ligneId}
              onChange={(e) => setNewLigne({ ...newLigne, ligneId: e.target.value })}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '6px'
              }}
            />
            <input
              type="text"
              placeholder="Nom Ligne"
              value={newLigne.nomLigne}
              onChange={(e) => setNewLigne({ ...newLigne, nomLigne: e.target.value })}
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '6px'
              }}
            />
            <button
              type="button"
              onClick={addLigne}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#bee3f8',
                color: '#2c5282',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#e2e8f0',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Annuler
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}