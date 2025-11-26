import React, { useState, useEffect } from 'react';
import './profil.css';
import * as authService from '../../../auth/authService';
import * as conducteurService from '../../../conducteurService';

// BusInfo Component - Affiche les infos du bus assigné
function BusInfo({ assignation, currentTrip }) {
  if (!assignation || !assignation.bus) {
    return (
      <div className="info-card">
        <div className="card-header card-header-orange">
          <div className="header-content">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <h2 className="header-title">Mon Bus</h2>
          </div>
        </div>
        <div className="card-body">
          <p className="no-data">Aucun bus assigné</p>
        </div>
      </div>
    );
  }

  const bus = assignation.bus;
  const passengers = currentTrip?.ticketsVendus || 0;
  const capacity = bus.capacite || 50;
  const occupancyPercentage = (passengers / capacity) * 100;

  return (
    <div className="info-card">
      <div className="card-header card-header-orange">
        <div className="header-content">
          <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <h2 className="header-title">Mon Bus</h2>
        </div>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label">Immatriculation</span>
          <span className="info-value info-value-orange mono">{bus.numeroImmatriculation}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Modèle</span>
          <span className="info-value">{bus.modele || 'N/A'}</span>
        </div>

        <div className="info-row">
          <div className="capacity-header">
            <span className="info-label">Capacité Passagers</span>
            <span className="info-value">
              {passengers}/{capacity}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${occupancyPercentage}%` }}></div>
          </div>
          <p className="capacity-text">{occupancyPercentage.toFixed(0)}% de capacité</p>
        </div>

        <div className="info-row no-border">
          <span className="info-label">Période d'assignation</span>
          <span className="info-value-green">
            {new Date(assignation.dateDebut).toLocaleDateString()} - {new Date(assignation.dateFin).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// TripInfo Component - Affiche les infos du trip actuel
function TripInfo({ trip, tripState, lastConfirmedStation, passages }) {
  if (!trip) {
    return (
      <div className="info-card">
        <div className="card-header card-header-orange">
          <div className="header-content">
            <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="header-title">Mon Trajet</h2>
          </div>
        </div>
        <div className="card-body">
          <p className="no-data">Aucun trip disponible aujourd'hui</p>
        </div>
      </div>
    );
  }

  // Trier les passages par ordre
  const sortedPassages = passages ? [...passages].sort((a, b) => a.ordre - b.ordre) : [];

  // Trouver le passage actuel (premier non confirmé)
  const currentPassageIndex = sortedPassages.findIndex(p => !p.confirme);
  const currentPassage = currentPassageIndex >= 0 ? sortedPassages[currentPassageIndex] : null;
  const nextPassage = currentPassageIndex >= 0 && currentPassageIndex < sortedPassages.length - 1
    ? sortedPassages[currentPassageIndex + 1]
    : null;

  return (
    <div className="info-card">
      <div className="card-header card-header-orange">
        <div className="header-content">
          <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="header-title">Mon Trajet</h2>
        </div>
      </div>

      <div className="card-body">
        <div className="info-row">
          <span className="info-label">Ligne</span>
          <span className="info-value info-value-orange line-text">{trip.ligne?.numero || 'N/A'}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Direction</span>
          <span className="info-value">{trip.estAller ? 'ALLER' : 'RETOUR'}</span>
        </div>

        <div className="trip-times">
          <div className="time-item">
            <p className="time-label">Heure de départ</p>
            <p className="time-value">
              <svg className="time-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {trip.heureDepart ? trip.heureDepart.substring(0, 5) : 'N/A'}
            </p>
          </div>
          <div className="time-item">
            <p className="time-label">Arrivée estimée</p>
            <p className="time-value">
              <svg className="time-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {trip.heureArriveeEstimee ? trip.heureArriveeEstimee.substring(0, 5) : 'N/A'}
            </p>
          </div>
        </div>

        {tripState !== "idle" && currentPassage && (
          <div className="info-row">
            <p className="section-title section-title-orange">Station actuelle</p>
            <p className="station-name">
              <svg className="station-icon station-icon-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {currentPassage.station?.nom}
            </p>
            <p className="station-time">Prévu: {currentPassage.heureEstimee?.substring(0, 5)}</p>
          </div>
        )}

        {tripState === "running" && nextPassage && (
          <div className="info-row">
            <p className="section-title">Prochaine station</p>
            <p className="station-name">
              <svg className="station-icon station-icon-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {nextPassage.station?.nom}
            </p>
          </div>
        )}

        {lastConfirmedStation && (
          <div className="confirmed-box">
            <svg className="confirmed-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="confirmed-label">Dernière confirmée</p>
              <p className="confirmed-value">{lastConfirmedStation}</p>
            </div>
          </div>
        )}

        <div className="progress-section">
          <p className="progress-title">Progression du trajet</p>
          <div className="stations-list">
            {sortedPassages.map((passage, index) => {
              const isPassed = passage.confirme;
              const isCurrent = index === currentPassageIndex;
              const isFuture = !isPassed && !isCurrent;

              return (
                <div key={passage.id} className="station-item">
                  <div className={`station-number ${isPassed ? 'station-passed' : ''} ${isCurrent ? 'station-current' : ''} ${isFuture ? 'station-future' : ''}`}>
                    {passage.ordre}
                  </div>
                  <span className={`station-text ${isPassed ? 'station-text-passed' : ''} ${isCurrent ? 'station-text-current' : ''} ${isFuture ? 'station-text-future' : ''}`}>
                    {passage.station?.nom}
                  </span>
                  {isPassed && (
                    <svg className="station-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// TripControls Component
function TripControls({
  tripState,
  onStartTrip,
  onConfirmArrival,
  onStopTrip,
  currentTrip,
  passages
}) {
  if (!currentTrip) {
    return null;
  }

  const sortedPassages = passages ? [...passages].sort((a, b) => a.ordre - b.ordre) : [];
  const currentPassageIndex = sortedPassages.findIndex(p => !p.confirme);
  const isLastStation = currentPassageIndex === sortedPassages.length - 1;

  return (
    <div className="trip-controls">
      <button
        onClick={onStartTrip}
        disabled={tripState !== "idle" || currentTrip?.statut === 'EN_COURS' || currentTrip?.statut === 'TERMINE'}
        className="control-btn control-btn-start"
      >
        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Démarrer le trip
      </button>

      <button
        onClick={onConfirmArrival}
        disabled={tripState !== "running" || currentTrip?.statut !== 'EN_COURS'}
        className="control-btn control-btn-confirm"
      >
        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {isLastStation ? "Terminer le trajet" : "Confirmer arrivée"}
      </button>

      <button
        onClick={onStopTrip}
        disabled={tripState === "idle" || currentTrip?.statut === 'TERMINE'}
        className="control-btn control-btn-stop"
      >
        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
        </svg>
        Arrêter le trip
      </button>
    </div>
  );
}

// Main DriverDashboard Component
export default function DriverDashboard() {
  const [tripState, setTripState] = useState("idle");
  const [assignation, setAssignation] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [passages, setPassages] = useState([]);
  const [lastConfirmedStation, setLastConfirmedStation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données du conducteur au montage
  useEffect(() => {
    loadDriverData();
  }, []);

  const loadDriverData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer l'utilisateur connecté
      const user = authService.getUser();
      console.log('User from localStorage:', user);

      if (!user || !user.id) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }

      console.log('Fetching assignations for conducteur ID:', user.id);

      // Récupérer les assignations du conducteur
      const assignations = await conducteurService.getAssignationsConducteur(user.id);

      if (!assignations || assignations.length === 0) {
        setError("Aucune assignation trouvée");
        setLoading(false);
        return;
      }

      // Prendre la première assignation active
      const activeAssignation = assignations.find(a => a.active) || assignations[0];
      setAssignation(activeAssignation);

      // Récupérer les trips du bus pour aujourd'hui
      const today = new Date().toISOString().split('T')[0];
      const trips = await conducteurService.getTripsByBusAndDate(activeAssignation.bus.id, today);

      if (trips && trips.length > 0) {
        // Trouver le trip le plus proche de l'heure actuelle
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const closestTrip = trips.reduce((closest, trip) => {
          if (!trip.heureDepart) return closest;

          const [tripHour, tripMinute] = trip.heureDepart.split(':').map(Number);
          const tripTimeMinutes = tripHour * 60 + tripMinute;
          const currentTimeMinutes = currentHour * 60 + currentMinute;

          // Prendre les trips qui sont dans les 2 heures avant ou après maintenant
          const timeDiff = Math.abs(tripTimeMinutes - currentTimeMinutes);

          if (!closest) return trip;

          const [closestHour, closestMinute] = closest.heureDepart.split(':').map(Number);
          const closestTimeMinutes = closestHour * 60 + closestMinute;
          const closestTimeDiff = Math.abs(closestTimeMinutes - currentTimeMinutes);

          return timeDiff < closestTimeDiff ? trip : closest;
        }, null);

        if (closestTrip) {
          setCurrentTrip(closestTrip);

          // Charger les passages du trip
          const tripPassages = await conducteurService.getPassagesByTrip(closestTrip.id);
          setPassages(tripPassages || []);

          // Déterminer l'état du trip
          if (closestTrip.statut === 'EN_COURS') {
            setTripState('running');
            // Trouver la dernière station confirmée
            const confirmedPassages = (tripPassages || []).filter(p => p.confirme);
            if (confirmedPassages.length > 0) {
              const lastConfirmed = confirmedPassages[confirmedPassages.length - 1];
              setLastConfirmedStation(lastConfirmed.station?.nom || '');
            }
          } else if (closestTrip.statut === 'TERMINE') {
            setTripState('finished');
          } else {
            setTripState('idle');
          }
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError(err.message || "Erreur lors du chargement des données");
      setLoading(false);
    }
  };

  const handleStartTrip = async () => {
    if (!currentTrip) return;

    try {
      const updatedTrip = await conducteurService.demarrerTrip(currentTrip.id);
      setCurrentTrip(updatedTrip);
      setTripState("running");

      // Confirmer automatiquement la première station
      const sortedPassages = [...passages].sort((a, b) => a.ordre - b.ordre);
      if (sortedPassages.length > 0) {
        const firstStation = sortedPassages[0];
        setLastConfirmedStation(firstStation.station?.nom || '');
      }
    } catch (err) {
      console.error('Erreur lors du démarrage du trip:', err);
      alert('Erreur lors du démarrage du trip: ' + (err.message || 'Erreur inconnue'));
    }
  };

  const handleConfirmArrival = async () => {
    if (!currentTrip || !passages) return;

    try {
      // Trouver le prochain passage non confirmé
      const sortedPassages = [...passages].sort((a, b) => a.ordre - b.ordre);
      const nextPassage = sortedPassages.find(p => !p.confirme);

      if (!nextPassage) {
        alert('Toutes les stations ont déjà été confirmées');
        return;
      }

      // Confirmer le passage avec l'heure actuelle
      const now = new Date();
      const heureReelle = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:00`;

      await conducteurService.confirmerPassage(currentTrip.id, nextPassage.station.id, heureReelle);

      // Recharger les passages
      const updatedPassages = await conducteurService.getPassagesByTrip(currentTrip.id);
      setPassages(updatedPassages);
      setLastConfirmedStation(nextPassage.station?.nom || '');

      // Si c'était la dernière station, terminer le trip
      if (nextPassage.ordre === sortedPassages[sortedPassages.length - 1].ordre) {
        await handleStopTrip();
      }
    } catch (err) {
      console.error('Erreur lors de la confirmation:', err);
      alert('Erreur lors de la confirmation: ' + (err.message || 'Erreur inconnue'));
    }
  };

  const handleStopTrip = async () => {
    if (!currentTrip) return;

    try {
      const updatedTrip = await conducteurService.terminerTrip(currentTrip.id);
      setCurrentTrip(updatedTrip);
      setTripState("finished");
    } catch (err) {
      console.error('Erreur lors de l\'arrêt du trip:', err);
      alert('Erreur lors de l\'arrêt du trip: ' + (err.message || 'Erreur inconnue'));
    }
  };

  const getStatusClass = () => {
    if (tripState === "idle") return "status-idle";
    if (tripState === "running") return "status-running";
    return "status-finished";
  };

  const getStatusText = () => {
    if (tripState === "idle") return "Prêt";
    if (tripState === "running") return "Trip en cours";
    return "Trip terminé";
  };

  if (loading) {
    return (
      <div className="driver-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Tableau de bord Conducteur</h1>
            <p className="dashboard-subtitle">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="driver-dashboard">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Tableau de bord Conducteur</h1>
            <p className="dashboard-subtitle" style={{ color: 'red' }}>Erreur: {error}</p>
          </div>
          <button onClick={loadDriverData} className="control-btn control-btn-start">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Tableau de bord Conducteur</h1>
          <p className="dashboard-subtitle">Gérez votre trajet et les informations de votre bus</p>
        </div>

        <div className="status-indicator">
          <div className={`status-dot ${getStatusClass()}`}></div>
          <span className="status-text">Statut: {getStatusText()}</span>
        </div>

        <div className="dashboard-grid">
          <BusInfo assignation={assignation} currentTrip={currentTrip} />
          <TripInfo
            trip={currentTrip}
            tripState={tripState}
            lastConfirmedStation={lastConfirmedStation}
            passages={passages}
          />
        </div>

        <div className="controls-container">
          <TripControls
            tripState={tripState}
            onStartTrip={handleStartTrip}
            onConfirmArrival={handleConfirmArrival}
            onStopTrip={handleStopTrip}
            currentTrip={currentTrip}
            passages={passages}
          />
        </div>
      </div>
    </div>
  );
}
