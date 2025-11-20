import { useState } from 'react'
import { Trash2, Plus, X, Edit2 } from 'lucide-react'
import { mockBuses, mockDrivers } from '../../../../utils/mockData'
import './BusesManagement.css'

const BusesManagement = () => {
  const [buses, setBuses] = useState(mockBuses)
  const [drivers] = useState(mockDrivers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    capacity: 50,
    driverId: '',
  })

  const handleAddOrUpdateBus = () => {
    if (formData.registrationNumber && formData.model && formData.capacity) {
      if (editingId) {
        setBuses(
          buses.map((b) =>
            b.id === editingId
              ? {
                  ...b,
                  ...formData,
                  driverId: formData.driverId || undefined,
                }
              : b
          )
        )
        setEditingId(null)
      } else {
        const newBus = {
          id: String(buses.length + 1),
          ...formData,
          createdAt: new Date(),
        }
        setBuses([...buses, newBus])
      }
      setFormData({
        registrationNumber: '',
        model: '',
        capacity: 50,
        driverId: '',
      })
      setIsModalOpen(false)
    }
  }

  const handleEditBus = (bus) => {
    setFormData({
      registrationNumber: bus.registrationNumber,
      model: bus.model,
      capacity: bus.capacity,
      driverId: bus.driverId || '',
    })
    setEditingId(bus.id)
    setIsModalOpen(true)
  }

  const handleDeleteBus = (id) => {
    setBuses(buses.filter((b) => b.id !== id))
  }

  const getDriverName = (driverId) => {
    const driver = drivers.find((d) => d.id === driverId)
    return driver ? `${driver.firstName} ${driver.lastName}` : '-'
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
                driverId: '',
              })
              setIsModalOpen(true)
            }}
          >
            <Plus size={20} />
            Ajouter Bus
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Numéro d'Immatriculation</th>
                <th>Modèle</th>
                <th>Capacité</th>
                <th>Conducteur</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td>{bus.registrationNumber}</td>
                  <td>{bus.model}</td>
                  <td>{bus.capacity}</td>
                  <td>{getDriverName(bus.driverId)}</td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditBus(bus)}
                      >
                        <Edit2 size={16} />
                        Modifier
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteBus(bus.id)}
                      >
                        <Trash2 size={16} />
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label>Numéro d'Immatriculation</label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        registrationNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Modèle</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Capacité</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Conducteur</label>
                  <select
                    value={formData.driverId}
                    onChange={(e) =>
                      setFormData({ ...formData, driverId: e.target.value })
                    }
                  >
                    <option value="">Sélectionner un conducteur</option>
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.firstName} {driver.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button className="submit-btn" onClick={handleAddOrUpdateBus}>
                  {editingId ? 'Modifier' : 'Ajouter'}
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
