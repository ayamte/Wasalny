import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ChevronLeft, MapPin, Save, X } from 'lucide-react'
import './stations.css'

// Mock data
const mockStations = [
  { id: '1', name: 'Casablanca', latitude: 33.5731, longitude: -7.5898 },
  { id: '2', name: 'Rabat', latitude: 34.0209, longitude: -6.8416 },
  { id: '3', name: 'Fès', latitude: 34.0331, longitude: -5.0033 },
  { id: '4', name: 'Marrakech', latitude: 31.6295, longitude: -8.0089 },
  { id: '5', name: 'Tanger', latitude: 35.7595, longitude: -5.8345 },
  { id: '6', name: 'Agadir', latitude: 30.4278, longitude: -9.5975 },
]

export default function StationsPage() {
  const navigate = useNavigate()
  const [stations, setStations] = useState(mockStations)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
  })
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleAddStation = () => {
    setEditingId(null)
    setFormData({ name: '', latitude: '', longitude: '' })
    setShowForm(true)
  }

  const handleEditStation = (station) => {
    setEditingId(station.id)
    setFormData({
      name: station.name,
      latitude: station.latitude.toString(),
      longitude: station.longitude.toString(),
    })
    setShowForm(true)
  }

  const handleSaveStation = () => {
    if (!formData.name || !formData.latitude || !formData.longitude) {
      showToast('Tous les champs sont obligatoires')
      return
    }

    // Validate latitude and longitude
    const lat = parseFloat(formData.latitude)
    const lon = parseFloat(formData.longitude)
    
    if (isNaN(lat) || isNaN(lon)) {
      showToast('Latitude et longitude doivent être des nombres')
      return
    }

    if (lat < -90 || lat > 90) {
      showToast('Latitude doit être entre -90 et 90')
      return
    }

    if (lon < -180 || lon > 180) {
      showToast('Longitude doit être entre -180 et 180')
      return
    }

    if (editingId) {
      setStations(
        stations.map(s =>
          s.id === editingId
            ? {
                ...s,
                name: formData.name,
                latitude: lat,
                longitude: lon,
              }
            : s
        )
      )
      showToast('Station modifiée avec succès')
    } else {
      const newStation = {
        id: Date.now().toString(),
        name: formData.name,
        latitude: lat,
        longitude: lon,
      }
      setStations([...stations, newStation])
      showToast('Station ajoutée avec succès')
    }

    setShowForm(false)
    setFormData({ name: '', latitude: '', longitude: '' })
  }

  const handleDeleteStation = (id) => {
    setStations(stations.filter(s => s.id !== id))
    showToast('Station supprimée avec succès')
  }

  return (
    <main className="stations-main">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="stations-toast">
          {toastMessage}
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="stations-nav">
        <div className="stations-nav-content">
          <p className="stations-nav-title">Gestion des Stations et Lignes</p>
          <button
            className="stations-btn stations-btn-primary"
            onClick={() => navigate('/admin/configuration')}
          >
            Configuration Horaires
          </button>
        </div>
      </nav>

      {/* Header */}
      <header className="stations-header">
        <div className="stations-container">
          <div className="stations-header-content">
            <div className="stations-header-left">
              <button
                className="stations-back-btn"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h1 className="stations-title">Gestion des Stations</h1>
                <p className="stations-subtitle">Ajouter et modifier les stations avec leur localisation</p>
              </div>
            </div>
            <button
              className="stations-btn stations-btn-primary"
              onClick={handleAddStation}
            >
              <Plus size={18} />
              Nouvelle Station
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="stations-container stations-content">
        <div className="stations-grid">
          {/* Form Card */}
          {showForm && (
            <div className="stations-card stations-card-form">
              <div className="stations-card-header">
                <div className="stations-card-header-title">
                  <MapPin size={20} />
                  {editingId ? 'Modifier la Station' : 'Ajouter une Station'}
                </div>
              </div>
              <div className="stations-card-content">
                <div className="stations-form-grid">
                  <div>
                    <label className="stations-label">Nom de la Station</label>
                    <input
                      type="text"
                      placeholder="Ex: Casablanca"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="stations-input"
                    />
                  </div>
                  <div className="stations-coords-grid">
                    <div>
                      <label className="stations-label">Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Ex: 33.5731"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="stations-input"
                      />
                    </div>
                    <div>
                      <label className="stations-label">Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Ex: -7.5898"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="stations-input"
                      />
                    </div>
                  </div>
                  <div className="stations-form-actions">
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setFormData({ name: '', latitude: '', longitude: '' })
                      }}
                      className="stations-btn stations-btn-outline"
                    >
                      <X size={18} />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveStation}
                      className="stations-btn stations-btn-primary"
                    >
                      <Save size={18} />
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stations List */}
          <div className="stations-list">
            {stations.map(station => (
              <div key={station.id} className="stations-card">
                <div className="stations-card-content stations-station-item">
                  <div className="stations-station-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="stations-station-info">
                    <h3 className="stations-station-name">{station.name}</h3>
                    <p className="stations-station-coords">
                      Lat: {station.latitude.toFixed(4)} | Long: {station.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div className="stations-actions">
                    <button
                      onClick={() => handleEditStation(station)}
                      className="stations-btn stations-btn-edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStation(station.id)}
                      className="stations-btn stations-btn-delete"
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
