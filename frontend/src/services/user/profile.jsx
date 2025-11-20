import { useState, useEffect } from 'react'
import { Edit2, Save, X, CreditCard, Clock, User, Phone } from 'lucide-react'
import Navbar from '../../components/Navbar'
import * as authService from '../auth/authService'
import './profile.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // User data from backend
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    subscription: 'Standard',
    subscriptionExpiry: '2025-12-31',
  })

  // Mock card data (for now - will be replaced with real payment integration)
  const [cardData] = useState({
    holderName: 'TITULAIRE',
    cardNumber: '4532 **** **** 1234',
    cardNumberFull: '4532123456789012',
    expiryDate: '12/26',
    cvv: '***',
  })

  const [editData, setEditData] = useState(userData)

  // Fetch user data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError('')

        const user = authService.getUser()
        const token = authService.getToken()

        if (!user || !token) {
          setError('Utilisateur non connecté')
          return
        }

        console.log('User from localStorage:', user)

        // Get user ID
        const userId = user.id

        if (!userId) {
          throw new Error('ID utilisateur manquant')
        }

        const endpoint = `${API_URL}/user-service/api/users/${userId}`
        console.log('Fetching from:', endpoint)

        // Fetch user details from backend
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          // If profile doesn't exist, use data from auth response
          console.log('Profile not found, using auth data')
          setUserData({
            id: userId,
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            username: user.username || '',
            subscription: 'Standard',
            subscriptionExpiry: '2025-12-31',
          })
          setEditData({
            id: userId,
            firstName: '',
            lastName: '',
            email: user.email || '',
            phone: '',
            username: user.username || '',
            subscription: 'Standard',
            subscriptionExpiry: '2025-12-31',
          })
          return
        }

        const data = await response.json()
        console.log('User data from backend:', data)

        const userInfo = {
          id: userId,
          firstName: data.prenom || '',
          lastName: data.nom || '',
          email: data.email || user.email || '',
          phone: data.telephone || '',
          username: data.username || user.username || '',
          subscription: 'Standard',
          subscriptionExpiry: '2025-12-31',
        }

        setUserData(userInfo)
        setEditData(userInfo)
      } catch (err) {
        console.error('Error fetching user data:', err)
        // Fallback to auth data
        const user = authService.getUser()
        const userId = user?.id
        setUserData({
          id: userId,
          firstName: '',
          lastName: '',
          email: user?.email || '',
          phone: '',
          username: user?.username || '',
          subscription: 'Standard',
          subscriptionExpiry: '2025-12-31',
        })
        setEditData({
          id: userId,
          firstName: '',
          lastName: '',
          email: user?.email || '',
          phone: '',
          username: user?.username || '',
          subscription: 'Standard',
          subscriptionExpiry: '2025-12-31',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleSave = async () => {
    try {
      setError('')
      const user = authService.getUser()
      const token = authService.getToken()

      if (!user || !token) {
        setError('Utilisateur non connecté')
        return
      }

      // Use the saved user ID from userData state
      const userId = userData.id

      if (!userId) {
        setError('ID utilisateur manquant')
        return
      }

      // Update user data on backend
      const response = await fetch(`${API_URL}/user-service/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prenom: editData.firstName,
          nom: editData.lastName,
          telephone: editData.phone,
        })
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const updatedData = await response.json()

      setUserData({
        ...userData,
        firstName: updatedData.prenom || editData.firstName,
        lastName: updatedData.nom || editData.lastName,
        phone: updatedData.telephone || editData.phone,
      })

      setIsEditing(false)
    } catch (err) {
      console.error('Error updating user data:', err)
      setError(err.message || 'Erreur lors de la mise à jour')
    }
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
    setError('')
  }

  const handleChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-container">
          <div className="profile-content">
            <div className="profile-loading">Chargement...</div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <h1 className="profile-title">Mon Profil</h1>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                <Edit2 size={20} />
                <span>Modifier</span>
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="profile-card">
            <div className="profile-card-header">
              <User size={24} className="profile-card-icon" />
              <h2 className="profile-card-title">Informations Personnelles</h2>
            </div>

            {isEditing ? (
              <div className="profile-form">
                <div className="profile-form-row">
                  <div className="profile-form-group">
                    <label className="profile-label">Prénom</label>
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="profile-input"
                    />
                  </div>
                  <div className="profile-form-group">
                    <label className="profile-label">Nom</label>
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="profile-input"
                    />
                  </div>
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    className="profile-input"
                    disabled
                  />
                  <p className="profile-input-hint">L'email ne peut pas �tre modifi�</p>
                </div>

                <div className="profile-form-group">
                  <label className="profile-label">Téléphone</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="profile-input"
                  />
                </div>

                <div className="profile-actions">
                  <button onClick={handleSave} className="profile-btn profile-btn-save">
                    <Save size={20} />
                    Enregistrer
                  </button>
                  <button onClick={handleCancel} className="profile-btn profile-btn-cancel">
                    <X size={20} />
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="profile-info-row">
                  <div className="profile-info-item">
                    <p className="profile-info-label">Pr�nom</p>
                    <p className="profile-info-value">{userData.firstName || 'Non d�fini'}</p>
                  </div>
                  <div className="profile-info-item">
                    <p className="profile-info-label">Nom</p>
                    <p className="profile-info-value">{userData.lastName || 'Non d�fini'}</p>
                  </div>
                </div>
                <div className="profile-info-item">
                  <p className="profile-info-label">Email</p>
                  <p className="profile-info-value">{userData.email}</p>
                </div>
                <div className="profile-info-phone">
                  <Phone size={20} className="profile-card-icon" />
                  <div className="profile-info-item">
                    <p className="profile-info-label">T�l�phone</p>
                    <p className="profile-info-value">{userData.phone || 'Non d�fini'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="profile-grid">
            {/* Subscription Section */}
            <div className="profile-card">
              <div className="profile-card-header">
                <Clock size={24} className="profile-card-icon" />
                <h3 className="profile-card-title">Abonnement</h3>
              </div>
              <div className="profile-info">
                <div className="profile-info-item">
                  <p className="profile-info-label">Type</p>
                  <div className="profile-subscription-badge">{userData.subscription}</div>
                </div>
                <div className="profile-info-item">
                  <p className="profile-info-label">Expire le</p>
                  <p className="profile-info-value">
                    {new Date(userData.subscriptionExpiry).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className="profile-card">
              <div className="profile-card-header">
                <CreditCard size={24} className="profile-card-icon" />
                <h3 className="profile-card-title">Moyens de Paiement</h3>
              </div>

              {/* Card Display */}
              <div
                className="profile-credit-card"
                onClick={() => setExpandedCard(expandedCard === 'card' ? null : 'card')}
              >
                <div>
                  <p className="profile-card-type">Carte Bancaire</p>
                  <div className="profile-card-number">{cardData.cardNumber}</div>
                </div>
                <div className="profile-card-bottom">
                  <div className="profile-card-holder">
                    <p className="profile-card-label">Titulaire</p>
                    <p className="profile-card-value">{cardData.holderName}</p>
                  </div>
                  <div className="profile-card-expiry">
                    <p className="profile-card-label">Expire</p>
                    <p className="profile-card-value">{cardData.expiryDate}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Card Details */}
              {expandedCard === 'card' && (
                <div className="profile-card-details">
                  <div className="profile-card-details-content">
                    <div className="profile-info-item">
                      <p className="profile-card-detail-label">Num�ro Complet</p>
                      <p className="profile-card-detail-value">{cardData.cardNumberFull}</p>
                    </div>
                    <div className="profile-card-details-row">
                      <div className="profile-info-item">
                        <p className="profile-card-detail-label">Date d'Expiration</p>
                        <p className="profile-card-detail-value">{cardData.expiryDate}</p>
                      </div>
                      <div className="profile-info-item">
                        <p className="profile-card-detail-label">CVV</p>
                        <p className="profile-card-detail-value">{cardData.cvv}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button className="profile-add-card-btn">Ajouter une Carte</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
