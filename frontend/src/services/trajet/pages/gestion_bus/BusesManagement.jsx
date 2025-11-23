import { useState, useEffect } from 'react'
import { Trash2, Plus, X, Edit2, Loader, UserCheck } from 'lucide-react'
import { busService, handleApiError } from '../../configurationService'
import { driversService } from '../../../user/driversService'
import { assignationBusConducteurService } from '../../assignationBusConducteurService'
import './BusesManagement.css'

const BusesManagement = () => {
  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [busAssignments, setBusAssignments] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [selectedBusForAssignment, setSelectedBusForAssignment] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    capacity: 50,
    active: true,
  })
  const [assignmentFormData, setAssignmentFormData] = useState({
    driverId: '',
    startDate: '',
    endDate: '',
  })

  // Load buses and drivers on component mount
  useEffect(() => {
    loadBuses()
    loadDrivers()
  }, [])

  // Load bus assignments
  const loadBusAssignments = async (buses) => {
    const assignments = {}
    const today = new Date().toISOString().split('T')[0]

    for (const bus of buses) {
      try {
        const assignment = await assignationBusConducteurService.getActiveAssignment(
          bus.id,
          today
        )
        assignments[bus.id] = assignment
      } catch (err) {
        // No active assignment for this bus
        assignments[bus.id] = null
      }
    }
    setBusAssignments(assignments)
  }

  // Load all buses
  const loadBuses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await busService.getAllBuses()
      setBuses(data)
      await loadBusAssignments(data)
    } catch (err) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      console.error('Error loading buses:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load all drivers
  const loadDrivers = async () => {
    try {
      const data = await driversService.getAllDrivers()
      setDrivers(data)
    } catch (err) {
      console.error('Error loading drivers:', err)
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

  const handleAddOrUpdateBus = async () => {
    // Validation
    if (!formData.registrationNumber || !formData.model || !formData.capacity) {
      showError('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (formData.capacity <= 0) {
      showError('La capacité doit être supérieure à 0')
      return
    }

    try {
      setLoading(true)
      setError(null)

      if (editingId) {
        // Update existing bus
        await busService.updateBus(editingId, {
          numeroImmatriculation: formData.registrationNumber,
          modele: formData.model,
          capacite: formData.capacity,
          active: formData.active,
        })
        showSuccess('Bus modifié avec succès')
      } else {
        // Create new bus
        await busService.createBus({
          numeroImmatriculation: formData.registrationNumber,
          modele: formData.model,
          capacite: formData.capacity,
        })
        showSuccess('Bus ajouté avec succès')
      }

      // Reload buses list
      await loadBuses()

      // Reset form and close modal
      setFormData({
        registrationNumber: '',
        model: '',
        capacity: 50,
        active: true,
      })
      setEditingId(null)
      setIsModalOpen(false)
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error saving bus:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEditBus = (bus) => {
    setFormData({
      registrationNumber: bus.numeroImmatriculation || bus.registrationNumber,
      model: bus.modele || bus.model,
      capacity: bus.capacite || bus.capacity,
      active: bus.active === true || bus.active === false ? bus.active : true,
    })
    setEditingId(bus.id)
    setIsModalOpen(true)
  }

  const handleDeleteBus = async (busId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bus ?')) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      await busService.deleteBus(busId)
      showSuccess('Bus supprimé avec succès')
      await loadBuses()
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error deleting bus:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (busId, isActive) => {
    try {
      setLoading(true)
      setError(null)
      if (isActive) {
        await busService.deleteBus(busId) // This should be deactivateBus
        showSuccess('Bus désactivé avec succès')
      } else {
        // Need to implement activateBus endpoint
        showSuccess('Bus activé avec succès')
      }
      await loadBuses()
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error toggling bus status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAssignmentModal = (bus) => {
    setSelectedBusForAssignment(bus)

    // Pre-fill if there's an active assignment
    const assignment = busAssignments[bus.id]
    if (assignment) {
      setAssignmentFormData({
        driverId: assignment.conducteurId || '',
        startDate: assignment.dateDebut || '',
        endDate: assignment.dateFin || '',
      })
    } else {
      setAssignmentFormData({
        driverId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      })
    }

    setShowAssignmentModal(true)
  }

  const handleAssignDriver = async () => {
    // Validation
    if (!assignmentFormData.driverId || !assignmentFormData.startDate || !assignmentFormData.endDate) {
      showError('Veuillez remplir tous les champs')
      return
    }

    if (new Date(assignmentFormData.endDate) <= new Date(assignmentFormData.startDate)) {
      showError('La date de fin doit être après la date de début')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await assignationBusConducteurService.createAssignment({
        busId: selectedBusForAssignment.id,
        conducteurId: assignmentFormData.driverId,
        dateDebut: assignmentFormData.startDate,
        dateFin: assignmentFormData.endDate,
      })

      showSuccess('Conducteur assigné avec succès')

      // Reload buses and assignments
      await loadBuses()

      // Close modal
      setShowAssignmentModal(false)
      setSelectedBusForAssignment(null)
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error assigning driver:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="buses-management">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Gestion des Bus</h1>
          <button
            className="add-btn"
            onClick={() => {
              setEditingId(null)
              setFormData({
                registrationNumber: '',
                model: '',
                capacity: 50,
                active: true,
              })
              setIsModalOpen(true)
            }}
            disabled={loading}
          >
            <Plus size={20} />
            Ajouter Bus
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

        {/* Buses Table */}
        {!loading && (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Numéro d'Immatriculation</th>
                  <th>Modèle</th>
                  <th>Capacité</th>
                  <th>Conducteur Assigné</th>
                  <th>Statut</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      Aucun bus trouvé
                    </td>
                  </tr>
                ) : (
                  buses.map((bus) => {
                    const assignment = busAssignments[bus.id]
                    const assignedDriver = assignment
                      ? drivers.find(d => d.uuid === assignment.conducteurId)
                      : null

                    return (
                      <tr key={bus.id}>
                        <td>{bus.numeroImmatriculation || bus.registrationNumber}</td>
                        <td>{bus.modele || bus.model}</td>
                        <td>{bus.capacite || bus.capacity}</td>
                        <td>
                          {assignedDriver ? (
                            <span className="driver-name">
                              {assignedDriver.prenom} {assignedDriver.nom}
                            </span>
                          ) : (
                            <span className="no-driver">Non assigné</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-badge ${bus.active ? 'active' : 'inactive'}`}>
                            {bus.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="action-buttons">
                            <button
                              className="assign-btn"
                              onClick={() => handleOpenAssignmentModal(bus)}
                              disabled={loading}
                              title="Assigner un conducteur"
                            >
                              <UserCheck size={16} />
                              Assigner
                            </button>
                            <button
                              className="edit-btn"
                              onClick={() => handleEditBus(bus)}
                              disabled={loading}
                            >
                              <Edit2 size={16} />
                              Modifier
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteBus(bus.id)}
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
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
                  {editingId ? 'Modifier Bus' : 'Ajouter un Bus'}
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
                  <label>Numéro d'Immatriculation *</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationNumber: e.target.value,
                      })
                    }
                    disabled={loading}
                    placeholder="Ex: AB-123456"
                  />
                </div>

                <div className="form-group">
                  <label>Modèle *</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    disabled={loading}
                    placeholder="Ex: Mercedes Sprinter"
                  />
                </div>

                <div className="form-group">
                  <label>Capacité *</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={loading}
                    min="1"
                    placeholder="Ex: 50"
                  />
                </div>

                {editingId && (
                  <div className="form-group">
                    <label>Statut *</label>
                    <select
                      value={formData.active === true ? 'active' : 'inactive'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          active: e.target.value === 'active',
                        })
                      }
                      disabled={loading}
                      required
                    >
                      <option value="active">Actif</option>
                      <option value="inactive">Inactif</option>
                    </select>
                  </div>
                )}
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
                  onClick={handleAddOrUpdateBus}
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

        {/* Assignment Modal */}
        {showAssignmentModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">
                  Assigner Conducteur - {selectedBusForAssignment?.numeroImmatriculation || selectedBusForAssignment?.registrationNumber}
                </h2>
                <button
                  className="close-btn"
                  onClick={() => setShowAssignmentModal(false)}
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Conducteur *</label>
                  <select
                    value={assignmentFormData.driverId}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        driverId: e.target.value,
                      })
                    }
                    disabled={loading}
                  >
                    <option value="">Sélectionner un conducteur</option>
                    {drivers.map((driver) => (
                      <option key={driver.uuid} value={driver.uuid}>
                        {driver.prenom} {driver.nom} - {driver.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date de Début *</label>
                  <input
                    type="date"
                    value={assignmentFormData.startDate}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        startDate: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Date de Fin *</label>
                  <input
                    type="date"
                    value={assignmentFormData.endDate}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        endDate: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setShowAssignmentModal(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  className="submit-btn"
                  onClick={handleAssignDriver}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="spinner-small" size={16} />
                      Assignation...
                    </>
                  ) : (
                    'Assigner'
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

export default BusesManagement
