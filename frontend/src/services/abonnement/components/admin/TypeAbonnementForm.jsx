import React, { useState, useEffect } from 'react';  
import { Save, X, Plus, Trash2 } from 'lucide-react';  
import { abonnementService } from '../../api/abonnementService';  
import { ligneService } from '../../../trajet/configurationService';  
import { INITIAL_FORM_DATA } from '../../constants/abonnementConstants';  
  
export default function TypeAbonnementForm({ onCancel, onSuccess }) {  
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState('');  
  const [lines, setLines] = useState([]);  
  const [selectedLineId, setSelectedLineId] = useState('');  
  
  // Charger les lignes disponibles  
    useEffect(() => {  
        const loadLines = async () => {  
        try {  
            console.log('Chargement des lignes...');  
            const linesData = await ligneService.getAllLines();  
            console.log('Données brutes reçues:', linesData);  
            
            // Corriger: utiliser 'active' au lieu de 'actif'  
            const activeLines = linesData.filter(line => line.active === true);  
            console.log('Lignes actives filtrées:', activeLines);  
            
            setLines(activeLines);  
        } catch (err) {  
            console.error('Erreur lors du chargement des lignes:', err);  
            setError('Erreur lors du chargement des lignes: ' + err.message);  
        }  
        };  
        loadLines();  
    }, []); 
  
  const handleInputChange = (e) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }));  
  };  
  
  // Ajouter une ligne depuis le dropdown  
  const handleAddLine = () => {  
    if (!selectedLineId) return;  
  
    const selectedLine = lines.find(line => line.id === selectedLineId);  
    if (!selectedLine) return;  
  
    // Vérifier si la ligne n'est pas déjà ajoutée  
    const alreadyAdded = formData.lignesAutorisees.some(  
      ligne => ligne.ligneId === selectedLineId  
    );  
  
    if (alreadyAdded) {  
      setError('Cette ligne est déjà ajoutée');  
      return;  
    }  
  
    setFormData(prev => ({  
      ...prev,  
      lignesAutorisees: [  
        ...prev.lignesAutorisees,  
        {  
          ligneId: selectedLine.id,  
          nomLigne: selectedLine.nom || selectedLine.numero  
        }  
      ]  
    }));  
  
    setSelectedLineId('');  
    setError('');  
  };  
  
  // Supprimer une ligne de la liste  
  const removeLigne = (index) => {  
    setFormData(prev => ({  
      ...prev,  
      lignesAutorisees: prev.lignesAutorisees.filter((_, i) => i !== index)  
    }));  
  };  
  
  const handleSubmit = async (e) => {  
    e.preventDefault();  
      
    if (!formData.code || !formData.nom || !formData.prix || !formData.dureeJours) {  
      setError('Veuillez remplir tous les champs obligatoires');  
      return;  
    }  
  
    try {  
      setLoading(true);  
      setError('');  
        
      const dataToSubmit = {  
        ...formData,  
        prix: parseFloat(formData.prix),  
        dureeJours: parseInt(formData.dureeJours)  
      };  
  
      await abonnementService.creerTypeAbonnement(dataToSubmit);  
      onSuccess();  
    } catch (err) {  
      setError(err.message || 'Erreur lors de la création');  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  return (  
    <div style={{  
      background: 'white',  
      borderRadius: '12px',  
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',  
      padding: '2rem'  
    }}>  
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>  
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a1a1a', margin: 0 }}>  
          Nouveau Type d'Abonnement  
        </h2>  
        <button  
          onClick={onCancel}  
          style={{  
            background: 'none',  
            border: 'none',  
            cursor: 'pointer',  
            padding: '0.5rem'  
          }}  
        >  
          <X size={20} />  
        </button>  
      </div>  
  
      {error && (  
        <div style={{  
          backgroundColor: '#fee',  
          border: '1px solid #fcc',  
          borderRadius: '6px',  
          padding: '0.75rem',  
          marginBottom: '1rem',  
          color: '#c53030'  
        }}>  
          {error}  
        </div>  
      )}  
  
      <form onSubmit={handleSubmit}>  
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>  
          <div>  
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>  
              Code *  
            </label>  
            <input  
              type="text"  
              name="code"  
              value={formData.code}  
              onChange={handleInputChange}  
              style={{  
                width: '100%',  
                padding: '0.75rem',  
                border: '2px solid #e2e8f0',  
                borderRadius: '6px',  
                fontSize: '1rem'  
              }}  
              placeholder="Ex: ABON_MENSUEL"  
            />  
          </div>  
  
          <div>  
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>  
              Nom *  
            </label>  
            <input  
              type="text"  
              name="nom"  
              value={formData.nom}  
              onChange={handleInputChange}  
              style={{  
                width: '100%',  
                padding: '0.75rem',  
                border: '2px solid #e2e8f0',  
                borderRadius: '6px',  
                fontSize: '1rem'  
              }}  
              placeholder="Ex: Abonnement Mensuel"  
            />  
          </div>  
  
          <div>  
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>  
              Description  
            </label>  
            <textarea  
              name="description"  
              value={formData.description}  
              onChange={handleInputChange}  
              rows={3}  
              style={{  
                width: '100%',  
                padding: '0.75rem',  
                border: '2px solid #e2e8f0',  
                borderRadius: '6px',  
                fontSize: '1rem',  
                resize: 'vertical'  
              }}  
              placeholder="Description du type d'abonnement..."  
            />  
          </div>  
  
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>  
            <div>  
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>  
                Prix (MAD) *  
              </label>  
              <input  
                type="number"  
                name="prix"  
                value={formData.prix}  
                onChange={handleInputChange}  
                step="0.01"  
                min="0"  
                style={{  
                  width: '100%',  
                  padding: '0.75rem',  
                  border: '2px solid #e2e8f0',  
                  borderRadius: '6px',  
                  fontSize: '1rem'  
                }}  
                placeholder="0.00"  
              />  
            </div>  
  
            <div>  
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>  
                Durée (jours) *  
              </label>  
              <input  
                type="number"  
                name="dureeJours"  
                value={formData.dureeJours}  
                onChange={handleInputChange}  
                min="1"  
                style={{  
                  width: '100%',  
                  padding: '0.75rem',  
                  border: '2px solid #e2e8f0',  
                  borderRadius: '6px',  
                  fontSize: '1rem'  
                }}  
                placeholder="30"  
              />  
            </div>  
          </div>  
  
          <div>  
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>  
              <input  
                type="checkbox"  
                name="actif"  
                checked={formData.actif}  
                onChange={(e) => setFormData(prev => ({  
                  ...prev,  
                  actif: e.target.checked  
                }))}  
                style={{ width: '1rem', height: '1rem' }}  
              />  
              <span style={{ fontWeight: '600' }}>Actif</span>  
            </label>  
          </div>  
        </div>  
  
        {/* Section Lignes Autorisées avec dropdown */}  
        <div style={{ marginBottom: '1.5rem' }}>  
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '1rem' }}>  
            Lignes Autorisées  
          </h3>  
            
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>  
            <select  
              value={selectedLineId}  
              onChange={(e) => setSelectedLineId(e.target.value)}  
              style={{  
                flex: 1,  
                padding: '0.75rem',  
                border: '2px solid #e2e8f0',  
                borderRadius: '6px',  
                fontSize: '1rem'  
              }}  
            >  
              <option value="">Sélectionner une ligne</option>  
              {lines.map((line) => (  
                <option key={line.id} value={line.id}>  
                  {line.nom || line.numero} - {line.numero}  
                </option>  
              ))}  
            </select>  
              
            <button  
              type="button"  
              onClick={handleAddLine}  
              disabled={!selectedLineId}  
              style={{  
                padding: '0.75rem 1rem',  
                backgroundColor: selectedLineId ? '#bee3f8' : '#e2e8f0',  
                color: selectedLineId ? '#2c5282' : '#718096',  
                border: 'none',  
                borderRadius: '6px',  
                fontWeight: '600',  
                cursor: selectedLineId ? 'pointer' : 'not-allowed'  
              }}  
            >  
              <Plus size={16} />  
            </button>  
          </div>  
  
          {/* Liste des lignes ajoutées */}  
          {formData.lignesAutorisees.length > 0 && (  
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>  
              {formData.lignesAutorisees.map((ligne, index) => (  
                <div key={index} style={{  
                  display: 'flex',  
                  justifyContent: 'space-between',  
                  alignItems: 'center',  
                  padding: '0.75rem',  
                  backgroundColor: '#f7fafc',  
                  border: '1px solid #e2e8f0',  
                  borderRadius: '6px'  
                }}>  
                  <span>{ligne.nomLigne}</span>  
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
                    <Trash2 size={14} />  
                  </button>  
                </div>  
              ))}  
            </div>  
          )}  
        </div>  
  
        <div style={{ display: 'flex', gap: '1rem' }}>  
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
            disabled={loading}  
            style={{  
              flex: 1,  
              padding: '0.75rem',  
              backgroundColor: '#ff6b35',  
              color: 'white',  
              border: 'none',  
              borderRadius: '8px',  
              fontWeight: '600',  
              cursor: loading ? 'not-allowed' : 'pointer'  
            }}  
          >  
            {loading ? 'Création...' : 'Créer'}  
          </button>  
        </div>  
      </form>  
    </div>  
  );  
}