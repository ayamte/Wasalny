import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ChevronLeft, Zap, Save, X, ArrowRight } from 'lucide-react'
import './lignes.css'
import { ligneService, stationService, busService } from '../../configurationService'

export default function LinesPage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState([])
  const [stations, setStations] = useState([])
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingLineId, setEditingLineId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    nom: '',
    selectedStations: [],
    selectedBusId: '',
    prixStandard: 10.0,
    vitesseStandardKmH: 40.0,
  })
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [stationsData, linesData, busesData] = await Promise.all([
        stationService.getAllStations(),
        ligneService.getAllLines(),
        busService.getAllBuses()
      ])
      setStations(stationsData.filter(s => s.active))
      setLines(linesData)
      setBuses(busesData.filter(b => b.active))
    } catch (error) {
      console.error('Error loading data:', error)
      showToast('❌ Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleAddLine = () => {
    setEditingLineId(null)
    setFormData({
      number: '',
      nom: '',
      selectedStations: [],
      selectedBusId: '',
      prixStandard: 10.0,
      vitesseStandardKmH: 40.0,
    })
    setShowForm(true)
  }

  const handleEditLine = (line) => {
    setEditingLineId(line.id)
    // Extract station IDs in order from the line's stations array
    const stationIds = line.stations ? line.stations.map(s => s.id) : []
    setFormData({
      number: line.numero,
      nom: line.nom,
      selectedStations: stationIds,
      selectedBusId: '',
      prixStandard: line.prixStandard || 10.0,
      vitesseStandardKmH: line.vitesseStandardKmH || 40.0,
    })
    setShowForm(true)
  }

  const handleAddStationToLine = (stationId) => {
    if (!formData.selectedStations.includes(stationId)) {
      setFormData({
        ...formData,
        selectedStations: [...formData.selectedStations, stationId],
      })
    }
  }

  const handleRemoveStationFromLine = (stationId) => {
    setFormData({
      ...formData,
      selectedStations: formData.selectedStations.filter(id => id !== stationId),
    })
  }

  const handleSaveLine = async () => {
    if (!formData.number || !formData.nom || formData.selectedStations.length < 2) {
      showToast('❌ Veuillez remplir tous les champs requis (au moins 2 stations)')
      return
    }

    try {
      setLoading(true)

      // Build DTO for backend
      const dto = {
        numero: formData.number,
        nom: formData.nom,
        stationDepartId: formData.selectedStations[0],
        stationsIntermediairesIds: formData.selectedStations.slice(1, -1),
        stationArriveeId: formData.selectedStations[formData.selectedStations.length - 1],
        prixStandard: parseFloat(formData.prixStandard),
        vitesseStandardKmH: parseFloat(formData.vitesseStandardKmH),
        active: true
      }

      if (editingLineId) {
        await ligneService.updateLine(editingLineId, dto)
        showToast('✅ Ligne modifiée avec succès')
      } else {
        await ligneService.createLine(dto)
        showToast('✅ Ligne ajoutée avec succès')
      }

      setShowForm(false)
      loadData()
    } catch (error) {
      console.error('Error saving line:', error)
      showToast('❌ Erreur: ' + (error.message || 'Erreur lors de l\'enregistrement'))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLine = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) return

    try {
      setLoading(true)
      await ligneService.deleteLine(id)
      showToast('✅ Ligne supprimée avec succès')
      loadData()
    } catch (error) {
      console.error('Error deleting line:', error)
      showToast('❌ Erreur: ' + (error.message || 'Erreur lors de la suppression'))
    } finally {
      setLoading(false)
    }
  }

  const getStationName = (stationId) => {
    const station = stations.find(s => s.id === stationId)
    return station?.nom || 'Station inconnue'
  }

  return (
    <main className="lignes-main">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="lignes-toast">
          {toastMessage}
        </div>
      )}

      {/* Navigation Bar */}
      {/* <nav className="lignes-nav">
        <div className="lignes-nav-content">
          <p className="lignes-nav-title">Gestion des Stations et Lignes</p>
          <div className="lignes-nav-buttons">
            <button 
              className="lignes-btn lignes-btn-outline"
              onClick={() => navigate('/admin/stations')}
            >
              Stations
            </button>
            <button 
              className="lignes-btn lignes-btn-primary"
              onClick={() => navigate('/admin/configuration')}
            >
              Configuration Horaires
            </button>
          </div>
        </div>
      </nav> */}

      {/* Header */}
      <header className="lignes-header">
        <div className="lignes-container">
          <div className="lignes-header-content">
            <div className="lignes-header-left">
              <button
                className="lignes-back-btn"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="lignes-title">Gestion des Lignes</h1>
                <p className="lignes-subtitle">Configurer les lignes, les stations et les bus</p>
              </div>
            </div>
            <button
              className="lignes-btn lignes-btn-primary"
              onClick={handleAddLine}
            >
              <Plus size={18} />
              Nouvelle Ligne
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="lignes-container lignes-content">
        <div className="lignes-grid">
          {/* Form Card */}
          {showForm && (
            <div className="lignes-card lignes-card-form">
              <div className="lignes-card-header">
                <div className="lignes-card-header-title">
                  <Zap size={20} />
                  {editingLineId ? 'Modifier la Ligne' : 'Ajouter une Ligne'}
                </div>
              </div>
              <div className="lignes-card-content">
                <div className="lignes-form-grid">
                  {/* Ligne Number */}
                  <div>
                    <label className="lignes-label">Numéro de Ligne *</label>
                    <input
                      type="text"
                      placeholder="Ex: L01, L02"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="lignes-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Ligne Name */}
                  <div>
                    <label className="lignes-label">Nom de Ligne *</label>
                    <input
                      type="text"
                      placeholder="Ex: Casa-Rabat, Ligne Express"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="lignes-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Prix Standard */}
                  <div>
                    <label className="lignes-label">Prix Standard (MAD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Ex: 10.00"
                      value={formData.prixStandard}
                      onChange={(e) => setFormData({ ...formData, prixStandard: e.target.value })}
                      className="lignes-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Vitesse Standard */}
                  <div>
                    <label className="lignes-label">Vitesse Standard (km/h) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Ex: 40.0"
                      value={formData.vitesseStandardKmH}
                      onChange={(e) => setFormData({ ...formData, vitesseStandardKmH: e.target.value })}
                      className="lignes-input"
                      disabled={loading}
                      required
                    />
                  </div>

                  {/* Stations Selection */}
                  <div>
                    <label className="lignes-label">Stations (dans l'ordre du trajet) *</label>
                    {loading ? (
                      <p className="lignes-loading-text">Chargement des stations...</p>
                    ) : stations.length === 0 ? (
                      <p className="lignes-empty-text">Aucune station active trouvée</p>
                    ) : (
                      <div className="lignes-stations-selector">
                        <p className="lignes-stations-title">Stations disponibles:</p>
                        <div className="lignes-stations-buttons">
                          {stations.map(station => (
                            <button
                              key={station.id}
                              onClick={() => handleAddStationToLine(station.id)}
                              disabled={loading || formData.selectedStations.includes(station.id)}
                              className={`lignes-station-btn ${formData.selectedStations.includes(station.id) ? 'active' : ''}`}
                            >
                              {station.nom}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Selected Stations Order */}
                    {formData.selectedStations.length > 0 && (
                      <div className="lignes-trajectory">
                        <p className="lignes-trajectory-title">Trajet sélectionné:</p>
                        <div className="lignes-trajectory-items">
                          {formData.selectedStations.map((stationId, idx) => (
                            <div key={stationId} className="lignes-trajectory-item">
                              <div className="lignes-trajectory-station">
                                <p>
                                  {idx === 0 && '🔴 '}
                                  {idx === formData.selectedStations.length - 1 && '🎯 '}
                                  {getStationName(stationId)}
                                </p>
                              </div>
                              <button
                                onClick={() => handleRemoveStationFromLine(stationId)}
                                className="lignes-remove-btn"
                              >
                                X
                              </button>
                              {idx < formData.selectedStations.length - 1 && (
                                <ArrowRight size={16} />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>


                  <div className="lignes-form-actions">
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setFormData({
                          number: '',
                          nom: '',
                          selectedStations: [],
                          selectedBusId: '',
                          prixStandard: 10.0,
                          vitesseStandardKmH: 40.0,
                        })
                      }}
                      className="lignes-btn lignes-btn-outline"
                      disabled={loading}
                    >
                      <X size={18} />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveLine}
                      className="lignes-btn lignes-btn-primary"
                      disabled={loading}
                    >
                      <Save size={18} />
                      {loading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lines List */}
          <div className="lignes-list">
            {loading ? (
              <div className="lignes-loading">
                <p>Chargement des lignes...</p>
              </div>
            ) : lines.length === 0 ? (
              <div className="lignes-empty">
                <p>Aucune ligne trouvée. Créez votre première ligne!</p>
              </div>
            ) : (
              lines.map(line => (
                <div key={line.id} className="lignes-card">
                  <div className="lignes-card-content lignes-line-item">
                    <div className="lignes-line-info">
                      <h3 className="lignes-line-number">{line.numero}</h3>
                      <p className="lignes-line-subtitle">{line.nom}</p>
                      <p className="lignes-line-label">Trajet:</p>
                      <div className="lignes-line-trajectory">
                        {line.stations && line.stations.map((station, idx) => (
                          <div key={station.id} className="lignes-line-station-item">
                            <span className="lignes-line-station">
                              {station.nom}
                            </span>
                            {idx < line.stations.length - 1 && (
                              <ArrowRight size={14} />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="lignes-line-details">
                        <p className="lignes-line-detail">
                          <strong>Prix:</strong> {line.prixStandard} MAD
                        </p>
                        <p className="lignes-line-detail">
                          <strong>Vitesse:</strong> {line.vitesseStandardKmH} km/h
                        </p>
                        <p className="lignes-line-detail">
                          <strong>Distance:</strong> {line.distanceTotaleKm ? line.distanceTotaleKm.toFixed(2) : '0'} km
                        </p>
                      </div>
                    </div>
                    <div className="lignes-actions">
                      <button
                        onClick={() => handleEditLine(line)}
                        className="lignes-btn lignes-btn-edit"
                        disabled={loading}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLine(line.id)}
                        className="lignes-btn lignes-btn-delete"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
