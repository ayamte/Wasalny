import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronLeft,
  Trash2,
  Filter,
  X,
  AlertCircle,
  CheckCircle,
  Loader,
  Clock,
  MapPin,
  Bus,
} from 'lucide-react';
import { tripService, ligneService } from '../../../trajetService';
import './GestionTrips.css';

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

export default function GestionTrips() {
  const [trips, setTrips] = useState([]);
  const [lines, setLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtres
  const [filters, setFilters] = useState({
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: '',
    ligneId: '',
    statut: '',
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Charger les lignes
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const fetchedLines = await ligneService.getAllLines();
        setLines(fetchedLines || []);
      } catch (error) {
        console.error('Erreur lors du chargement des lignes:', error);
      }
    };
    fetchLines();
  }, []);

  // Charger les trips
  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.dateDebut) params.dateDebut = filters.dateDebut;
      if (filters.dateFin) params.dateFin = filters.dateFin;
      if (filters.ligneId) params.ligneId = filters.ligneId;
      if (filters.statut) params.statut = filters.statut;

      const data = await tripService.obtenirTripsAvecFiltres(params);
      setTrips(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des trips:', error);
      showToast('Erreur lors du chargement des trips', 'error');
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleDeleteTrip = async (tripId, trip) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer le trip ${trip.numeroTrip} ?`
      )
    ) {
      return;
    }

    try {
      await tripService.supprimerTrip(tripId);
      showToast('Trip supprimé avec succès', 'success');
      loadTrips();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const message =
        error.response?.data?.message || 'Erreur lors de la suppression du trip';
      showToast(message, 'error');
    }
  };

  const getStatutBadgeClass = (statut) => {
    switch (statut) {
      case 'PLANIFIE':
        return 'badge-planifie';
      case 'EN_COURS':
        return 'badge-en-cours';
      case 'TERMINE':
        return 'badge-termine';
      case 'ANNULE':
        return 'badge-annule';
      default:
        return '';
    }
  };

  const getStatutLabel = (statut) => {
    switch (statut) {
      case 'PLANIFIE':
        return 'Planifié';
      case 'EN_COURS':
        return 'En cours';
      case 'TERMINE':
        return 'Terminé';
      case 'ANNULE':
        return 'Annulé';
      default:
        return statut;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return timeStr.substring(0, 5);
  };

  return (
    <div className="gestion-trips-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <header className="trips-header">
        <div className="trips-header-content">
          <div className="trips-header-top">
            <button
              className="trips-back-btn"
              onClick={() => window.history.back()}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="trips-header-text">
              <h1>Gestion des Trips</h1>
              <p>Visualiser et gérer tous les trajets générés</p>
            </div>
            <button
              className="trips-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filtres
            </button>
          </div>
        </div>
      </header>

      {/* Filtres */}
      {showFilters && (
        <div className="trips-filters">
          <div className="filters-grid">
            <div className="filter-item">
              <label>Date début</label>
              <input
                type="date"
                value={filters.dateDebut}
                onChange={(e) =>
                  setFilters({ ...filters, dateDebut: e.target.value })
                }
              />
            </div>
            <div className="filter-item">
              <label>Date fin</label>
              <input
                type="date"
                value={filters.dateFin}
                onChange={(e) =>
                  setFilters({ ...filters, dateFin: e.target.value })
                }
                min={filters.dateDebut}
              />
            </div>
            <div className="filter-item">
              <label>Ligne</label>
              <select
                value={filters.ligneId}
                onChange={(e) =>
                  setFilters({ ...filters, ligneId: e.target.value })
                }
              >
                <option value="">Toutes les lignes</option>
                {lines.map((line) => (
                  <option key={line.id} value={line.id}>
                    {line.nom || line.numero}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-item">
              <label>Statut</label>
              <select
                value={filters.statut}
                onChange={(e) =>
                  setFilters({ ...filters, statut: e.target.value })
                }
              >
                <option value="">Tous les statuts</option>
                <option value="PLANIFIE">Planifié</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
                <option value="ANNULE">Annulé</option>
              </select>
            </div>
          </div>
          <div className="filters-actions">
            <button
              className="btn-secondary"
              onClick={() => {
                setFilters({
                  dateDebut: new Date().toISOString().split('T')[0],
                  dateFin: '',
                  ligneId: '',
                  statut: '',
                });
              }}
            >
              <X size={16} />
              Réinitialiser
            </button>
          </div>
        </div>
      )}

      {/* Liste des trips */}
      <main className="trips-main">
        {isLoading ? (
          <div className="trips-loading">
            <Loader size={40} className="animate-spin" />
            <p>Chargement des trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div className="trips-empty">
            <Calendar size={48} />
            <h3>Aucun trip trouvé</h3>
            <p>Essayez de modifier les filtres ou de générer de nouveaux trips</p>
          </div>
        ) : (
          <div className="trips-list">
            <div className="trips-count">
              <p>
                <strong>{trips.length}</strong> trip(s) trouvé(s)
              </p>
            </div>
            <div className="trips-table-container">
              <table className="trips-table">
                <thead>
                  <tr>
                    <th>N° Trip</th>
                    <th>Date</th>
                    <th>Ligne</th>
                    <th>Bus</th>
                    <th>Départ</th>
                    <th>Direction</th>
                    <th>Statut</th>
                    <th>Places</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>
                        <span className="trip-numero">{trip.numeroTrip}</span>
                      </td>
                      <td>{formatDate(trip.dateTrip)}</td>
                      <td>
                        <div className="trip-ligne">
                          <MapPin size={14} />
                          {trip.ligne?.nom || trip.ligne?.numero}
                        </div>
                      </td>
                      <td>
                        <div className="trip-bus">
                          <Bus size={14} />
                          {trip.bus?.immatriculation || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="trip-time">
                          <Clock size={14} />
                          {formatTime(trip.heureDepart)}
                        </div>
                      </td>
                      <td>
                        <span className={`trip-direction ${trip.estAller ? 'aller' : 'retour'}`}>
                          {trip.estAller ? 'Aller' : 'Retour'}
                        </span>
                      </td>
                      <td>
                        <span className={`trip-badge ${getStatutBadgeClass(trip.statut)}`}>
                          {getStatutLabel(trip.statut)}
                        </span>
                      </td>
                      <td>
                        <span className="trip-places">
                          {trip.nbrPlacesDisponibles || 0} / {trip.nbrPlaces || 0}
                        </span>
                      </td>
                      <td>
                        <div className="trip-actions">
                          <button
                            className="trip-action-btn trip-action-delete"
                            onClick={() => handleDeleteTrip(trip.id, trip)}
                            disabled={
                              trip.statut === 'EN_COURS' ||
                              trip.statut === 'TERMINE'
                            }
                            title={
                              trip.statut === 'EN_COURS' ||
                              trip.statut === 'TERMINE'
                                ? 'Impossible de supprimer un trip en cours ou terminé'
                                : 'Supprimer'
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
