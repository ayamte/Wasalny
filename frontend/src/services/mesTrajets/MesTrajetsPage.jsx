import React, { useEffect, useState } from 'react';
import { MapPin, Clock, ArrowRight, Bus, Calendar } from 'lucide-react';
import Navbar from '../../components/Navbar';
import TripMap from '../../components/TripMap';
import geolocationService from '../geolocationService';
import {
  getMyTickets,
  getMyAbonnements,
  getTripDetails,
  getBusLatestLocation,
  getLigneDetails,
  calculateETA
} from '../mestrajetsService';
import './MesTrajetsPage.css';

export default function MesTrajetsPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [departStation, setDepartStation] = useState(null);
  const [arriveStation, setArriveStation] = useState(null);
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  // Load user's tickets and abonnements
  useEffect(() => {
    const loadTrajets = async () => {
      try {
        setLoading(true);
        const ticketsData = await getMyTickets();

        // Vérifier que ticketsData est bien un tableau
        if (!Array.isArray(ticketsData)) {
          console.warn('ticketsData is not an array:', ticketsData);
          setTickets([]);
          setError(null);
          return;
        }

        // Filter only active/upcoming tickets
        const activeTickets = ticketsData.filter(
          ticket => ticket.statut === 'VALIDE' || ticket.statut === 'UTILISE' || ticket.statut === 'ACHETE'
        );

        setTickets(activeTickets);
        setError(null);
      } catch (err) {
        console.error('Error loading trajets:', err);
        setError('Erreur lors du chargement de vos trajets');
      } finally {
        setLoading(false);
      }
    };

    loadTrajets();
  }, []);

  // Connect to WebSocket
  useEffect(() => {
    geolocationService.connect(
      () => {
        console.log('WebSocket connected successfully');
        setWsConnected(true);
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setWsConnected(false);
      }
    );

    return () => {
      geolocationService.disconnect();
    };
  }, []);

  // Handle trip selection
  const handleTripSelect = async (ticket) => {
    try {
      // Get trip details
      const tripDetails = await getTripDetails(ticket.tripId);

      // Utiliser les passages du trip pour trouver les stations
      // Première station = départ, dernière station = arrivée
      if (!tripDetails.passages || tripDetails.passages.length < 2) {
        setError('Trip ne contient pas assez de stations');
        return;
      }

      // Trier par ordre pour s'assurer d'avoir le bon ordre
      const sortedPassages = [...tripDetails.passages].sort((a, b) => a.ordre - b.ordre);

      const departSt = sortedPassages[0].station;
      const arriveSt = sortedPassages[sortedPassages.length - 1].station;

      setDepartStation(departSt);
      setArriveStation(arriveSt);
      setSelectedTrip({ ...tripDetails, ticket });

      // Get initial bus location
      if (tripDetails.bus && tripDetails.bus.id) {
        try {
          const location = await getBusLatestLocation(tripDetails.bus.id);
          setBusLocation(location);

          // Calculate ETA
          if (location && arriveSt) {
            const etaData = calculateETA(location, arriveSt);
            setEta(etaData);
          }

          // Subscribe to real-time updates
          if (wsConnected) {
            geolocationService.subscribeToBusLocation(
              tripDetails.bus.id,
              (newLocation) => {
                console.log('Bus location updated:', newLocation);
                setBusLocation(newLocation);

                // Recalculate ETA
                if (arriveSt) {
                  const newEta = calculateETA(newLocation, arriveSt);
                  setEta(newEta);
                }
              }
            );
          }
        } catch (err) {
          console.error('Error getting bus location:', err);
        }
      }
    } catch (err) {
      console.error('Error loading trip details:', err);
      setError('Erreur lors du chargement des détails du trajet');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mes-trajets-page">
      <Navbar />

      <div className="mes-trajets-container">
        <div className="mes-trajets-header">
          <h1>🚌 Mes Trajets</h1>
          <p>Suivez vos trajets en temps réel</p>
        </div>

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Chargement de vos trajets...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="trajets-content">
            {/* Tickets List */}
            <div className="trajets-list">
              <h2>Vos tickets actifs</h2>

              {tickets.length === 0 && (
                <div className="empty-state">
                  <p>Aucun trajet actif pour le moment</p>
                  <p className="text-sm">Achetez un ticket pour commencer !</p>
                </div>
              )}

              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`ticket-card ${selectedTrip?.ticket?.id === ticket.id ? 'selected' : ''}`}
                  onClick={() => handleTripSelect(ticket)}
                >
                  <div className="ticket-header">
                    <span className="ticket-status">{ticket.statut}</span>
                    <Calendar size={16} />
                  </div>

                  <div className="ticket-route">
                    <div className="station">
                      <MapPin size={18} className="icon-start" />
                      <span>{ticket.stationDepart || 'Départ'}</span>
                    </div>
                    <ArrowRight size={20} className="arrow" />
                    <div className="station">
                      <MapPin size={18} className="icon-end" />
                      <span>{ticket.stationArrivee || 'Arrivée'}</span>
                    </div>
                  </div>

                  <div className="ticket-info">
                    <div className="info-item">
                      <Bus size={16} />
                      <span>Ligne {ticket.ligneName || '-'}</span>
                    </div>
                    <div className="info-item">
                      <Clock size={16} />
                      <span>{formatDate(ticket.dateAchat)}</span>
                    </div>
                  </div>

                  <div className="ticket-price">
                    {ticket.prix} DH
                  </div>
                </div>
              ))}
            </div>

            {/* Map View */}
            <div className="trajets-map">
              {!selectedTrip && (
                <div className="map-empty">
                  <MapPin size={48} />
                  <p>Sélectionnez un trajet pour voir sa position en temps réel</p>
                </div>
              )}

              {selectedTrip && (
                <>
                  <div className="map-info">
                    <h3>🚌 {selectedTrip.ligne?.nom || 'Ligne'}</h3>
                    {busLocation && (
                      <div className="live-badge">
                        <span className="live-dot"></span>
                        EN DIRECT
                      </div>
                    )}
                    {!wsConnected && (
                      <div className="offline-badge">
                        ⚠️ Hors ligne
                      </div>
                    )}
                  </div>

                  {eta && (
                    <div className="eta-info">
                      <div className="eta-item">
                        <MapPin size={16} />
                        <span>Distance: {eta.distance} km</span>
                      </div>
                      <div className="eta-item highlight">
                        <Clock size={16} />
                        <span>ETA: ~{eta.eta} minutes</span>
                      </div>
                    </div>
                  )}

                  <TripMap
                    departStation={departStation}
                    arriveStation={arriveStation}
                    busLocation={busLocation}
                    eta={eta}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
