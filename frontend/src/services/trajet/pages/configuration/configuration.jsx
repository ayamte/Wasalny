import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  Bus,
  Clock,
  MapPin,
  Play,
  Save,
  X,
  ChevronLeft,
  Info,
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react';
import './configuration.css';

// Utility functions
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Calculate schedule
const calculateSchedule = (data) => {
  const startMinutesA = timeToMinutes(data.firstDepartureA);
  const startMinutesB = timeToMinutes(data.firstDepartureB);

  const departuresA = [];
  const departuresB = [];

  for (let i = 0; i < data.numberOfBuses; i++) {
    const departureTime = startMinutesA + i * data.intervalMinutes;
    departuresA.push(minutesToTime(departureTime));
  }

  for (let i = 0; i < data.numberOfBuses; i++) {
    const departureTime = startMinutesB + i * data.intervalMinutes;
    departuresB.push(minutesToTime(departureTime));
  }

  const totalBuses = data.numberOfBuses * 2;
  const totalTrips = departuresA.length + departuresB.length;

  const coverageStart = data.firstDepartureA;
  const lastDepartureA = departuresA[departuresA.length - 1] || data.firstDepartureA;
  const lastDepartureB = departuresB[departuresB.length - 1] || data.firstDepartureB;

  const maxEndA = timeToMinutes(lastDepartureA) + data.durationAB + data.pauseStationB;
  const maxEndB = timeToMinutes(lastDepartureB) + data.durationBA + data.pauseStationA;
  const coverageEnd = minutesToTime(Math.max(maxEndA, maxEndB));

  const averageFrequency = data.intervalMinutes;

  return {
    totalBuses,
    totalTrips,
    coverageStart,
    coverageEnd,
    averageFrequency,
    departuresA,
    departuresB,
  };
};

// Mock lines data - Replace with API call
const LINES = [
  { id: 1, name: 'Ligne 1', route: 'Casablanca - Rabat' },
  { id: 2, name: 'Ligne 2', route: 'Rabat - Fès' },
  { id: 3, name: 'Ligne 3', route: 'Casablanca - Marrakech' },
];

const DEFAULT_SCHEDULE = {
  numberOfBuses: 4,
  firstDepartureA: '07:00',
  firstDepartureB: '07:00',
  intervalMinutes: 30,
  durationAB: 60,
  durationBA: 60,
  pauseStationA: 30,
  pauseStationB: 30,
  stations: [
    { name: 'Casa', stopTime: 5 },
    { name: 'Ain Sebaa', stopTime: 5 },
    { name: 'Témara', stopTime: 5 },
    { name: 'Agdal', stopTime: 5 },
    { name: 'Rabat', stopTime: 5 },
  ],
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        {type === 'success' && <CheckCircle size={20} />}
        {type === 'error' && <AlertCircle size={20} />}
        {type === 'loading' && <Loader size={20} className="animate-spin" />}
        <span>{message}</span>
      </div>
    </div>
  );
};

