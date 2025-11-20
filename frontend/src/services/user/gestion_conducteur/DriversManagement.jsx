import { useState } from 'react'
import { Trash2, Plus, X, Edit2 } from 'lucide-react'
import { mockDrivers } from '../../../utils/mockData'
import './DriversManagement.css'

const DriversManagement = () => {
  const [drivers, setDrivers] = useState(mockDrivers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    licenseNumber: '',
    username: '',
  })

  const handleAddOrUpdateDriver = () => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.phone &&
      formData.licenseNumber &&
      formData.username
    ) {
      if (editingId) {
        setDrivers(
          drivers.map((d) =>
            d.id === editingId
              ? {
                  ...d,
                  ...formData,
                }
              : d
          )
        )
        setEditingId(null)
      } else {
        const newDriver = {
          id: String(drivers.length + 1),
          ...formData,
          createdAt: new Date(),
        }
        setDrivers([...drivers, newDriver])
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        licenseNumber: '',
        username: '',
      })
      setIsModalOpen(false)
    }
  }

  const handleEditDriver = (driver) => {
    setFormData({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      password: '',
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      username: driver.username,
    })
    setEditingId(driver.id)
    setIsModalOpen(true)
  }

  const handleDeleteDriver = (id) => {
    setDrivers(drivers.filter((d) => d.id !== id))
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
          >
            <Plus size={20} />
            Ajouter Conducteur
          </button>
        </div>

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
              {drivers.map((driver) => (
                <tr key={driver.id}>
                  <td>
                    {driver.firstName} {driver.lastName}
                  </td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.licenseNumber}</td>
                  <td>{driver.username}</td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditDriver(driver)}
                      >
                        <Edit2 size={16} />
                        Modifier
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteDriver(driver.id)}
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
                  {editingId ? 'Modifier Conducteur' : 'Ajouter un Conducteur'}
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
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                {!editingId && (
                  <div className="form-group">
                    <label>Mot de passe</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Numéro de Permis</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licenseNumber: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  className="submit-btn"
                  onClick={handleAddOrUpdateDriver}
                >
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

export default DriversManagement
