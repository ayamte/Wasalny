import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ChevronLeft, Zap, Save, X, ArrowRight, Bus } from 'lucide-react'
import './lignes.css'

// Mock data
const mockStations = [
  { id: '1', name: 'Casablanca', latitude: 33.5731, longitude: -7.5898 },
  { id: '2', name: 'Rabat', latitude: 34.0209, longitude: -6.8416 },
  { id: '3', name: 'Fès', latitude: 34.0331, longitude: -5.0033 },
  { id: '4', name: 'Marrakech', latitude: 31.6295, longitude: -8.0089 },
  { id: '5', name: 'Tanger', latitude: 35.7595, longitude: -5.8345 },
  { id: '6', name: 'Agadir', latitude: 30.4278, longitude: -9.5975 },
]

const mockLines = [
  {
    id: '1',
    number: 'Ligne 1',
    stations: [
      { stationId: '1', order: 1, stationType: 'depart' },
      { stationId: '2', order: 2, stationType: 'intermediaire' },
      { stationId: '3', order: 3, stationType: 'arrivee' },
    ],
    buses: ['BUS-001', 'BUS-002'],
  },
]

export default function LinesPage() {
  const navigate = useNavigate()
  const [lines, setLines] = useState(mockLines)
  const [editingLineId, setEditingLineId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    selectedStations: [],
    buses: [],
    newBusInput: '',
  })
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleAddLine = () => {
    setEditingLineId(null)
    setFormData({
      number: '',
      selectedStations: [],
      buses: [],
      newBusInput: '',
    })
    setShowForm(true)
  }

  const handleEditLine = (line) => {
    setEditingLineId(line.id)
    setFormData({
      number: line.number,
      selectedStations: line.stations.map(ls => ls.stationId),
      buses: [...line.buses],
      newBusInput: '',
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

  const handleAddBus = () => {
    if (formData.newBusInput.trim() && !formData.buses.includes(formData.newBusInput)) {
      setFormData({
        ...formData,
        buses: [...formData.buses, formData.newBusInput],
        newBusInput: '',
      })
    }
  }

  const handleRemoveBus = (bus) => {
    setFormData({
      ...formData,
      buses: formData.buses.filter(b => b !== bus),
    })
  }

  const handleSaveLine = () => {
    if (!formData.number || formData.selectedStations.length < 2 || formData.buses.length === 0) {
      showToast('Veuillez remplir tous les champs requis')
      return
    }

    if (editingLineId) {
      setLines(
        lines.map(l =>
          l.id === editingLineId
            ? {
                ...l,
                number: formData.number,
                stations: formData.selectedStations.map((stationId, idx) => ({
                  stationId,
                  order: idx + 1,
                  stationType:
                    idx === 0 ? 'depart' : idx === formData.selectedStations.length - 1 ? 'arrivee' : 'intermediaire',
                })),
                buses: formData.buses,
              }
            : l
        )
      )
      showToast('Ligne modifiée avec succès')
    } else {
      const newLine = {
        id: Date.now().toString(),
        number: formData.number,
        stations: formData.selectedStations.map((stationId, idx) => ({
          stationId,
          order: idx + 1,
          stationType:
            idx === 0 ? 'depart' : idx === formData.selectedStations.length - 1 ? 'arrivee' : 'intermediaire',
        })),
        buses: formData.buses,
      }
      setLines([...lines, newLine])
      showToast('Ligne ajoutée avec succès')
    }

    setShowForm(false)
  }

  const handleDeleteLine = (id) => {
    setLines(lines.filter(l => l.id !== id))
    showToast('Ligne supprimée avec succès')
  }

  const getStationName = (stationId) => {
    const station = mockStations.find(s => s.id === stationId)
    return station?.name || 'Station inconnue'
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
      <nav className="lignes-nav">
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
      </nav>

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
                    <label className="lignes-label">Numéro de Ligne</label>
                    <input
                      type="text"
                      placeholder="Ex: Ligne 1, L01, Casa-Rabat"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="lignes-input"
                    />
                  </div>

                  {/* Stations Selection */}
                  <div>
                    <label className="lignes-label">Stations (dans l'ordre du trajet)</label>
                    <div className="lignes-stations-selector">
                      <p className="lignes-stations-title">Stations disponibles:</p>
                      <div className="lignes-stations-buttons">
                        {mockStations.map(station => (
                          <button
                            key={station.id}
                            onClick={() => handleAddStationToLine(station.id)}
                            disabled={formData.selectedStations.includes(station.id)}
                            className={`lignes-station-btn ${formData.selectedStations.includes(station.id) ? 'active' : ''}`}
                          >
                            {station.name}
                          </button>
                        ))}
                      </div>
                    </div>

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

                  {/* Buses */}
                  <div>
                    <label className="lignes-label">Bus au départ de la ligne</label>
                    <div className="lignes-bus-input-group">
                      <input
                        type="text"
                        placeholder="Ex: BUS-001"
                        value={formData.newBusInput}
                        onChange={(e) => setFormData({ ...formData, newBusInput: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddBus()
                          }
                        }}
                        className="lignes-input"
                      />
                      <button
                        onClick={handleAddBus}
                        className="lignes-btn lignes-btn-primary"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="lignes-buses-list">
                      {formData.buses.map(bus => (
                        <div key={bus} className="lignes-bus-tag">
                          <Bus size={16} />
                          <span>{bus}</span>
                          <button
                            onClick={() => handleRemoveBus(bus)}
                            className="lignes-bus-remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lignes-form-actions">
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setFormData({
                          number: '',
                          selectedStations: [],
                          buses: [],
                          newBusInput: '',
                        })
                      }}
                      className="lignes-btn lignes-btn-outline"
                    >
                      <X size={18} />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveLine}
                      className="lignes-btn lignes-btn-primary"
                    >
                      <Save size={18} />
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lines List */}
          <div className="lignes-list">
            {lines.map(line => (
              <div key={line.id} className="lignes-card">
                <div className="lignes-card-content lignes-line-item">
                  <div className="lignes-line-info">
                    <h3 className="lignes-line-number">{line.number}</h3>
                    <p className="lignes-line-label">Trajet:</p>
                    <div className="lignes-line-trajectory">
                      {line.stations.map((ls, idx) => (
                        <div key={ls.stationId} className="lignes-line-station-item">
                          <span className="lignes-line-station">
                            {getStationName(ls.stationId)}
                          </span>
                          {idx < line.stations.length - 1 && (
                            <ArrowRight size={14} />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="lignes-line-label">Bus au départ:</p>
                    <div className="lignes-line-buses">
                      {line.buses.map(bus => (
                        <span key={bus} className="lignes-bus-badge">
                          <Bus size={14} />
                          {bus}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="lignes-actions">
                    <button
                      onClick={() => handleEditLine(line)}
                      className="lignes-btn lignes-btn-edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLine(line.id)}
                      className="lignes-btn lignes-btn-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
