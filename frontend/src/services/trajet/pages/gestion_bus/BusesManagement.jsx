import { useState, useEffect } from 'react'
import { Trash2, Plus, X, Edit2, Loader, UserCheck } from 'lucide-react'
import { busService, handleApiError } from '../../configurationService'
import { driversService } from '../../../user/driversService'
import { assignationBusConducteurService } from '../../assignationBusConducteurService'
import { ligneService, stationService } from '../../../../services/trajetService'
import { busAssignmentService } from '../../busAssignmentService'
import './BusesManagement.css'

const BusesManagement = () => {
  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [lines, setLines] = useState([])
  const [stations, setStations] = useState([])
  const [busAssignments, setBusAssignments] = useState({})
  const [lineAssignments, setLineAssignments] = useState({})
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
    ligneId: '',
    stationDepartId: '',
    stationArriveeId: '',
    heureDepartAller: '09:00',
    commenceAStationDepart: true,
    driverId: '',
    startDate: '',
    endDate: '',
  })

  // Load buses, drivers, lines, and stations on component mount
  useEffect(() => {
    const loadData = async () => {
      await loadDrivers()
      const linesData = await loadLines()
      await loadStations()
      const busesData = await loadBuses()
      // Load assignments after everything is loaded
      if (busesData && busesData.length > 0 && linesData && linesData.length > 0) {
        await loadBusAssignments(busesData, linesData)
      }
    }
    loadData()
  }, [])

  // Load bus assignments (driver and line assignments)
  const loadBusAssignments = async (buses, linesData) => {
    const driverAssignments = {}
    const ligneAssignments = {}

    console.log('=== Loading bus assignments ===')
    console.log('Buses:', buses.length)
    console.log('Lines:', linesData.length)

    for (const bus of buses) {
      try {
        // Get all driver assignments for this bus
        const assignments = await assignationBusConducteurService.getAssignmentsByBus(bus.id)

        // Find the first active assignment
        const activeAssignment = assignments && assignments.length > 0
          ? assignments.find(a => a.active) || assignments[0]
          : null

        driverAssignments[bus.id] = activeAssignment
        console.log(`Driver assigned to bus ${bus.numeroImmatriculation}:`, activeAssignment)
      } catch (err) {
        // No active assignment for this bus
        console.error(`Error loading driver assignment for bus ${bus.id}:`, err)
        driverAssignments[bus.id] = null
      }
    }

    // Load line assignments for all lines
    for (const line of linesData) {
      try {
        console.log(`Loading assignments for line ${line.numero} (${line.id})`)
        const assignments = await busAssignmentService.getAssignmentsByLine(line.id)
        console.log(`Found ${assignments?.length || 0} assignments for line ${line.numero}`)

        if (assignments && assignments.length > 0) {
          assignments.forEach(assignment => {
            if (assignment.active) {
              ligneAssignments[assignment.busId] = assignment
              console.log(`Bus ${assignment.busImmatriculation} assigned to line ${line.numero}`)
            }
          })
        }
      } catch (err) {
        console.error(`Error loading assignments for line ${line.id}:`, err)
      }
    }

    console.log('Final driver assignments:', driverAssignments)
    console.log('Final line assignments:', ligneAssignments)

    setBusAssignments(driverAssignments)
    setLineAssignments(ligneAssignments)
  }

  // Load all buses
  const loadBuses = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await busService.getAllBuses()
      setBuses(data)
      return data
    } catch (err) {
      const errorMsg = handleApiError(err)
      setError(errorMsg)
      console.error('Error loading buses:', err)
      return []
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

  // Load all lines
  const loadLines = async () => {
    try {
      const data = await ligneService.getAllLines()
      setLines(data || [])
      return data || []
    } catch (err) {
      console.error('Error loading lines:', err)
      setLines([])
      return []
    }
  }

  // Load all stations
  const loadStations = async () => {
    try {
      const data = await stationService.getAllStations()
      setStations(data || [])
    } catch (err) {
      console.error('Error loading stations:', err)
      setStations([])
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

    // Reset form data
    const today = new Date()
    const oneMonthLater = new Date(today)
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    setAssignmentFormData({
      ligneId: '',
      stationDepartId: '',
      stationArriveeId: '',
      heureDepartAller: '09:00',
      commenceAStationDepart: true,
      driverId: '',
      startDate: today.toISOString().split('T')[0],
      endDate: oneMonthLater.toISOString().split('T')[0],
    })

    setShowAssignmentModal(true)
  }

  const handleAssignDriver = async () => {
    // Validation - at least ligne/stations OR driver must be filled
    const hasLigneAssignment = assignmentFormData.ligneId &&
                                assignmentFormData.stationDepartId &&
                                assignmentFormData.stationArriveeId;
    const hasDriverAssignment = assignmentFormData.driverId &&
                                 assignmentFormData.startDate &&
                                 assignmentFormData.endDate;

    if (!hasLigneAssignment && !hasDriverAssignment) {
      showError('Veuillez remplir soit l\'assignation à une ligne (ligne + stations) soit l\'assignation à un conducteur')
      return
    }

    if (hasDriverAssignment && new Date(assignmentFormData.endDate) <= new Date(assignmentFormData.startDate)) {
      showError('La date de fin doit être après la date de début')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Assign bus to ligne if ligne/stations are provided
      if (hasLigneAssignment) {
        await busAssignmentService.assignBus({
          busId: selectedBusForAssignment.id,
          ligneId: assignmentFormData.ligneId,
          stationDepartId: assignmentFormData.stationDepartId,
          stationArriveeId: assignmentFormData.stationArriveeId,
          heureDepartAller: assignmentFormData.heureDepartAller,
          commenceAStationDepart: assignmentFormData.commenceAStationDepart,
        })
      }

      // Assign driver if driver info is provided
      if (hasDriverAssignment) {
        await assignationBusConducteurService.createAssignment({
          busId: selectedBusForAssignment.id,
          conducteurId: assignmentFormData.driverId,
          dateDebut: assignmentFormData.startDate,
          dateFin: assignmentFormData.endDate,
        })
      }

      const successMsg = hasLigneAssignment && hasDriverAssignment
        ? 'Bus assigné à la ligne et au conducteur avec succès'
        : hasLigneAssignment
          ? 'Bus assigné à la ligne avec succès'
          : 'Conducteur assigné avec succès'

      showSuccess(successMsg)

      // Reload buses and assignments
      const busesData = await loadBuses()
      if (busesData && busesData.length > 0 && lines.length > 0) {
        await loadBusAssignments(busesData, lines)
      }

      // Close modal
      setShowAssignmentModal(false)
      setSelectedBusForAssignment(null)
    } catch (err) {
      const errorMsg = handleApiError(err)
      showError(errorMsg)
      console.error('Error assigning bus:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="buses-management">
      <div className="buses-page-container">
        <div className="buses-page-header">
          <h1 className="buses-page-title">Gestion des Bus</h1>
          <button
            className="buses-add-btn"
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
          <div className="buses-alert buses-alert-success">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="buses-alert buses-alert-error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !isModalOpen && (
          <div className="buses-loading-container">
            <Loader className="buses-spinner" size={40} />
            <p>Chargement...</p>
          </div>
        )}

        {/* Buses Table */}
        {!loading && (
          <div className="buses-table-container">
            <table className="buses-data-table">
              <thead>
                <tr>
                  <th>Numéro d'Immatriculation</th>
                  <th>Modèle</th>
                  <th>Capacité</th>
                  <th>Ligne Assignée</th>
                  <th>Conducteur Assigné</th>
                  <th>Statut</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Aucun bus trouvé
                    </td>
                  </tr>
                ) : (
                  buses.map((bus) => {
                    const assignment = busAssignments[bus.id]
                    const assignedDriver = assignment
                      ? drivers.find(d => d.uuid === assignment.conducteurId)
                      : null
                    const lineAssignment = lineAssignments[bus.id]
                    const assignedLine = lineAssignment
                      ? lines.find(l => l.id === lineAssignment.ligneId)
                      : null

                    // Debug logs for each bus
                    if (bus.numeroImmatriculation === '44444') {
                      console.log('=== Bus 44444 Debug ===')
                      console.log('Bus ID:', bus.id)
                      console.log('Driver assignment:', assignment)
                      console.log('All drivers:', drivers.length, drivers.map(d => ({ uuid: d.uuid, nom: d.nom })))
                      console.log('Found driver:', assignedDriver)
                      console.log('Line assignment:', lineAssignment)
                      console.log('Found line:', assignedLine)
                    }

                    return (
                      <tr key={bus.id}>
                        <td>{bus.numeroImmatriculation || bus.registrationNumber}</td>
                        <td>{bus.modele || bus.model}</td>
                        <td>{bus.capacite || bus.capacity}</td>
                        <td>
                          {assignedLine ? (
                            <div>
                              <strong>{assignedLine.numero}</strong> - {assignedLine.nom}
                              <br />
                              <small style={{ color: '#666' }}>
                                {lineAssignment.stationDepartNom} → {lineAssignment.stationArriveeNom}
                              </small>
                            </div>
                          ) : (
                            <span className="no-driver">Non assigné</span>
                          )}
                        </td>
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
                          <span className={`buses-status-badge ${bus.active ? 'active' : 'inactive'}`}>
                            {bus.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="buses-action-buttons">
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
                              className="buses-edit-btn"
                              onClick={() => handleEditBus(bus)}
                              disabled={loading}
                            >
                              <Edit2 size={16} />
                              Modifier
                            </button>
                            <button
                              className="buses-delete-btn"
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
          <div className="buses-modal-overlay">
            <div className="buses-modal-content">
              <div className="buses-modal-header">
                <h2 className="buses-modal-title">
                  {editingId ? 'Modifier Bus' : 'Ajouter un Bus'}
                </h2>
                <button
                  className="buses-close-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="buses-modal-body">
                <div className="buses-form-group">
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

                <div className="buses-form-group">
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

                <div className="buses-form-group">
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
                  <div className="buses-form-group">
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

              <div className="buses-modal-footer">
                <button
                  className="buses-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  className="buses-submit-btn"
                  onClick={handleAddOrUpdateBus}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="buses-spinner-small" size={16} />
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
          <div className="buses-modal-overlay">
            <div className="buses-modal-content">
              <div className="buses-modal-header">
                <h2 className="buses-modal-title">
                  Assigner Bus à une Ligne - {selectedBusForAssignment?.numeroImmatriculation || selectedBusForAssignment?.registrationNumber}
                </h2>
                <button
                  className="buses-close-btn"
                  onClick={() => setShowAssignmentModal(false)}
                  disabled={loading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="buses-modal-body">
                <div className="buses-form-group">
                  <label>Ligne *</label>
                  <select
                    value={assignmentFormData.ligneId}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        ligneId: e.target.value,
                      })
                    }
                    disabled={loading}
                  >
                    <option value="">Sélectionner une ligne</option>
                    {lines.map((line) => (
                      <option key={line.id} value={line.id}>
                        {line.nom || line.numero} - {line.numero}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="buses-form-group">
                  <label>Station de Départ *</label>
                  <select
                    value={assignmentFormData.stationDepartId}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        stationDepartId: e.target.value,
                      })
                    }
                    disabled={loading}
                  >
                    <option value="">Sélectionner station de départ</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="buses-form-group">
                  <label>Station d'Arrivée *</label>
                  <select
                    value={assignmentFormData.stationArriveeId}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        stationArriveeId: e.target.value,
                      })
                    }
                    disabled={loading}
                  >
                    <option value="">Sélectionner station d'arrivée</option>
                    {stations.map((station) => (
                      <option key={station.id} value={station.id}>
                        {station.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="buses-form-group">
                  <label>Heure de Départ (Aller) *</label>
                  <input
                    type="time"
                    value={assignmentFormData.heureDepartAller}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        heureDepartAller: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                </div>

                <div className="buses-form-group">
                  <label>Le bus commence à *</label>
                  <select
                    value={assignmentFormData.commenceAStationDepart ? 'depart' : 'destination'}
                    onChange={(e) =>
                      setAssignmentFormData({
                        ...assignmentFormData,
                        commenceAStationDepart: e.target.value === 'depart',
                      })
                    }
                    disabled={loading || !assignmentFormData.stationDepartId || !assignmentFormData.stationArriveeId}
                  >
                    <option value="depart">
                      {assignmentFormData.stationDepartId
                        ? stations.find(s => s.id === assignmentFormData.stationDepartId)?.nom || 'Station de Départ'
                        : 'Station de Départ'}
                    </option>
                    <option value="destination">
                      {assignmentFormData.stationArriveeId
                        ? stations.find(s => s.id === assignmentFormData.stationArriveeId)?.nom || 'Station de Destination'
                        : 'Station de Destination'}
                    </option>
                  </select>
                  <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    Choisissez où ce bus commence sa journée pour la génération automatique des trips
                  </small>
                </div>

                <div className="buses-form-group">
                  <label>Conducteur</label>
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

                <div className="buses-form-group">
                  <label>Date de Début</label>
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
                  <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    Requis seulement si vous assignez un conducteur
                  </small>
                </div>

                <div className="buses-form-group">
                  <label>Date de Fin</label>
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
                  <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    Requis seulement si vous assignez un conducteur
                  </small>
                </div>
              </div>

              <div className="buses-modal-footer">
                <button
                  className="buses-cancel-btn"
                  onClick={() => setShowAssignmentModal(false)}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  className="buses-submit-btn"
                  onClick={handleAssignDriver}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="buses-spinner-small" size={16} />
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