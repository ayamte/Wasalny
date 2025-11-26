import { useState } from 'react'
import { Trash2, Plus, X } from 'lucide-react'
import { mockClients } from '../../../utils/mockData'
import './ClientsManagement.css'

const ClientsManagement = () => {
  const [clients, setClients] = useState(mockClients)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    username: '',
  })

  const handleAddClient = () => {
    if (
      formData.firstName &&
      formData.lastName &&
      formData.email &&
      formData.password &&
      formData.phone &&
      formData.username
    ) {
      const newClient = {
        id: String(clients.length + 1),
        ...formData,
        createdAt: new Date(),
      }
      setClients([...clients, newClient])
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        username: '',
      })
      setIsModalOpen(false)
    }
  }

  const handleDeleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id))
  }

  return (
    <div className="clients-management">
      <div className="clients-page-container">
        <div className="clients-page-header">
          <h1 className="clients-page-title">Gestion des Clients</h1>
          <button className="clients-add-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Ajouter Client
          </button>
        </div>

        <div className="clients-table-container">
          <table className="clients-data-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Nom d'utilisateur</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>
                    {client.firstName} {client.lastName}
                  </td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.username}</td>
                  <td className="text-center">
                    <button
                      className="clients-delete-btn"
                      onClick={() => handleDeleteClient(client.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="clients-modal-overlay">
            <div className="clients-modal-content">
              <div className="clients-modal-header">
                <h2 className="clients-modal-title">Ajouter un Client</h2>
                <button
                  className="clients-close-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="clients-modal-body">
                <div className="clients-form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>

                <div className="clients-form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>

                <div className="clients-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="clients-form-group">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div className="clients-form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>

                <div className="clients-form-group">
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

              <div className="clients-modal-footer">
                <button
                  className="clients-cancel-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Annuler
                </button>
                <button className="clients-submit-btn" onClick={handleAddClient}>
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientsManagement
