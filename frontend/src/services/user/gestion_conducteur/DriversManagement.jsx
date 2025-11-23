import { useState, useEffect } from 'react'
import { Trash2, Plus, X, Edit2, Loader } from 'lucide-react'
import { driversService, handleApiError } from '../driversService'
import './DriversManagement.css'

const DriversManagement = () => {
  const [drivers, setDrivers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    username: '',
  })

  // Load drivers on component mount
  useEffect(() => {
    loadDrivers()
  }, [])

  // Load all drivers
  const loadDrivers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await driversService.getAllDrivers()
      setDrivers(data)
    } catch (err) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      console.error('Error loading drivers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Show success message
  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  // Show error message
  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }

  const handleAddOrUpdateDriver = async () => {
    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.licenseNumber ||
      !formData.username
    ) {
      showError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (!editingId && !formData.password) {
      showError('Le mot de passe est obligatoire pour un nouveau conducteur')
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (editingId) {
        // Update existing driver
        const driver = drivers.find((d) => d.id === editingId)
        await driversService.updateDriver(driver.email, formData)
        showSuccess('Conducteur modifié avec succès')
      } else {
        // Create new driver
        await driversService.createDriver(formData)
        showSuccess('Conducteur ajouté avec succès')
      }

      // Reload drivers list
      await loadDrivers()

      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        licenseNumber: '',
        username: '',
      })
      setEditingId(null)
      setIsModalOpen(false)
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error saving driver:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditDriver = (driver) => {
    setFormData({
      firstName: driver.prenom || driver.firstName,
      lastName: driver.nom || driver.lastName,
      email: driver.email,
      password: '',
      phone: driver.telephone || driver.phone,
      licenseNumber: driver.numeroPermis || driver.licenseNumber,
      username: driver.username,
    })
    setEditingId(driver.id)
    setIsModalOpen(true)
  }

  const handleDeleteDriver = async (email) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce conducteur ?')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      await driversService.deleteDriver(email)
      showSuccess('Conducteur supprimé avec succès')
      await loadDrivers()
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error deleting driver:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="drivers-management">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestion des Conducteurs</h1>
          <button
            className="add-btn"
            onClick={() => {
              setEditingId(null)
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                phone: '',
                licenseNumber: '',
                username: '',
              })
              setIsModalOpen(true)
            }}
            disabled={loading}
          >
            <Plus size={20} />
            Ajouter Conducteur
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !isModalOpen && (
          <div className="loading-container">
            <Loader className="spinner" size={40} />
            <p>Chargement...</p>
          </div>
        )}

        {/* Drivers Table */}
        {!loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Numéro de Permis</th>
                  <th>Nom d'utilisateur</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aucun conducteur trouvé
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.id}>
                      <td>
                        {driver.prenom || driver.firstName} {driver.nom || driver.lastName}
                      </td>
                      <td>{driver.email}</td>
                      <td>{driver.telephone || driver.phone}</td>
                      <td>{driver.numeroPermis || driver.licenseNumber}</td>
                      <td>{driver.username}</td>
                      <td className="text-center">
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditDriver(driver)}
                            disabled={loading}
                          >
                            <Edit2 size={16} />
                            Modifier
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteDriver(driver.email)}
                            disabled={loading}
                          >
                            <Trash2 size={16} />
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingId ? 'Modifier Conducteur' : 'Ajouter un Conducteur'}
                </h2>
                <button
                  className="close-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={loading || editingId}
                  />
                </div>

                {!editingId && (
                  <div className="form-group">
                    <label>Mot de passe *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de Permis *</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseNumber: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Nom d'utilisateur *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={loading || editingId}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  className="submit-btn"
                  onClick={handleAddOrUpdateDriver}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="spinner-small" size={16} />
                      {editingId ? 'Modification...' : 'Ajout...'}
                    </>
                  ) : (
                    <>{editingId ? 'Modifier' : 'Ajouter'}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DriversManagement
