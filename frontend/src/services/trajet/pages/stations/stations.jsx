import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, ChevronLeft, MapPin, Save, X } from 'lucide-react'
import { stationService } from '../../configurationService'
import './stations.css'

export default function StationsPage() {
  const navigate = useNavigate()
  const [stations, setStations] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  // Force reload - integrated with backend API
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    capacity: 50,
    active: true,
  })
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (message) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const showError = (message) => {
    showToast(`❌ ${message}`)
  }

  const showSuccess = (message) => {
    showToast(`✅ ${message}`)
  }

  // Load stations on component mount
  useEffect(() => {
    loadStations()
  }, [])

  const loadStations = async () => {
    try {
      setLoading(true)
      const data = await stationService.getAllStations()
      setStations(data)
    } catch (error) {
      console.error('Error loading stations:', error)
      showError(error.message || 'Erreur lors du chargement des stations')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStation = () => {
    setEditingId(null)
    setFormData({
      name: '',
      latitude: '',
      longitude: '',
      capacity: 50,
      active: true
    })
    setShowForm(true)
  }

  const handleEditStation = (station) => {
    setEditingId(station.id)
    setFormData({
      name: station.nom || station.name,
      latitude: station.latitude.toString(),
      longitude: station.longitude.toString(),
      capacity: station.capacite || station.capacity || 50,
      active: station.active === true || station.active === false ? station.active : true,
    })
    setShowForm(true)
  }

  const handleSaveStation = async () => {
    if (!formData.name || !formData.latitude || !formData.longitude) {
      showError('Tous les champs sont obligatoires')
      return
    }

    // Validate latitude and longitude
    const lat = parseFloat(formData.latitude)
    const lon = parseFloat(formData.longitude)

    if (isNaN(lat) || isNaN(lon)) {
      showError('Latitude et longitude doivent être des nombres')
      return
    }

    if (lat < -90 || lat > 90) {
      showError('Latitude doit être entre -90 et 90')
      return
    }

    if (lon < -180 || lon > 180) {
      showError('Longitude doit être entre -180 et 180')
      return
    }

    try {
      setLoading(true)

      if (editingId) {
        // Update existing station
        await stationService.updateStation(editingId, {
          nom: formData.name,
          latitude: lat,
          longitude: lon,
          capacite: parseInt(formData.capacity),
          active: formData.active,
        })
        showSuccess('Station modifiée avec succès')
      } else {
        // Create new station
        await stationService.createStation({
          nom: formData.name,
          latitude: lat,
          longitude: lon,
          capacite: parseInt(formData.capacity),
        })
        showSuccess('Station ajoutée avec succès')
      }

      setShowForm(false)
      setFormData({ name: '', latitude: '', longitude: '', capacity: 50, active: true })
      loadStations()
    } catch (error) {
      console.error('Error saving station:', error)
      showError(error.message || 'Erreur lors de la sauvegarde de la station')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStation = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette station ?')) {
      return
    }

    try {
      setLoading(true)
      await stationService.deleteStation(id)
      showSuccess('Station supprimée avec succès')
      loadStations()
    } catch (error) {
      console.error('Error deleting station:', error)
      showError(error.message || 'Erreur lors de la suppression de la station')
    } finally {
      setLoading(false)
    }
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
      {/* <nav className="stations-nav">
        <div className="stations-nav-content">
          <p className="stations-nav-title">Gestion des Stations et Lignes</p>
          <button
            className="stations-btn stations-btn-primary"
            onClick={() => navigate('/admin/configuration')}
          >
            Configuration Horaires
          </button>
        </div>
      </nav> */}

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
              disabled={loading}
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
                    <label className="stations-label">Nom de la Station *</label>
                    <input
                      type="text"
                      placeholder="Ex: Casablanca"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="stations-input"
                      disabled={loading}
                    />
                  </div>
                  <div className="stations-coords-grid">
                    <div>
                      <label className="stations-label">Latitude *</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Ex: 33.5731"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        className="stations-input"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="stations-label">Longitude *</label>
                      <input
                        type="number"
                        step="0.0001"
                        placeholder="Ex: -7.5898"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        className="stations-input"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="stations-label">Capacité</label>
                    <input
                      type="number"
                      step="1"
                      placeholder="Ex: 50"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="stations-input"
                      disabled={loading}
                    />
                  </div>
                  {editingId && (
                    <div>
                      <label className="stations-label">Statut *</label>
                      <select
                        value={formData.active === true ? 'active' : 'inactive'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            active: e.target.value === 'active',
                          })
                        }
                        className="stations-input"
                        disabled={loading}
                        required
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </div>
                  )}
                  <div className="stations-form-actions">
                    <button
                      onClick={() => {
                        setShowForm(false)
                        setFormData({ name: '', latitude: '', longitude: '', capacity: 50, active: true })
                      }}
                      className="stations-btn stations-btn-outline"
                      disabled={loading}
                    >
                      <X size={18} />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveStation}
                      className="stations-btn stations-btn-primary"
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

          {/* Stations List */}
          <div className="stations-list">
            {loading && stations.length === 0 ? (
              <div className="stations-loading">Chargement des stations...</div>
            ) : stations.length === 0 ? (
              <div className="stations-empty">Aucune station trouvée</div>
            ) : (
              stations.map(station => (
                <div key={station.id} className="stations-card">
                  <div className="stations-card-content stations-station-item">
                    <div className="stations-station-icon">
                      <MapPin size={20} />
                    </div>
                    <div className="stations-station-info">
                      <h3 className="stations-station-name">
                        {station.nom || station.name}
                        <span className={`status-badge ${station.active ? 'active' : 'inactive'}`}>
                          {station.active ? 'Actif' : 'Inactif'}
                        </span>
                      </h3>
                      <p className="stations-station-coords">
                        Lat: {station.latitude.toFixed(4)} | Long: {station.longitude.toFixed(4)}
                        {station.capacite && ` | Capacité: ${station.capacite}`}
                      </p>
                    </div>
                    <div className="stations-actions">
                      <button
                        onClick={() => handleEditStation(station)}
                        className="stations-btn stations-btn-edit"
                        disabled={loading}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStation(station.id)}
                        className="stations-btn stations-btn-delete"
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
