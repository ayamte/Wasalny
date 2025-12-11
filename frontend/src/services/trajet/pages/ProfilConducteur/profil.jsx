import React, { useState, useEffect } from 'react';
import { Bus, Play, CheckCircle, Square, MapPin, Clock, AlertCircle } from 'lucide-react';
import {
  getTripAssigne,
  getTripActif,
  demarrerTrip,
  terminerTrip,
  confirmerPassage
} from '../../../../conducteurService';

export default function BusDriverDashboard() {
  // Inject CSS styles directly
  const styles = `
    /* ========================================
       Bus Driver Dashboard - Styles
       ======================================== */

    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #ffffff;
      color: #000000;
    }

    /* Dashboard Container */
    .dashboard {
      min-height: 100vh;
      background-color: #ffffff;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Header Section */
    .header {
      margin-bottom: 2rem;
      border-bottom: 2px solid #000000;
      padding-bottom: 1.5rem;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: bold;
      color: #000000;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #6b7280;
    }

    /* Status Indicator */
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .status-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .status-dot.idle {
      background-color: #9ca3af;
    }

    .status-dot.running {
      background-color: #ea580c;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .status-dot.finished {
      background-color: #22c55e;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .status-text {
      font-size: 0.875rem;
      font-weight: 600;
      color: #000000;
      text-transform: capitalize;
    }

    /* Grid Layout */
    .grid {
      display: grid;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    @media (min-width: 1024px) {
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    /* Card Component */
    .card {
      background-color: #ffffff;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .card-header {
      background-color: #ea580c;
      border-bottom: 2px solid #ea580c;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .card-header h2 {
      font-size: 1.25rem;
      font-weight: bold;
      color: #ffffff;
    }

    .card-header svg {
      color: #ffffff;
    }

    .card-body {
      padding: 1.5rem;
    }

    /* Info Rows */
    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }

    .info-row:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .info-label {
      color: #6b7280;
    }

    .info-value {
      font-weight: bold;
      color: #000000;
    }

    .info-value.orange {
      color: #ea580c;
      font-family: 'Courier New', monospace;
    }

    .info-value.green {
      color: #22c55e;
      font-size: 0.875rem;
    }

    /* Capacity Section */
    .capacity-section {
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }

    .capacity-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 9999px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .progress-fill {
      height: 100%;
      background-color: #ea580c;
      transition: width 0.3s ease;
    }

    .capacity-text {
      font-size: 0.875rem;
      color: #6b7280;
    }

    /* Trip Information */
    .trip-info-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .trip-detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .trip-detail svg {
      color: #ea580c;
    }

    /* Stations List */
    .stations-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .station-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.375rem;
      background-color: #f9fafb;
      transition: all 0.2s ease;
    }

    .station-item.current {
      background-color: #fed7aa;
      border: 2px solid #ea580c;
    }

    .station-item.completed {
      background-color: #d1fae5;
    }

    .station-number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.875rem;
      background-color: #e5e7eb;
      color: #6b7280;
    }

    .station-item.current .station-number {
      background-color: #ea580c;
      color: #ffffff;
    }

    .station-item.completed .station-number {
      background-color: #22c55e;
      color: #ffffff;
    }

    .station-name {
      flex: 1;
      font-weight: 500;
    }

    /* Last Confirmed Station */
    .last-confirmed {
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: #d1fae5;
      border-radius: 0.375rem;
      border-left: 4px solid #22c55e;
    }

    .last-confirmed-text {
      font-size: 0.875rem;
      color: #065f46;
    }

    /* Control Buttons */
    .controls {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .controls {
        flex-direction: row;
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      color: #ffffff;
      border: none;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }

    .btn:hover:not(:disabled) {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-start {
      background-color: #ea580c;
    }

    .btn-start:hover:not(:disabled) {
      background-color: #c2410c;
    }

    .btn-confirm {
      background-color: #22c55e;
    }

    .btn-confirm:hover:not(:disabled) {
      background-color: #16a34a;
    }

    .btn-stop {
      background-color: #dc2626;
    }

    .btn-stop:hover:not(:disabled) {
      background-color: #b91c1c;
    }

    /* Responsive Typography */
    @media (min-width: 640px) {
      .header h1 {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 640px) {
      .dashboard {
        padding: 1rem 0.5rem;
      }

      .card-body {
        padding: 1rem;
      }
    }
  `;

  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripState, setTripState] = useState('idle');
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [lastConfirmedStation, setLastConfirmedStation] = useState('');

  // Charger les données du trip au montage du composant
  useEffect(() => {
    chargerTripData();
  }, []);

  const chargerTripData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Essayer d'abord de récupérer un trip actif (en cours)
      let trip = null;
      try {
        trip = await getTripActif();
        setTripState('running');

        // Trouver la dernière station confirmée
        const passages = trip.passages || [];
        const confirmedPassages = passages.filter(p => p.confirme);
        if (confirmedPassages.length > 0) {
          const lastConfirmed = confirmedPassages[confirmedPassages.length - 1];
          setLastConfirmedStation(lastConfirmed.station.nom);
          setCurrentStationIndex(lastConfirmed.ordre);
        }
      } catch (err) {
        // Si pas de trip actif, récupérer le trip assigné (planifié)
        if (err.response?.status === 404) {
          trip = await getTripAssigne();
          setTripState('idle');
        } else {
          throw err;
        }
      }

      setTripData(trip);
    } catch (err) {
      console.error('Erreur lors du chargement du trip:', err);
      setError(err.response?.data?.message || 'Aucun trip assigné pour le moment');
    } finally {
      setLoading(false);
    }
  };

  // Extraire les données du trip et du bus
  const busData = tripData ? {
    number: tripData.bus.numeroImmatriculation,
    capacity: tripData.bus.capacite,
    passengers: tripData.ticketsVendus || 0,
    licensePlate: tripData.bus.numeroImmatriculation,
    model: tripData.bus.modele,
    lastMaintenance: "N/A", // Non disponible dans le backend
  } : null;

  const trip = tripData ? {
    id: tripData.id,
    line: `Ligne ${tripData.ligne.numero} - ${tripData.ligne.nom}`,
    startStation: tripData.passages?.[0]?.station.nom || 'N/A',
    endStation: tripData.passages?.[tripData.passages.length - 1]?.station.nom || 'N/A',
    stations: tripData.passages?.map(p => ({
      id: p.station.id,
      name: p.station.nom,
      ordre: p.ordre,
      heurePrevu: p.heurePrevu,
      heureEstimee: p.heureEstimee,
      confirme: p.confirme,
    })) || [],
    departureTime: tripData.heureDepart,
    estimatedArrivalTime: tripData.heureArriveeEstimee,
  } : null;

  const occupancyPercentage = busData ? (busData.passengers / busData.capacity) * 100 : 0;
  const isLastStation = trip ? currentStationIndex === trip.stations.length - 1 : false;

  const handleStartTrip = async () => {
    if (!tripData) return;

    try {
      setLoading(true);
      const updatedTrip = await demarrerTrip(tripData.id);
      setTripData(updatedTrip);
      setTripState('running');

      // La première station est automatiquement confirmée par le backend
      if (updatedTrip.passages && updatedTrip.passages.length > 0) {
        setLastConfirmedStation(updatedTrip.passages[0].station.nom);
        setCurrentStationIndex(1);
      }
    } catch (err) {
      console.error('Erreur lors du démarrage du trip:', err);
      setError('Impossible de démarrer le trip');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmArrival = async () => {
    if (!tripData || !trip) return;

    try {
      setLoading(true);
      const currentStation = trip.stations[currentStationIndex];

      // Confirmer le passage avec l'heure actuelle
      const heureReelle = new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const updatedTrip = await confirmerPassage(tripData.id, currentStation.id, heureReelle);
      setTripData(updatedTrip);
      setLastConfirmedStation(currentStation.name);

      if (currentStationIndex < trip.stations.length - 1) {
        setCurrentStationIndex(currentStationIndex + 1);
      } else {
        // Dernier arrêt - terminer le trip
        await handleStopTrip();
      }
    } catch (err) {
      console.error('Erreur lors de la confirmation du passage:', err);
      setError('Impossible de confirmer le passage');
    } finally {
      setLoading(false);
    }
  };

  const handleStopTrip = async () => {
    if (!tripData) return;

    try {
      setLoading(true);
      await terminerTrip(tripData.id);
      setTripState('finished');

      // Recharger les données pour obtenir le prochain trip
      setTimeout(() => {
        chargerTripData();
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de l\'arrêt du trip:', err);
      setError('Impossible de terminer le trip');
    } finally {
      setLoading(false);
    }
  };

  // État de chargement
  if (loading && !tripData) {
    return (
      <>
        <style>{styles}</style>
        <div className="dashboard">
          <div className="container">
            <div className="header">
              <h1>Driver Dashboard</h1>
              <p>Chargement des données...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // État d'erreur
  if (error && !tripData) {
    return (
      <>
        <style>{styles}</style>
        <div className="dashboard">
          <div className="container">
            <div className="header">
              <h1>Driver Dashboard</h1>
              <p style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} />
                {error}
              </p>
            </div>
            <button
              onClick={chargerTripData}
              className="btn btn-start"
              style={{ marginTop: '1rem' }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard">
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1>Driver Dashboard</h1>
            <p>Manage your route and bus information</p>
          </div>

          {/* Message d'erreur temporaire */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #dc2626',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#dc2626'
            }}>
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Status Indicator */}
          <div className="status-indicator">
            <div className={`status-dot ${tripState}`} />
            <span className="status-text">
              Status: {tripState === 'idle' ? 'Ready' : tripState === 'running' ? 'Trip in Progress' : 'Trip Completed'}
            </span>
          </div>

          {/* Main Grid */}
          <div className="grid">
            {/* Bus Info Card */}
            <div className="card">
              <div className="card-header">
                <Bus size={24} />
                <h2>My Bus</h2>
              </div>
              <div className="card-body">
                <div className="info-row">
                  <span className="info-label">Bus Number</span>
                  <span className="info-value">{busData.number}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">License Plate</span>
                  <span className="info-value orange">{busData.licensePlate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Model</span>
                  <span className="info-value">{busData.model}</span>
                </div>
                <div className="capacity-section">
                  <div className="capacity-header">
                    <span className="info-label">Passenger Capacity</span>
                    <span className="info-value">
                      {busData.passengers}/{busData.capacity}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${occupancyPercentage}%` }} />
                  </div>
                  <p className="capacity-text">{occupancyPercentage.toFixed(0)}% capacity</p>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Maintenance</span>
                  <span className="info-value green">{busData.lastMaintenance}</span>
                </div>
              </div>
            </div>

            {/* Trip Info Card */}
            <div className="card">
              <div className="card-header">
                <MapPin size={24} />
                <h2>Trip Information</h2>
              </div>
              <div className="card-body">
                <div className="trip-info-section">
                  <div className="trip-detail">
                    <MapPin size={20} />
                    <span><strong>{trip.line}</strong>: {trip.startStation} → {trip.endStation}</span>
                  </div>
                  <div className="trip-detail">
                    <Clock size={20} />
                    <span>Departure: <strong>{trip.departureTime}</strong> | Arrival: <strong>{trip.estimatedArrivalTime}</strong></span>
                  </div>
                </div>

                <div className="stations-list">
                  {trip.stations.map((station, index) => {
                    const isConfirmed = station.confirme;
                    const isCurrent = index === currentStationIndex && tripState === 'running';
                    const isCompleted = (isConfirmed || index < currentStationIndex) && tripState === 'running';

                    return (
                      <div
                        key={station.id}
                        className={`station-item ${
                          isCurrent ? 'current' : isCompleted ? 'completed' : ''
                        }`}
                      >
                        <div className="station-number">{station.ordre}</div>
                        <div style={{ flex: 1 }}>
                          <span className="station-name">{station.name}</span>
                          {station.heureEstimee && (
                            <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                              Arrivée prévue: {station.heureEstimee}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {lastConfirmedStation && (
                  <div className="last-confirmed">
                    <p className="last-confirmed-text">
                      Last confirmed: <strong>{lastConfirmedStation}</strong>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            <button
              onClick={handleStartTrip}
              disabled={tripState !== 'idle' || loading}
              className="btn btn-start"
            >
              <Play size={20} />
              {loading ? 'Chargement...' : 'Start Trip'}
            </button>

            <button
              onClick={handleConfirmArrival}
              disabled={tripState !== 'running' || loading}
              className="btn btn-confirm"
            >
              <CheckCircle size={20} />
              {loading ? 'Confirmation...' : isLastStation ? 'Complete Route' : 'Confirm Arrival'}
            </button>

            <button
              onClick={handleStopTrip}
              disabled={tripState === 'idle' || loading}
              className="btn btn-stop"
            >
              <Square size={20} />
              {loading ? 'Arrêt...' : 'Stop Trip'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