// Main Component
export default function ConfigurationPage() {
  const [selectedLine, setSelectedLine] = useState('1');
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [isSaving, setIsSaving] = useState(false);
  const [direction, setDirection] = useState('AB');
  const [toast, setToast] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);

  const calculatedSchedule = useMemo(() => {
    return calculateSchedule(schedule);
  }, [schedule]);

  const currentLine = LINES.find((l) => l.id.toString() === selectedLine);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    showToast('Enregistrement en cours...', 'loading');

    try {
      // Replace with actual API endpoint
      const configData = {
        lineId: selectedLine,
        ...schedule,
      };

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // const response = await axios.post('/api/trajets/config-horaire', configData);
      
      showToast('Configuration enregistrée avec succès', 'success');
      setIsSaving(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      showToast('Erreur lors de l\'enregistrement. Veuillez réessayer.', 'error');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSchedule(DEFAULT_SCHEDULE);
    showToast('Configuration réinitialisée', 'success');
  };

  const handleSimulate = () => {
    setShowSimulation(!showSimulation);
  };

  const handleStationTimeChange = (idx, newTime) => {
    const newStations = [...schedule.stations];
    newStations[idx].stopTime = parseInt(newTime) || 0;
    setSchedule({ ...schedule, stations: newStations });
  };

  return (
    <main className="config-container">
      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <header className="config-header">
        <div className="config-header-content">
          <div className="config-header-top">
            <button className="config-back-btn">
              <ChevronLeft size={24} />
            </button>
            <div className="config-header-text">
              <h1>Configuration des Horaires</h1>
              <p>{currentLine?.route}</p>
            </div>
          </div>

          {/* Line Selector */}
          <div className="config-line-selector">
            <label>Sélectionner une ligne</label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="config-select"
            >
              {LINES.map((line) => (
                <option key={line.id} value={line.id.toString()}>
                  {line.name} - {line.route}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="config-main">
        {/* General Information Card */}
        <div className="config-card">
          <div className="config-card-header">
            <Bus size={20} className="config-icon" />
            <h2>Informations Générales</h2>
          </div>
          <div className="config-card-content">
            <div className="config-grid-3">
              <div className="config-field">
                <label>Nombre de bus par sens</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={schedule.numberOfBuses}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      numberOfBuses: parseInt(e.target.value) || 1,
                    })
                  }
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Premier départ Station A</label>
                <input
                  type="time"
                  value={schedule.firstDepartureA}
                  onChange={(e) =>
                    setSchedule({ ...schedule, firstDepartureA: e.target.value })
                  }
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Premier départ Station B</label>
                <input
                  type="time"
                  value={schedule.firstDepartureB}
                  onChange={(e) =>
                    setSchedule({ ...schedule, firstDepartureB: e.target.value })
                  }
                  className="config-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Intervals and Durations Card */}
        <div className="config-card">
          <div className="config-card-header">
            <Clock size={20} className="config-icon" />
            <h2>Intervalles et Durées</h2>
          </div>
          <div className="config-card-content">
            <div className="config-grid-2">
              <div className="config-field">
                <label>Intervalle entre bus (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={schedule.intervalMinutes}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      intervalMinutes: parseInt(e.target.value) || 1,
                    })
                  }
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Durée trajet A→B (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={schedule.durationAB}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      durationAB: parseInt(e.target.value) || 1,
                    })
                  }
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Durée trajet B→A (minutes)</label>
                <input
                  type="number"
                  min="1"
                  value={schedule.durationBA}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      durationBA: parseInt(e.target.value) || 1,
                    })
                  }
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Pause Station A (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={schedule.pauseStationA}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      pauseStationA: parseInt(e.target.value) || 0,
                    })
                  }
                  className="config-input"
                />
              </div>
              <div className="config-field">
                <label>Pause Station B (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={schedule.pauseStationB}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      pauseStationB: parseInt(e.target.value) || 0,
                    })
                  }
                  className="config-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stop Times by Station Card */}
        <div className="config-card">
          <div className="config-card-header">
            <MapPin size={20} className="config-icon" />
            <h2>Temps d'arrêt à chaque station</h2>
          </div>
          <div className="config-card-content">
            <div className="config-stations">
              {schedule.stations.map((station, idx) => (
                <div key={idx} className="config-station-row">
                  <div className="config-station-name">
                    <label>Station</label>
                    <input
                      type="text"
                      value={station.name}
                      disabled
                      className="config-input config-input-disabled"
                    />
                  </div>
                  <div className="config-station-time">
                    <label>Temps d'arrêt (min)</label>
                    <input
                      type="number"
                      min="0"
                      value={station.stopTime}
                      onChange={(e) => handleStationTimeChange(idx, e.target.value)}
                      className="config-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Planning Preview Card */}
        <div className="config-card">
          <div className="config-card-header">
            <Clock size={20} className="config-icon" />
            <h2>Aperçu Planning Généré</h2>
          </div>
          <div className="config-card-content">
            {/* Direction Toggle */}
            <div className="config-direction-toggle">
              <button
                className={`config-direction-btn ${direction === 'AB' ? 'active' : ''}`}
                onClick={() => setDirection('AB')}
              >
                Sens A→B
              </button>
              <button
                className={`config-direction-btn ${direction === 'BA' ? 'active' : ''}`}
                onClick={() => setDirection('BA')}
              >
                Sens B→A
              </button>
            </div>

            {/* Timeline Preview */}
            <div className="config-timeline">
              {direction === 'AB'
                ? calculatedSchedule.departuresA.slice(0, 4).map((time, idx) => (
                    <div key={idx} className="config-timeline-item">
                      <div className="config-timeline-time">{time}</div>
                      <div className="config-timeline-line"></div>
                      <div className="config-timeline-bus">
                        <Bus size={20} />
                      </div>
                    </div>
                  ))
                : calculatedSchedule.departuresB.slice(0, 4).map((time, idx) => (
                    <div key={idx} className="config-timeline-item">
                      <div className="config-timeline-time">{time}</div>
                      <div className="config-timeline-line"></div>
                      <div className="config-timeline-bus">
                        <Bus size={20} />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="config-card config-card-summary">
          <div className="config-card-header">
            <Info size={20} className="config-icon" />
            <h2>Récapitulatif</h2>
          </div>
          <div className="config-card-content">
            <div className="config-summary-grid">
              <div className="config-summary-item">
                <p className="config-summary-label">Total de bus</p>
                <p className="config-summary-value">
                  {calculatedSchedule.totalBuses}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Trips générés</p>
                <p className="config-summary-value">
                  {calculatedSchedule.totalTrips}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Couverture horaire</p>
                <p className="config-summary-value config-summary-coverage">
                  {calculatedSchedule.coverageStart} - {calculatedSchedule.coverageEnd}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Fréquence moyenne</p>
                <p className="config-summary-value">
                  {calculatedSchedule.averageFrequency}m
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Simulation */}
        {showSimulation && (
          <div className="config-card config-card-simulation">
            <div className="config-card-header">
              <Play size={20} className="config-icon" />
              <h2>Simulation Détaillée</h2>
            </div>
            <div className="config-card-content">
              <div className="config-simulation-grid">
                <div className="config-simulation-column">
                  <h3>Sens A→B</h3>
                  <div className="config-simulation-list">
                    {calculatedSchedule.departuresA.map((time, idx) => (
                      <div key={idx} className="config-simulation-item">
                        <span className="config-simulation-number">Bus {idx + 1}</span>
                        <span className="config-simulation-time">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="config-simulation-column">
                  <h3>Sens B→A</h3>
                  <div className="config-simulation-list">
                    {calculatedSchedule.departuresB.map((time, idx) => (
                      <div key={idx} className="config-simulation-item">
                        <span className="config-simulation-number">Bus {idx + 1}</span>
                        <span className="config-simulation-time">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="config-actions">
          <button
            className="config-btn config-btn-secondary"
            onClick={handleCancel}
          >
            <X size={18} />
            Annuler
          </button>
          <button
            className="config-btn config-btn-simulate"
            onClick={handleSimulate}
          >
            <Play size={18} />
            {showSimulation ? 'Masquer' : 'Simuler'}
          </button>
          <button
            className="config-btn config-btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={18} />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </main>
  );
}
