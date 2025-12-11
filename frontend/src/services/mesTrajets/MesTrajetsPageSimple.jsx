import React from 'react';
import Navbar from '../../components/Navbar';

export default function MesTrajetsPageSimple() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '50px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '48px', color: '#2563eb' }}>🚌 MES TRAJETS</h1>
        <p style={{ fontSize: '24px', marginTop: '20px' }}>Cette page fonctionne correctement !</p>
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', maxWidth: '600px', margin: '40px auto' }}>
          <h2>Prochaines étapes :</h2>
          <ul style={{ textAlign: 'left', lineHeight: '2' }}>
            <li>✅ La route /mes-trajets est accessible</li>
            <li>✅ Le composant se charge correctement</li>
            <li>⏳ Prêt pour ajouter la carte et la liste des tickets</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
