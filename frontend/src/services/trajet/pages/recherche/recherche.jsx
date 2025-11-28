import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, ArrowRightLeft, Calendar, ChevronLeft, Clock, Banknote, Users } from 'lucide-react'
import Navbar from '../../../../components/Navbar'
import { stationService, handleApiError } from '../../configurationService'
import { tripService as trajetTripService } from '../../../../services/trajetService'
import './recherche.css'

// New Hero Search Page (Main landing after login)
export function SearchTripsPage() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [stations, setStations] = useState([])
  const [selectedFromStation, setSelectedFromStation] = useState(null)
  const [selectedToStation, setSelectedToStation] = useState(null)
  const [isLoadingStations, setIsLoadingStations] = useState(true)

  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      setIsLoadingStations(true)
      try {
        const fetchedStations = await stationService.getAllStations()
        if (fetchedStations && fetchedStations.length > 0) {
          setStations(fetchedStations)
        } else {
          setStations([])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stations:', error)
        setStations([])
      } finally {
        setIsLoadingStations(false)
      }
    }

    fetchStations()
  }, [])

  const handleSwap = () => {
    const tempName = from
    const tempStation = selectedFromStation
    setFrom(to)
    setSelectedFromStation(selectedToStation)
    setTo(tempName)
    setSelectedToStation(tempStation)
  }

  const handleSearch = () => {
    if (selectedFromStation && selectedToStation && date) {
      navigate(`/trips?fromId=${selectedFromStation.id}&toId=${selectedToStation.id}&fromName=${encodeURIComponent(from)}&toName=${encodeURIComponent(to)}&date=${date}`)
    }
  }

  const getStationName = (station) => station.nom || station.name || 'Station'

  const fromStations = stations.filter((s) => getStationName(s).toLowerCase().includes(from.toLowerCase()))
  const toStations = stations.filter((s) => getStationName(s).toLowerCase().includes(to.toLowerCase()))

  return (
    <>
      <Navbar />
      <main className="hero-search-main">
        {/* Hero Section with Background Image */}
        <div className="hero-section">
        {/* Background Image */}
        <div className="hero-background">
          <img src="/images/acceil.png" alt="Bus booking background" className="hero-image" />
          {/* Overlay */}
          <div className="hero-overlay"></div>
        </div>

        {/* Content */}
        <div className="hero-content">
          {/* Welcome Message */}
          <div className="hero-header">
            <h1 className="hero-title">Bienvenue sur Wasalny</h1>
            <p className="hero-subtitle">Trouvez et réservez vos trajets en bus facilement</p>
          </div>

          {/* Large Search Bar */}
          <div className="hero-search-card">
            {/* Search Title */}
            <h2 className="search-card-title">Chercher un trajet</h2>

            {/* Search Form */}
            <div className="search-form">
              {/* From and To Row */}
              <div className="search-row">
                {/* From */}
                <div className="search-field">
                  <label className="search-label">Départ</label>
                  <div className="relative">
                    <div
                      className="search-input-wrapper"
                      onClick={() => setShowFromDropdown(!showFromDropdown)}
                    >
                      <MapPin size={20} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Sélectionner une station"
                        value={from}
                        onChange={(e) => {
                          setFrom(e.target.value)
                          setShowFromDropdown(true)
                        }}
                        className="search-input"
                      />
                    </div>
                    {showFromDropdown && from.length > 0 && (
                      <div className="search-dropdown">
                        {isLoadingStations ? (
                          <div className="search-dropdown-item" style={{ color: '#666', fontStyle: 'italic' }}>
                            Chargement des stations...
                          </div>
                        ) : fromStations.length > 0 ? (
                          fromStations.map((station) => (
                            <div
                              key={station.id}
                              onClick={() => {
                                setFrom(getStationName(station))
                                setSelectedFromStation(station)
                                setShowFromDropdown(false)
                              }}
                              className="search-dropdown-item"
                            >
                              {getStationName(station)}
                            </div>
                          ))
                        ) : (
                          <div className="search-dropdown-item" style={{ color: '#666', fontStyle: 'italic' }}>
                            Aucune station trouvée
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* To */}
                <div className="search-field">
                  <label className="search-label">Arrivée</label>
                  <div className="relative">
                    <div
                      className="search-input-wrapper"
                      onClick={() => setShowToDropdown(!showToDropdown)}
                    >
                      <MapPin size={20} className="search-icon" />
                      <input
                        type="text"
                        placeholder="Sélectionner une station"
                        value={to}
                        onChange={(e) => {
                          setTo(e.target.value)
                          setShowToDropdown(true)
                        }}
                        className="search-input"
                      />
                    </div>
                    {showToDropdown && to.length > 0 && (
                      <div className="search-dropdown">
                        {isLoadingStations ? (
                          <div className="search-dropdown-item" style={{ color: '#666', fontStyle: 'italic' }}>
                            Chargement des stations...
                          </div>
                        ) : toStations.length > 0 ? (
                          toStations.map((station) => (
                            <div
                              key={station.id}
                              onClick={() => {
                                setTo(getStationName(station))
                                setSelectedToStation(station)
                                setShowToDropdown(false)
                              }}
                              className="search-dropdown-item"
                            >
                              {getStationName(station)}
                            </div>
                          ))
                        ) : (
                          <div className="search-dropdown-item" style={{ color: '#666', fontStyle: 'italic' }}>
                            Aucune station trouvée
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="search-field">
                <label className="search-label">Date de départ</label>
                <div className="search-input-wrapper">
                  <Calendar size={20} className="search-icon" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              {/* Swap Button */}
              {from && to && (
                <button onClick={handleSwap} className="swap-button">
                  <ArrowRightLeft size={20} className="swap-icon" />
                </button>
              )}

              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!from || !to || !date}
                className={`search-submit-button ${(!from || !to || !date) ? 'disabled' : ''}`}
              >
                Chercher maintenant
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  )
}

// Trips Results Page
export function TripsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const fromId = searchParams.get('fromId') || ''
  const toId = searchParams.get('toId') || ''
  const fromName = searchParams.get('fromName') || ''
  const toName = searchParams.get('toName') || ''
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTrips = async () => {
      if (!date || !fromId || !toId) {
        setError('Paramètres de recherche manquants')
        return
      }

      setIsLoading(true)
      setError('')

      try {
        // 1. Appel backend : rechercher les trips entre deux stations
        const backendTrips = await trajetTripService.searchTrips(fromId, toId, date)

        const filtered = backendTrips || []

        // 2. Mapping au même format que les anciens trips mock
        const mapped = filtered.map((trip, index) => {
          // Extraire les heures au format HH:MM
          const departure = trip.heureDepart ? trip.heureDepart.substring(0, 5) : '00:00'
          const arrival = trip.heureArriveeEstimee ? trip.heureArriveeEstimee.substring(0, 5) : '00:00'

          // Capacité du bus et places disponibles
          const totalSeats = trip.bus?.capacite || 50
          const availableSeats = trip.placesDisponibles ?? Math.max(totalSeats - (trip.ticketsVendus || 0), 0)

          // Prix depuis la ligne (BigDecimal converti en number)
          const price = trip.prix ? Number(trip.prix) : (trip.ligne?.prixStandard ? Number(trip.ligne.prixStandard) : 30)

          return {
            id: trip.id || index + 1,
            lineNumber: trip.numeroTrip || trip.ligne?.numero || `Ligne ${index + 1}`,
            lineName: trip.ligne?.nom || `${fromName} - ${toName}`,
            departureTime: departure,
            arrivalTime: arrival,
            price: price,
            totalSeats: totalSeats,
            availableSeats: availableSeats,
            bus: trip.bus?.numeroImmatriculation || trip.bus?.modele || 'Bus',
          }
        })

        setTrips(mapped)
      } catch (e) {
        setError(handleApiError(e))
        setTrips([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrips()
  }, [date, fromId, toId, fromName, toName])

  const handleBookTrip = (trip) => {  
    navigate('/paiement', {  
      state: {  
        typeService: 'ACHAT_TICKET',  
        referenceService: trip.id,  
        montant: trip.price  
      }  
    });  
  };

  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr + 'T00:00:00')
    return dateObj.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculateDuration = (departure, arrival) => {
    const [depHour, depMin] = departure.split(':').map(Number)
    const [arrHour, arrMin] = arrival.split(':').map(Number)

    let durationMin = arrHour * 60 + arrMin - (depHour * 60 + depMin)
    if (durationMin < 0) durationMin += 24 * 60

    const hours = Math.floor(durationMin / 60)
    const minutes = durationMin % 60

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100
    if (percentage > 50) return '#FF6B35'
    if (percentage > 20) return '#FFA726'
    return '#D32F2F'
  }

  return (
    <>
      <Navbar />
      <main className="trips-results-main">
        {/* Header */}
        <header className="trips-results-header">
        <div className="trips-results-header-container">
          <div className="trips-results-header-top">
            <button
              onClick={() => navigate(-1)}
              className="trips-results-back-btn"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="trips-results-title">Trajets Disponibles</h1>
              <p className="trips-results-subtitle">
                {fromName} → {toName} • {formatDate(date)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="trips-results-content">
        {isLoading ? (
          <div className="trips-results-empty-card">
            <div className="trips-results-empty-content">
              <p className="trips-results-empty-text">
                Chargement des trajets...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="trips-results-empty-card">
            <div className="trips-results-empty-content">
              <p className="trips-results-empty-text">
                {error}
              </p>
              <button
                onClick={() => navigate('/trajet/recherche')}
                className="trips-results-empty-btn"
              >
                Nouvelle recherche
              </button>
            </div>
          </div>
        ) : trips.length > 0 ? (
          <div className="trips-results-list-space">
            {/* Results Summary */}
            <div className="trips-results-summary">
              <p>
                {trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Trips List */}
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="trips-results-trip-card"
              >
                <div className="trips-results-trip-content">
                  <div className="trips-results-trip-grid">
                    {/* Line and Time */}
                    <div className="trips-results-trip-section-1">
                      <div className="trips-results-trip-line">
                        <span className="trips-results-badge">
                          {trip.lineNumber}
                        </span>
                        <span className="trips-results-line-name">
                          {trip.lineName}
                        </span>
                      </div>
                      <div className="trips-results-trip-departure">
                        <p className="trips-results-time-large">
                          {trip.departureTime}
                        </p>
                        <p className="trips-results-time-label">
                          Départ
                        </p>
                      </div>
                    </div>

                    {/* Journey Info */}
                    <div className="trips-results-trip-section-2">
                      <div className="trips-results-journey-info">
                        <div className="trips-results-duration">
                          <Clock size={14} />
                          {calculateDuration(trip.departureTime, trip.arrivalTime)}
                        </div>
                        <div className="trips-results-divider"></div>
                      </div>
                    </div>

                    {/* Arrival Time */}
                    <div className="trips-results-trip-section-3">
                      <div className="trips-results-trip-arrival">
                        <p className="trips-results-time-large">
                          {trip.arrivalTime}
                        </p>
                        <p className="trips-results-time-label">
                          Arrivée
                        </p>
                      </div>
                    </div>

                    {/* Price and Availability */}
                    <div className="trips-results-trip-section-4">
                      {/* Price */}
                      <div className="trips-results-info-block">
                        <Banknote size={18} className="trips-results-icon-primary" />
                        <div>
                          <p className="trips-results-price">
                            {Number(trip.price).toFixed(2)} DH
                          </p>
                          <p className="trips-results-info-label">
                            Par personne
                          </p>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="trips-results-info-block">
                        <Users
                          size={18}
                          style={{ color: getAvailabilityColor(trip.availableSeats, trip.totalSeats) }}
                        />
                        <div>
                          <p
                            className="trips-results-availability"
                            style={{ color: getAvailabilityColor(trip.availableSeats, trip.totalSeats) }}
                          >
                            {trip.availableSeats} place{trip.availableSeats > 1 ? 's' : ''}
                          </p>
                          <p className="trips-results-info-label">
                            sur {trip.totalSeats}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="trips-results-button-container">
                    <button
                      onClick={() => handleBookTrip(trip)}
                      className="trips-results-book-btn"
                    >
                      Réserver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="trips-results-empty-card">
            <div className="trips-results-empty-content">
              <p className="trips-results-empty-text">
                Aucun trajet ne correspond à votre recherche
              </p>
              <button
                onClick={() => navigate('/trajet/recherche')}
                className="trips-results-empty-btn"
              >
                Nouvelle recherche
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
    </>
  )
}

export default SearchTripsPage
