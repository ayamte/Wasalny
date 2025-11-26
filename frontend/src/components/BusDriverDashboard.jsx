import React, { useState, useEffect } from 'react';
import { Bus, Play, CheckCircle, Square, MapPin, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { busService, tripService, ligneService, stationService, handleApiError } from '../services/trajetService';

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
  // États pour les données
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busData, setBusData] = useState(null);
  const [assignedTrip, setAssignedTrip] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [lastConfirmedStation, setLastConfirmedStation] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // États dérivés
  const tripState = activeTrip ? 'running' : 'idle';
  const isLastStation = activeTrip && currentStationIndex === activeTrip.stations?.length - 1;
  const occupancyPercentage = busData ? (busData.passengers / busData.capacity) * 100 : 0;


  // Charger les données au montage du composant
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger le bus assigné (peut retourner 404 si pas de bus assigné)
      try {
        const bus = await busService.getAssignedBus();
        setBusData(bus);
      } catch (busError) {
        if (busError.response?.status !== 404) {
          console.error('Erreur lors du chargement du bus:', busError);
        }
        // Si 404, pas de bus assigné - c'est normal
        setBusData(null);
      }

      // Charger le trajet assigné (peut retourner 404 si pas de trajet assigné)
      try {
        const assignedTripData = await tripService.getAssignedTrip();
        setAssignedTrip(assignedTripData);
      } catch (tripError) {
        if (tripError.response?.status !== 404) {
          console.error('Erreur lors du chargement du trajet assigné:', tripError);
        }
        // Si 404, pas de trajet assigné - c'est normal
        setAssignedTrip(null);
      }

      // Charger le trajet actif s'il existe
      const activeTripData = await tripService.getActiveTrip();
      if (activeTripData) {
        setActiveTrip(activeTripData);
        // Calculer l'index de la station actuelle
        const currentIndex = activeTripData.stations?.findIndex(station =>
          station.id === activeTripData.currentStation?.id
        ) ?? 0;
        setCurrentStationIndex(currentIndex);

        // Trouver la dernière station confirmée
        const lastConfirmed = activeTripData.stations?.slice(0, currentIndex).pop();
        if (lastConfirmed) {
          setLastConfirmedStation(lastConfirmed.nom || lastConfirmed.name);
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    if (!busData || !assignedTrip) return;

    try {
      setActionLoading(true);
      setError(null);

      // Commencer le trajet assigné (au lieu d'en créer un nouveau)
      const tripData = {
        tripId: assignedTrip.id,
        departureTime: new Date().toISOString()
      };

      const startedTrip = await tripService.startTrip(tripData);
      setActiveTrip(startedTrip);
      setCurrentStationIndex(1);
      setLastConfirmedStation(startedTrip.stations[0].nom || startedTrip.stations[0].name);
    } catch (err) {
      console.error('Erreur lors du démarrage du trajet:', err);
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmArrival = async () => {
    if (!activeTrip || !activeTrip.stations) return;

    try {
      setActionLoading(true);
      setError(null);

      const currentStation = activeTrip.stations[currentStationIndex];

      await tripService.confirmArrival(activeTrip.id, currentStation.id);

      if (currentStationIndex < activeTrip.stations.length - 1) {
        setLastConfirmedStation(currentStation.nom || currentStation.name);
        setCurrentStationIndex(currentStationIndex + 1);
      } else {
        // Trajet terminé
        setActiveTrip(null);
        setCurrentStationIndex(0);
        setLastConfirmedStation('');
      }
    } catch (err) {
      console.error('Erreur lors de la confirmation d\'arrivée:', err);
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleStopTrip = async () => {
    if (!activeTrip) return;

    try {
      setActionLoading(true);
      setError(null);

      await tripService.endTrip(activeTrip.id);

      setActiveTrip(null);
      setCurrentStationIndex(0);
      setLastConfirmedStation('');
    } catch (err) {
      console.error('Erreur lors de l\'arrêt du trajet:', err);
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="dashboard">
        <div className="container">
          {/* Header */}
          <div className="header">
            <h1>Driver Dashboard</h1>
          
          </div>

          {/* Loading State */}
          {loading && (
            <div className="status-indicator">
              <Loader2 size={16} className="animate-spin" />
              <span className="status-text">Loading...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="status-indicator">
              <AlertCircle size={16} style={{ color: '#dc2626' }} />
              <span className="status-text" style={{ color: '#dc2626' }}>
                Error: {error}
              </span>
            </div>
          )}

          {/* Status Indicator */}
          {!loading && !error && (
            <div className="status-indicator">
              <div className={`status-dot ${tripState}`} />
              <span className="status-text">
                Status: {tripState === 'idle' ? 'Ready' : tripState === 'running' ? 'Trip in Progress' : 'Trip Completed'}
              </span>
            </div>
          )}

          {/* Main Grid */}
          {!loading && !error && (
            <div className="grid">
              {/* Bus Info Card */}
              {busData && (
                <div className="card">
                  <div className="card-header">
                    <Bus size={24} />
                    <h2>My Bus</h2>
                  </div>
                  <div className="card-body">
                    <div className="info-row">
                      <span className="info-label">Bus Number</span>
                      <span className="info-value">{busData.numero || busData.number}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">License Plate</span>
                      <span className="info-value orange">{busData.immatriculation || busData.licensePlate}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Model</span>
                      <span className="info-value">{busData.modele || busData.model}</span>
                    </div>
                    <div className="capacity-section">
                      <div className="capacity-header">
                        <span className="info-label">Passenger Capacity</span>
                        <span className="info-value">
                          {busData.passagersActuels || busData.passengers || 0}/{busData.capacite || busData.capacity}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${occupancyPercentage}%` }} />
                      </div>
                      <p className="capacity-text">{occupancyPercentage.toFixed(0)}% capacity</p>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Last Maintenance</span>
                      <span className="info-value green">
                        {busData.derniereMaintenance ?
                          new Date(busData.derniereMaintenance).toLocaleDateString() :
                          busData.lastMaintenance || 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trip Info Card */}
              {activeTrip && activeTrip.stations ? (
                <div className="card">
                  <div className="card-header">
                    <MapPin size={24} />
                    <h2>Trip Information</h2>
                  </div>
                  <div className="card-body">
                    <div className="trip-info-section">
                      <div className="trip-detail">
                        <MapPin size={20} />
                        <span>
                          <strong>{activeTrip.ligne?.nom || activeTrip.line || 'Line'}</strong>: {' '}
                          {activeTrip.stations[0]?.nom || activeTrip.startStation} → {' '}
                          {activeTrip.stations[activeTrip.stations.length - 1]?.nom || activeTrip.endStation}
                        </span>
                      </div>
                      <div className="trip-detail">
                        <Clock size={20} />
                        <span>
                          Departure: <strong>
                            {activeTrip.heureDepart ?
                              new Date(activeTrip.heureDepart).toLocaleTimeString() :
                              activeTrip.departureTime || 'N/A'
                            }
                          </strong> | Arrival: <strong>
                            {activeTrip.heureArriveeEstimee ?
                              new Date(activeTrip.heureArriveeEstimee).toLocaleTimeString() :
                              activeTrip.estimatedArrivalTime || 'N/A'
                            }
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="stations-list">
                      {activeTrip.stations.map((station, index) => (
                        <div
                          key={station.id}
                          className={`station-item ${
                            index === currentStationIndex && tripState === 'running'
                              ? 'current'
                              : index < currentStationIndex && tripState === 'running'
                              ? 'completed'
                              : ''
                          }`}
                        >
                          <div className="station-number">{index + 1}</div>
                          <span className="station-name">{station.nom || station.name}</span>
                        </div>
                      ))}
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
              ) : assignedTrip ? (
                <div className="card">
                  <div className="card-header">
                    <MapPin size={24} />
                    <h2>Assigned Trip</h2>
                  </div>
                  <div className="card-body">
                    <div className="trip-info-section">
                      <div className="trip-detail">
                        <MapPin size={20} />
                        <span>
                          <strong>{assignedTrip.ligne?.nom || assignedTrip.line || 'Line'}</strong>: {' '}
                          {assignedTrip.stations[0]?.nom || assignedTrip.startStation} → {' '}
                          {assignedTrip.stations[assignedTrip.stations.length - 1]?.nom || assignedTrip.endStation}
                        </span>
                      </div>
                      <div className="trip-detail">
                        <Clock size={20} />
                        <span>
                          Scheduled: <strong>
                            {assignedTrip.heureDepart ?
                              new Date(assignedTrip.heureDepart).toLocaleTimeString() :
                              assignedTrip.departureTime || 'N/A'
                            }
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="stations-list">
                      {assignedTrip.stations.map((station, index) => (
                        <div
                          key={station.id}
                          className="station-item"
                        >
                          <div className="station-number">{index + 1}</div>
                          <span className="station-name">{station.nom || station.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="last-confirmed" style={{ backgroundColor: '#e0f2fe', borderLeftColor: '#0284c7' }}>
                      <p className="last-confirmed-text" style={{ color: '#0c4a6e' }}>
                        Trip assigned. Click "Start Trip" to begin your route.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header">
                    <MapPin size={24} />
                    <h2>Trip Information</h2>
                  </div>
                  <div className="card-body">
                    <p className="info-value" style={{ textAlign: 'center', color: '#6b7280' }}>
                      {busData ? 'No trip assigned. Please contact administrator.' : 'No bus assigned. Please contact administrator.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          {!loading && !error && (
            <div className="controls">
              <button
                onClick={handleStartTrip}
                disabled={tripState !== 'idle' || actionLoading || !busData || !assignedTrip}
                className="btn btn-start"
              >
                {actionLoading && tripState === 'idle' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Play size={20} />
                )}
                {actionLoading && tripState === 'idle' ? 'Starting...' : 'Start Trip'}
              </button>

              <button
                onClick={handleConfirmArrival}
                disabled={tripState !== 'running' || actionLoading || !activeTrip}
                className="btn btn-confirm"
              >
                {actionLoading && tripState === 'running' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <CheckCircle size={20} />
                )}
                {actionLoading && tripState === 'running' ?
                  'Confirming...' :
                  (isLastStation ? 'Complete Route' : 'Confirm Arrival')
                }
              </button>

              <button
                onClick={handleStopTrip}
                disabled={tripState === 'idle' || actionLoading}
                className="btn btn-stop"
              >
                {actionLoading && tripState !== 'idle' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Square size={20} />
                )}
                {actionLoading && tripState !== 'idle' ? 'Stopping...' : 'Stop Trip'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}