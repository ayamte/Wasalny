import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock } from 'lucide-react';
import { abonnementService } from '../api/abonnementService';
import '../styles/Abonnement.css';  
  
export default function TypeAbonnementSelection() {  
  const navigate = useNavigate();  
  const [types, setTypes] = useState([]);  
  const [loading, setLoading] = useState(true);  
  
  useEffect(() => {  
    loadTypes();  
  }, []);  
  
  const loadTypes = async () => {  
    try {  
      setLoading(true);  
      const data = await abonnementService.getTypesAbonnementActifs();  
      setTypes(data);  
    } catch (err) {  
      console.error(err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  const handleSelect = (type) => {  
    navigate('/paiement', {  
      state: {  
        typeService: 'ABONNEMENT',  
        referenceService: type.id,  
        montant: type.prix  
      }  
    });  
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
        <div style={{  
          background: 'white',  
          borderRadius: '12px',  
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  
          padding: '2rem',  
          marginBottom: '1.5rem'  
        }}>  
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>  
            <CreditCard style={{ width: '2rem', height: '2rem', color: '#ff6b35' }} />  
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>  
              Choisir un abonnement  
            </h1>  
          </div>  
        </div>  
  
        <div style={{  
          display: 'grid',  
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',  
          gap: '1.5rem'  
        }}>  
          {types.map((type) => (  
            <div key={type.id} style={{  
              background: 'white',  
              borderRadius: '12px',  
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  
              padding: '2rem',  
              cursor: 'pointer',  
              transition: 'all 0.3s',  
              border: '3px solid transparent'  
            }}  
            onMouseEnter={(e) => {  
              e.currentTarget.style.borderColor = '#ff6b35';  
              e.currentTarget.style.transform = 'translateY(-4px)';  
            }}  
            onMouseLeave={(e) => {  
              e.currentTarget.style.borderColor = 'transparent';  
              e.currentTarget.style.transform = 'translateY(0)';  
            }}  
            onClick={() => handleSelect(type)}>  
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '0.5rem' }}>  
                {type.nom}  
              </h3>  
              <p style={{ color: '#718096', marginBottom: '1rem' }}>  
                {type.description}  
              </p>  
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35', marginBottom: '0.5rem' }}>  
                {type.prix} MAD  
              </div>  
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>  
                {type.dureeJours} jours  
              </div>  
            </div>  
          ))}  
        </div>  
      </div>  
    </div>  
  );  
}