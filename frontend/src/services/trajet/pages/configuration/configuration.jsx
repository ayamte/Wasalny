import React, { useState, useCallback, useEffect } from 'react';
import { ligneService, stationService, configurationHoraireService, tripService, busService } from '../../../trajetService';
import {
  Bus,
  Clock,
  MapPin,
  Save,
  X,
  ChevronLeft,
  Info,
  AlertCircle,
  CheckCircle,
  Loader,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  List,
} from 'lucide-react';
import './configuration.css';

// Lines will be fetched dynamically

const DEFAULT_SCHEDULE = {
  numberOfBuses: 4,
  numberOfBusesDepart: 2,      // ✅ NOUVEAU: Bus au départ (Station A)
  numberOfBusesDestination: 2, // ✅ NOUVEAU: Bus à la destination (Station B)
  firstDepartureA: '07:00',
  firstDepartureB: '07:00',
  intervalMinutes: 30,
  durationAB: 60,
  durationBA: 60,
  pauseStationA: 30,
  pauseStationB: 30,
  stations: [], // Will be populated dynamically
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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [selectedLine, setSelectedLine] = useState('');
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [lines, setLines] = useState([]);
  const [isLoadingLines, setIsLoadingLines] = useState(true);
  const [isLoadingStations, setIsLoadingStations] = useState(false);
  const [configurations, setConfigurations] = useState([]);
  const [isLoadingConfigurations, setIsLoadingConfigurations] = useState(true);
  const [editingConfigId, setEditingConfigId] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedConfigForGeneration, setSelectedConfigForGeneration] = useState(null);
  const [generateStartDate, setGenerateStartDate] = useState('');
  const [generateEndDate, setGenerateEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTripsModal, setShowTripsModal] = useState(false);
  const [selectedConfigTrips, setSelectedConfigTrips] = useState(null);
  const [configTrips, setConfigTrips] = useState([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);
  const [showEditTripModal, setShowEditTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [buses, setBuses] = useState([]);

  const currentLine = lines.find((l) => l.id?.toString() === selectedLine);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  // Fetch lines on component mount
  useEffect(() => {
    const fetchLines = async () => {
      setIsLoadingLines(true);
      try {
        const fetchedLines = await ligneService.getAllLines();
        if (fetchedLines && fetchedLines.length > 0) {
          // Map backend data to expected format
          const mappedLines = fetchedLines.map(line => ({
            id: line.id,
            name: line.nom || line.numero || `Ligne ${line.id}`,
            route: line.stations && line.stations.length > 0
              ? `${line.stations[0]?.nom || 'Station A'} - ${line.stations[line.stations.length - 1]?.nom || 'Station B'}`
              : 'Ligne sans stations'
          }));
          setLines(mappedLines);
          if (mappedLines.length > 0 && !selectedLine) {
            setSelectedLine(mappedLines[0].id.toString());
          }
        } else {
          setLines([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des lignes:', error);
        showToast('Erreur lors du chargement des lignes', 'error');
        setLines([]);
      } finally {
        setIsLoadingLines(false);
      }
    };

    fetchLines();
  }, [showToast, selectedLine]);

  // Fetch buses on component mount
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const fetchedBuses = await busService.getAllBuses();
        setBuses(fetchedBuses || []);
      } catch (error) {
        console.error('Erreur lors du chargement des bus:', error);
        setBuses([]);
      }
    };
    fetchBuses();
  }, []);

  // Fetch configurations on component mount
  useEffect(() => {
    const fetchConfigurations = async () => {
      setIsLoadingConfigurations(true);
      try {
        const configs = await configurationHoraireService.obtenirToutesConfigurations();

        // Handle empty response or null data
        if (!configs) {
          setConfigurations([]);
          setIsLoadingConfigurations(false);
          return;
        }

        // Ensure configs is an array
        const dataArray = Array.isArray(configs) ? configs : [];

        // Map backend data to expected format
        const mappedConfigs = dataArray.map(config => ({
          id: config.id,
          lineId: config.ligne?.id,
          lineName: config.ligne?.nom || config.ligne?.numero || `Ligne ${config.ligne?.id}`,
          route: `${config.ligne?.nom || 'Ligne'}`,
          numberOfBuses: config.nombreBus,
          numberOfBusesDepart: config.nombreBusDepart || 0,           // ✅ NOUVEAU
          numberOfBusesDestination: config.nombreBusDestination || 0, // ✅ NOUVEAU
          firstDepartureA: config.heureDebut,
          firstDepartureB: config.heureFin,
          intervalMinutes: config.frequenceMinutes,
          durationAB: config.dureeAllerMinutes,
          durationBA: config.dureeRetourMinutes,
          pauseStationA: config.tempsPauseMinutes,
          pauseStationB: config.tempsArretMinutes,
          coverageStart: config.heureDebut,
          coverageEnd: config.heureFin,
          createdAt: new Date().toISOString(),
          stations: [],
        }));

        setConfigurations(mappedConfigs);
      } catch (error) {
        console.error('Erreur lors du chargement des configurations:', error);

        let errorMessage = 'Erreur lors du chargement des configurations';

        if (error.response) {
          if (error.response.status === 404) {
            console.warn('Endpoint non trouvé. Initialisation avec une liste vide.');
            setConfigurations([]);
            return; // Ne pas afficher de toast pour 404
          } else if (error.response.status === 401) {
            errorMessage = 'Session expirée. Veuillez vous reconnecter.';
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          } else if (error.response.status === 403) {
            errorMessage = 'Accès refusé. Permissions insuffisantes.';
          }
        } else if (error.request) {
          errorMessage = 'Impossible de contacter le serveur';
        }

        showToast(errorMessage, 'error');
        setConfigurations([]);
      } finally {
        setIsLoadingConfigurations(false);
      }
    };

    fetchConfigurations();
  }, [showToast]);

  // Fetch stations when line is selected
  useEffect(() => {
    const fetchStations = async () => {
      if (!selectedLine || viewMode !== 'form') return;

      setIsLoadingStations(true);
      try {
        const fetchedStations = await stationService.getStationsByLine(selectedLine);
        if (fetchedStations && fetchedStations.length > 0) {
          const mappedStations = fetchedStations.map(station => ({
            id: station.id,
            name: station.nom || station.name || 'Station',
            stopTime: 5 // Default stop time
          }));
          setSchedule(prev => ({
            ...prev,
            stations: mappedStations
          }));
        } else {
          setSchedule(prev => ({
            ...prev,
            stations: []
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stations:', error);
        showToast('Erreur lors du chargement des stations', 'error');
        setSchedule(prev => ({
          ...prev,
          stations: []
        }));
      } finally {
        setIsLoadingStations(false);
      }
    };

    fetchStations();
  }, [selectedLine, viewMode, showToast]);

  const handleSave = async () => {
    // Validation des données avant l'envoi
    if (!selectedLine) {
      showToast('Veuillez sélectionner une ligne', 'error');
      return;
    }

    if (!schedule.firstDepartureA || !schedule.firstDepartureB) {
      showToast('Les heures de départ sont obligatoires', 'error');
      return;
    }

    if (schedule.numberOfBuses < 1) {
      showToast('Le nombre de bus doit être au moins 1', 'error');
      return;
    }

    if (schedule.intervalMinutes < 1) {
      showToast('L\'intervalle doit être au moins 1 minute', 'error');
      return;
    }

    setIsSaving(true);
    showToast('Enregistrement en cours...', 'loading');

    try {
      const configData = {
        ligneId: selectedLine, // Le backend attend un UUID au format string
        heureDebut: schedule.firstDepartureA,
        heureFin: schedule.firstDepartureB,
        frequenceMinutes: parseInt(schedule.intervalMinutes) || 0,
        nombreBus: parseInt(schedule.numberOfBuses) || 0,
        nombreBusDepart: parseInt(schedule.numberOfBusesDepart) || 0,           // ✅ NOUVEAU
        nombreBusDestination: parseInt(schedule.numberOfBusesDestination) || 0, // ✅ NOUVEAU
        dureeAllerMinutes: parseInt(schedule.durationAB) || 0,
        dureeRetourMinutes: parseInt(schedule.durationBA) || 0,
        tempsPauseMinutes: parseInt(schedule.pauseStationA) || 0,
        tempsArretMinutes: parseInt(schedule.pauseStationB) || 0,
      };

      if (editingConfigId) {
        // Update existing configuration
        await configurationHoraireService.mettreAJourConfiguration(editingConfigId, configData);
        showToast('Configuration modifiée avec succès', 'success');
      } else {
        // Create new configuration
        await configurationHoraireService.creerConfiguration(configData);
        showToast('Configuration créée avec succès', 'success');
      }

      // Refresh configurations list and go back to list view
      const configs = await configurationHoraireService.obtenirToutesConfigurations();
      const mappedConfigs = (configs || []).map(config => ({
        id: config.id,
        lineId: config.ligne?.id,
        lineName: config.ligne?.nom || config.ligne?.numero || `Ligne ${config.ligne?.id}`,
        route: `${config.ligne?.nom || 'Ligne'}`,
        numberOfBuses: config.nombreBus,
        numberOfBusesDepart: config.nombreBusDepart || 0,           // ✅ NOUVEAU
        numberOfBusesDestination: config.nombreBusDestination || 0, // ✅ NOUVEAU
        firstDepartureA: config.heureDebut,
        firstDepartureB: config.heureFin,
        intervalMinutes: config.frequenceMinutes,
        durationAB: config.dureeAllerMinutes,
        durationBA: config.dureeRetourMinutes,
        pauseStationA: config.tempsPauseMinutes,
        pauseStationB: config.tempsArretMinutes,
        coverageStart: config.heureDebut,
        coverageEnd: config.heureFin,
        createdAt: new Date().toISOString(),
        stations: [],
      }));
      setConfigurations(mappedConfigs);

      // Return to list view
      setTimeout(() => {
        setViewMode('list');
        setEditingConfigId(null);
        setSelectedLine('');
        setSchedule(DEFAULT_SCHEDULE);
      }, 1500);

      setIsSaving(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);

      let errorMessage = 'Erreur lors de l\'enregistrement';

      if (error.response) {
        // Le serveur a répondu avec un code d'erreur
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (error.response.status === 403) {
          errorMessage = 'Accès refusé. Vous devez être administrateur.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Données invalides';
        } else if (error.response.status === 404) {
          errorMessage = 'Ressource non trouvée';
        } else {
          errorMessage = error.response.data?.message || 'Erreur serveur';
        }
      } else if (error.request) {
        // La requête a été envoyée mais pas de réponse
        errorMessage = 'Impossible de contacter le serveur';
      }

      showToast(errorMessage, 'error');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSchedule({
      ...DEFAULT_SCHEDULE,
      stations: selectedLine ? schedule.stations : [] // Keep stations if line is selected
    });
    showToast('Configuration réinitialisée', 'success');
  };

  const handleStationTimeChange = (idx, newTime) => {
    const newStations = [...schedule.stations];
    newStations[idx].stopTime = parseInt(newTime) || 0;
    setSchedule({ ...schedule, stations: newStations });
  };

  const handleNewConfiguration = () => {
    setEditingConfigId(null);
    setSelectedLine('');
    setSchedule(DEFAULT_SCHEDULE);
    setViewMode('form');
  };

  const handleEditConfiguration = (config) => {
    setEditingConfigId(config.id);
    setSelectedLine(config.lineId ? config.lineId.toString() : '');
    setSchedule({
      numberOfBuses: config.numberOfBuses || 1,
      numberOfBusesDepart: config.numberOfBusesDepart || 0,           // ✅ NOUVEAU
      numberOfBusesDestination: config.numberOfBusesDestination || 0, // ✅ NOUVEAU
      firstDepartureA: config.firstDepartureA || '07:00',
      firstDepartureB: config.firstDepartureB || '07:00',
      intervalMinutes: config.intervalMinutes || 30,
      durationAB: config.durationAB || 60,
      durationBA: config.durationBA || 60,
      pauseStationA: config.pauseStationA || 30,
      pauseStationB: config.pauseStationB || 30,
      stations: config.stations || [],
    });
    setViewMode('form');
  };

  const handleViewConfiguration = (config) => {
    setEditingConfigId(config.id);
    setSelectedLine(config.lineId ? config.lineId.toString() : '');
    setSchedule({
      numberOfBuses: config.numberOfBuses || 1,
      numberOfBusesDepart: config.numberOfBusesDepart || 0,           // ✅ NOUVEAU
      numberOfBusesDestination: config.numberOfBusesDestination || 0, // ✅ NOUVEAU
      firstDepartureA: config.firstDepartureA || '07:00',
      firstDepartureB: config.firstDepartureB || '07:00',
      intervalMinutes: config.intervalMinutes || 30,
      durationAB: config.durationAB || 60,
      durationBA: config.durationBA || 60,
      pauseStationA: config.pauseStationA || 30,
      pauseStationB: config.pauseStationB || 30,
      stations: config.stations || [],
    });
    setViewMode('form');
  };

  const handleDeleteConfiguration = async (configId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
      return;
    }

    try {
      await configurationHoraireService.supprimerConfiguration(configId);
      setConfigurations(configurations.filter(c => c.id !== configId));
      showToast('Configuration supprimée avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);

      let errorMessage = 'Erreur lors de la suppression';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else if (error.response.status === 403) {
          errorMessage = 'Accès refusé. Permissions insuffisantes.';
        } else if (error.response.status === 404) {
          errorMessage = 'Configuration non trouvée';
        } else {
          errorMessage = error.response.data?.message || 'Erreur serveur';
        }
      } else if (error.request) {
        errorMessage = 'Impossible de contacter le serveur';
      }

      showToast(errorMessage, 'error');
    }
  };

  const handleOpenGenerateModal = (config) => {
    setSelectedConfigForGeneration(config);
    // Dates par défaut : aujourd'hui et dans 7 jours
    const today = new Date();
    const in7Days = new Date();
    in7Days.setDate(today.getDate() + 7);
    setGenerateStartDate(today.toISOString().split('T')[0]);
    setGenerateEndDate(in7Days.toISOString().split('T')[0]);
    setShowGenerateModal(true);
  };

  const handleCloseGenerateModal = () => {
    setShowGenerateModal(false);
    setSelectedConfigForGeneration(null);
    setGenerateStartDate('');
    setGenerateEndDate('');
  };

  const handleGenerateTrips = async () => {
    if (!selectedConfigForGeneration || !generateStartDate || !generateEndDate) {
      showToast('Veuillez sélectionner une période valide', 'error');
      return;
    }

    const startDate = new Date(generateStartDate);
    const endDate = new Date(generateEndDate);

    if (startDate > endDate) {
      showToast('La date de début doit être antérieure à la date de fin', 'error');
      return;
    }

    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (daysDiff > 90) {
      showToast('La période ne peut pas dépasser 90 jours', 'error');
      return;
    }

    setIsGenerating(true);
    showToast('Génération des trips en cours...', 'loading');

    try {
      console.log('=== GÉNÉRATION DES TRIPS ===');
      console.log('Config ID:', selectedConfigForGeneration.id);
      console.log('Line ID:', selectedConfigForGeneration.lineId);
      console.log('Date début:', generateStartDate);
      console.log('Date fin:', generateEndDate);

      const result = await configurationHoraireService.genererTripsPeriode(
        selectedConfigForGeneration.id,
        generateStartDate,
        generateEndDate
      );

      console.log('Résultat génération:', result);
      showToast(`Trips générés avec succès pour ${daysDiff + 1} jour(s)`, 'success');

      // Attendre un peu pour que le backend termine la génération
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier que les trips ont bien été créés
      console.log('Vérification des trips créés pour la ligne:', selectedConfigForGeneration.lineId);
      try {
        const trips = await tripService.obtenirTripsAvecFiltres({
          ligneId: selectedConfigForGeneration.lineId,
        });
        console.log('Trips trouvés après génération:', trips?.length || 0);
        if (trips && trips.length > 0) {
          console.log('Premier trip:', trips[0]);
        }
      } catch (verifyError) {
        console.error('Erreur lors de la vérification des trips:', verifyError);
      }

      handleCloseGenerateModal();
    } catch (error) {
      console.error('Erreur lors de la génération des trips:', error);
      console.error('Détails complètes de l\'erreur:', error.response?.data);

      let errorMessage = 'Erreur lors de la génération des trips';

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (error.response.status === 403) {
          errorMessage = 'Accès refusé. Permissions insuffisantes.';
        } else if (error.response.status === 404) {
          errorMessage = 'Configuration non trouvée';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Données invalides';
        } else {
          errorMessage = error.response.data?.message || 'Erreur serveur';
        }
      } else if (error.request) {
        errorMessage = 'Impossible de contacter le serveur';
      }

      showToast(errorMessage, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenTripsModal = async (config) => {
    console.log('Configuration sélectionnée:', config);

    if (!config.lineId) {
      console.error('Aucun lineId trouvé dans la configuration');
      showToast('Erreur: ligne non trouvée pour cette configuration', 'error');
      return;
    }

    setSelectedConfigTrips(config);
    setShowTripsModal(true);
    setIsLoadingTrips(true);

    try {
      // Récupérer tous les trips de cette ligne (toutes configurations confondues)
      console.log('Chargement des trips pour la ligne:', config.lineId);
      const trips = await tripService.obtenirTripsAvecFiltres({
        ligneId: config.lineId,
      });
      console.log('Nombre de trips chargés:', trips?.length || 0);
      console.log('Trips chargés:', trips);
      setConfigTrips(trips || []);

      if (!trips || trips.length === 0) {
        console.warn('Aucun trip trouvé pour la ligne:', config.lineId);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des trips:', error);
      console.error('Détails de l\'erreur:', error.response?.data || error.message);
      showToast('Erreur lors du chargement des trips', 'error');
      setConfigTrips([]);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  const handleCloseTripsModal = () => {
    setShowTripsModal(false);
    setSelectedConfigTrips(null);
    setConfigTrips([]);
  };

  const handleOpenEditTripModal = (trip) => {
    setEditingTrip({
      id: trip.id,
      dateTrip: trip.dateTrip,
      heureDepart: trip.heureDepart,
      busId: trip.bus?.id || '',
      statut: trip.statut,
      estAller: trip.estAller,
    });
    setShowEditTripModal(true);
  };

  const handleCloseEditTripModal = () => {
    setShowEditTripModal(false);
    setEditingTrip(null);
  };

  const handleSaveEditTrip = async () => {
    if (!editingTrip) return;

    try {
      const updateData = {};
      if (editingTrip.dateTrip) updateData.dateTrip = editingTrip.dateTrip;
      if (editingTrip.heureDepart) updateData.heureDepart = editingTrip.heureDepart;
      if (editingTrip.busId) updateData.busId = editingTrip.busId;
      if (editingTrip.statut) updateData.statut = editingTrip.statut;
      if (editingTrip.estAller !== undefined) updateData.estAller = editingTrip.estAller;

      await tripService.modifierTrip(editingTrip.id, updateData);
      showToast('Trip modifié avec succès', 'success');

      // Recharger les trips
      const trips = await tripService.obtenirTripsAvecFiltres({
        ligneId: selectedConfigTrips.lineId,
      });
      setConfigTrips(trips || []);
      handleCloseEditTripModal();
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      const message = error.response?.data?.message || 'Erreur lors de la modification du trip';
      showToast(message, 'error');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce trip ?')) {
      return;
    }

    try {
      await tripService.supprimerTrip(tripId);
      showToast('Trip supprimé avec succès', 'success');
      // Recharger les trips
      const trips = await tripService.obtenirTripsAvecFiltres({
        ligneId: selectedConfigTrips.lineId,
      });
      setConfigTrips(trips || []);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const message = error.response?.data?.message || 'Erreur lors de la suppression du trip';
      showToast(message, 'error');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
    setEditingConfigId(null);
    setSelectedLine('');
    setSchedule(DEFAULT_SCHEDULE);
  };

  // Render list view
  if (viewMode === 'list') {
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
                <h1>Configurations des Horaires</h1>
                <p>Gérer les configurations horaires des lignes</p>
              </div>
              <button
                className="config-btn config-btn-primary"
                onClick={handleNewConfiguration}
              >
                <Plus size={18} />
                Nouvelle Configuration
              </button>
            </div>
          </div>
        </header>

        {/* Configurations List */}
        <div className="config-main">
          {isLoadingConfigurations ? (
            <div className="config-card" style={{ textAlign: 'center', padding: '40px' }}>
              <Loader size={40} className="animate-spin" style={{ margin: '0 auto 20px' }} />
              <p>Chargement des configurations...</p>
            </div>
          ) : configurations.length === 0 ? (
            <div className="config-card" style={{ textAlign: 'center', padding: '40px' }}>
              <Info size={40} style={{ margin: '0 auto 20px', color: '#666' }} />
              <h3>Aucune configuration trouvée</h3>
              <p style={{ color: '#666', marginTop: '10px' }}>
                Créez votre première configuration horaire en cliquant sur le bouton ci-dessus.
              </p>
            </div>
          ) : (
            <div className="config-card">
              <div className="config-card-header">
                <Clock size={20} className="config-icon" />
                <h2>Configurations Existantes</h2>
              </div>
              <div className="config-card-content">
                <div className="config-table-container">
                  <table className="config-table">
                    <thead>
                      <tr>
                        <th>Ligne</th>
                        <th>Route</th>
                        <th>Nombre de Bus</th>
                        <th>Premier Départ A</th>
                        <th>Intervalle</th>
                        <th>Couverture</th>
                        <th>Date de Création</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {configurations.map((config) => (
                        <tr key={config.id}>
                          <td>{config.lineName}</td>
                          <td>{config.route}</td>
                          <td>{config.numberOfBuses}</td>
                          <td>{config.firstDepartureA}</td>
                          <td>{config.intervalMinutes} min</td>
                          <td>{config.coverageStart} - {config.coverageEnd}</td>
                          <td>{new Date(config.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td>
                            <div className="config-table-actions">
                              <button
                                className="config-action-btn config-action-generate"
                                onClick={() => handleOpenGenerateModal(config)}
                                title="Générer trips"
                              >
                                <Calendar size={16} />
                              </button>
                              <button
                                className="config-action-btn config-action-trips"
                                onClick={() => handleOpenTripsModal(config)}
                                title="Voir les trips"
                              >
                                <List size={16} />
                              </button>
                              <button
                                className="config-action-btn config-action-view"
                                onClick={() => handleViewConfiguration(config)}
                                title="Voir"
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                className="config-action-btn config-action-edit"
                                onClick={() => handleEditConfiguration(config)}
                                title="Modifier"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="config-action-btn config-action-delete"
                                onClick={() => handleDeleteConfiguration(config.id)}
                                title="Supprimer"
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
            </div>
          )}

          {/* Modal de génération de trips */}
          {showGenerateModal && (
            <div className="modal-overlay" onClick={handleCloseGenerateModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Générer les trips</h2>
                  <button className="modal-close" onClick={handleCloseGenerateModal}>
                    <X size={24} />
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-description">
                    Générez automatiquement les trips pour la configuration{' '}
                    <strong>{selectedConfigForGeneration?.lineName}</strong>
                  </p>
                  <div className="form-group">
                    <label htmlFor="startDate">Date de début</label>
                    <input
                      type="date"
                      id="startDate"
                      value={generateStartDate}
                      onChange={(e) => setGenerateStartDate(e.target.value)}
                      className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">Date de fin</label>
                    <input
                      type="date"
                      id="endDate"
                      value={generateEndDate}
                      onChange={(e) => setGenerateEndDate(e.target.value)}
                      className="form-input"
                      min={generateStartDate}
                    />
                  </div>
                  <div className="modal-info">
                    <Info size={16} />
                    <span>
                      {generateStartDate && generateEndDate
                        ? `${Math.ceil((new Date(generateEndDate) - new Date(generateStartDate)) / (1000 * 60 * 60 * 24)) + 1} jour(s) seront générés (maximum 90 jours)`
                        : 'Sélectionnez les dates pour voir le nombre de jours'}
                    </span>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn-secondary"
                    onClick={handleCloseGenerateModal}
                    disabled={isGenerating}
                  >
                    Annuler
                  </button>
                  <button
                    className="btn-primary"
                    onClick={handleGenerateTrips}
                    disabled={isGenerating || !generateStartDate || !generateEndDate}
                  >
                    {isGenerating ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Génération en cours...</span>
                      </>
                    ) : (
                      <>
                        <Calendar size={16} />
                        <span>Générer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trips Modal */}
          {showTripsModal && (
            <div className="modal-overlay" onClick={handleCloseTripsModal}>
              <div className="modal-content modal-content-wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>
                    Trips générés - {selectedConfigTrips?.lineName || 'Configuration'}
                  </h2>
                  <button
                    className="modal-close-btn"
                    onClick={handleCloseTripsModal}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  {isLoadingTrips ? (
                    <div className="modal-loading">
                      <Loader size={40} className="animate-spin" />
                      <p>Chargement des trips...</p>
                    </div>
                  ) : configTrips.length === 0 ? (
                    <div className="modal-empty">
                      <Calendar size={48} />
                      <h3>Aucun trip généré</h3>
                      <p>Veuillez générer des trips pour cette configuration</p>
                    </div>
                  ) : (
                    <div className="trips-list">
                      <div className="trips-count">
                        <p>
                          <strong>{configTrips.length}</strong> trip(s) trouvé(s)
                        </p>
                      </div>
                      <div className="trips-table-container">
                        <table className="trips-table">
                          <thead>
                            <tr>
                              <th>N° Trip</th>
                              <th>Date</th>
                              <th>Bus</th>
                              <th>Départ</th>
                              <th>Direction</th>
                              <th>Statut</th>
                              <th>Places</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {configTrips.map((trip) => (
                              <tr key={trip.id}>
                                <td>
                                  <span className="trip-numero">{trip.numeroTrip}</span>
                                </td>
                                <td>
                                  {new Date(trip.dateTrip).toLocaleDateString('fr-FR', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'short',
                                  })}
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
                                    {trip.heureDepart ? trip.heureDepart.substring(0, 5) : '--:--'}
                                  </div>
                                </td>
                                <td>
                                  <span className={`trip-direction ${trip.estAller ? 'aller' : 'retour'}`}>
                                    {trip.estAller ? 'Aller' : 'Retour'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`trip-badge ${
                                    trip.statut === 'PLANIFIE' ? 'badge-planifie' :
                                    trip.statut === 'EN_COURS' ? 'badge-en-cours' :
                                    trip.statut === 'TERMINE' ? 'badge-termine' :
                                    trip.statut === 'ANNULE' ? 'badge-annule' : ''
                                  }`}>
                                    {trip.statut === 'PLANIFIE' ? 'Planifié' :
                                     trip.statut === 'EN_COURS' ? 'En cours' :
                                     trip.statut === 'TERMINE' ? 'Terminé' :
                                     trip.statut === 'ANNULE' ? 'Annulé' : trip.statut}
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
                                      className="trip-action-btn trip-action-edit"
                                      onClick={() => handleOpenEditTripModal(trip)}
                                      disabled={trip.statut === 'TERMINE'}
                                      title={
                                        trip.statut === 'TERMINE'
                                          ? 'Impossible de modifier un trip terminé'
                                          : 'Modifier'
                                      }
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      className="trip-action-btn trip-action-delete"
                                      onClick={() => handleDeleteTrip(trip.id)}
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
                </div>
              </div>
            </div>
          )}

          {/* Edit Trip Modal */}
          {showEditTripModal && editingTrip && (
            <div className="modal-overlay" onClick={handleCloseEditTripModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>Modifier le Trip</h2>
                  <button
                    className="modal-close-btn"
                    onClick={handleCloseEditTripModal}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="edit-trip-form">
                    <div className="form-group">
                      <label>Date du trip</label>
                      <input
                        type="date"
                        value={editingTrip.dateTrip}
                        onChange={(e) =>
                          setEditingTrip({ ...editingTrip, dateTrip: e.target.value })
                        }
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Heure de départ</label>
                      <input
                        type="time"
                        value={editingTrip.heureDepart}
                        onChange={(e) =>
                          setEditingTrip({ ...editingTrip, heureDepart: e.target.value })
                        }
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Bus</label>
                      <select
                        value={editingTrip.busId}
                        onChange={(e) =>
                          setEditingTrip({ ...editingTrip, busId: e.target.value })
                        }
                        className="form-input"
                      >
                        <option value="">Sélectionner un bus</option>
                        {buses.map((bus) => (
                          <option key={bus.id} value={bus.id}>
                            {bus.immatriculation} - {bus.capacite} places
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Direction</label>
                      <select
                        value={editingTrip.estAller ? 'true' : 'false'}
                        onChange={(e) =>
                          setEditingTrip({ ...editingTrip, estAller: e.target.value === 'true' })
                        }
                        className="form-input"
                      >
                        <option value="true">Aller</option>
                        <option value="false">Retour</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Statut</label>
                      <select
                        value={editingTrip.statut}
                        onChange={(e) =>
                          setEditingTrip({ ...editingTrip, statut: e.target.value })
                        }
                        className="form-input"
                      >
                        <option value="PLANIFIE">Planifié</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TERMINE">Terminé</option>
                        <option value="ANNULE">Annulé</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="btn-secondary"
                      onClick={handleCloseEditTripModal}
                    >
                      <X size={16} />
                      Annuler
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleSaveEditTrip}
                    >
                      <Save size={16} />
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Render form view
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
            <button className="config-back-btn" onClick={handleBackToList}>
              <ChevronLeft size={24} />
            </button>
            <div className="config-header-text">
              <h1>{editingConfigId ? 'Modifier' : 'Nouvelle'} Configuration des Horaires</h1>
              <p>{currentLine?.route || 'Sélectionnez une ligne'}</p>
            </div>
          </div>

          {/* Line Selector */}
          <div className="config-line-selector">
            <label>Sélectionner une ligne</label>
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="config-select"
              disabled={isLoadingLines}
            >
              {isLoadingLines ? (
                <option>Chargement des lignes...</option>
              ) : lines.length === 0 ? (
                <option value="">Aucune ligne disponible</option>
              ) : (
                <>
                  <option value="">Sélectionner une ligne</option>
                  {lines.map((line) => (
                    <option key={line.id} value={line.id.toString()}>
                      {line.name} - {line.route}
                    </option>
                  ))}
                </>
              )}
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
                <label>Nombre de bus par sens (Total)</label>
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
                <label>Heure début de journée</label>
                <input
                  type="time"
                  value={schedule.firstDepartureA}
                  onChange={(e) =>
                    setSchedule({ ...schedule, firstDepartureA: e.target.value })
                  }
                  className="config-input"
                  placeholder="Ex: 08:00"
                />
              </div>
              <div className="config-field">
                <label>Heure fin de journée</label>
                <input
                  type="time"
                  value={schedule.firstDepartureB}
                  onChange={(e) =>
                    setSchedule({ ...schedule, firstDepartureB: e.target.value })
                  }
                  className="config-input"
                  placeholder="Ex: 22:00"
                />
              </div>
            </div>

            <div className="config-grid-2" style={{ marginTop: '20px' }}>
              <div className="config-field">
                <label>Nombre de bus au DÉPART (Station A)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={schedule.numberOfBusesDepart}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      numberOfBusesDepart: parseInt(e.target.value) || 0,
                    })
                  }
                  className="config-input"
                />
                <small style={{ color: '#666' }}>Bus qui commencent leur journée à la station de départ</small>
              </div>
              <div className="config-field">
                <label>Nombre de bus à la DESTINATION (Station B)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={schedule.numberOfBusesDestination}
                  onChange={(e) =>
                    setSchedule({
                      ...schedule,
                      numberOfBusesDestination: parseInt(e.target.value) || 0,
                    })
                  }
                  className="config-input"
                />
                <small style={{ color: '#666' }}>Bus qui commencent leur journée à la destination</small>
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
                <label>Durée trajet ALLER (minutes)</label>
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
                  placeholder="Ex: 30"
                />
              </div>
              <div className="config-field">
                <label>Durée trajet RETOUR (minutes)</label>
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
                  placeholder="Ex: 30"
                />
              </div>
              <div className="config-field">
                <label>Pause station départ (minutes)</label>
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
                  placeholder="Ex: 10"
                />
              </div>
              <div className="config-field">
                <label>Temps d'arrêt aux stations (minutes)</label>
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
                <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                  Temps d'arrêt par défaut pour toutes les stations. Peut être personnalisé individuellement ci-dessous.
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Stop Times by Station Card */}
        <div className="config-card">
          <div className="config-card-header">
            <MapPin size={20} className="config-icon" />
            <h2>Temps d'arrêt à chaque station</h2>
            {(isLoadingStations) && <Loader size={16} className="animate-spin" style={{ marginLeft: '10px' }} />}
          </div>
          <div className="config-card-content">
            {isLoadingStations ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Chargement des stations...
              </div>
            ) : schedule.stations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Aucune station disponible pour cette ligne
              </div>
            ) : (
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
            )}
          </div>
        </div>


        {/* Summary Card */}
        <div className="config-card config-card-summary">
          <div className="config-card-header">
            <Info size={20} className="config-icon" />
            <h2>Récapitulatif de la Configuration</h2>
          </div>
          <div className="config-card-content">
            <div className="config-summary-grid">
              <div className="config-summary-item">
                <p className="config-summary-label">Ligne sélectionnée</p>
                <p className="config-summary-value config-summary-coverage">
                  {currentLine?.name || 'Non sélectionnée'}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Nombre total de bus</p>
                <p className="config-summary-value">
                  {schedule.numberOfBuses}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Bus au départ (Station A)</p>
                <p className="config-summary-value">
                  {schedule.numberOfBusesDepart}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Bus à destination (Station B)</p>
                <p className="config-summary-value">
                  {schedule.numberOfBusesDestination}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Heures d'opération</p>
                <p className="config-summary-value config-summary-coverage">
                  {schedule.firstDepartureA} - {schedule.firstDepartureB}
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Fréquence entre bus</p>
                <p className="config-summary-value">
                  {schedule.intervalMinutes} min
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Durée trajet aller</p>
                <p className="config-summary-value">
                  {schedule.durationAB} min
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Durée trajet retour</p>
                <p className="config-summary-value">
                  {schedule.durationBA} min
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Pause station départ</p>
                <p className="config-summary-value">
                  {schedule.pauseStationA} min
                </p>
              </div>
              <div className="config-summary-item">
                <p className="config-summary-label">Temps d'arrêt stations</p>
                <p className="config-summary-value">
                  {schedule.pauseStationB} min
                </p>
              </div>
            </div>
          </div>
        </div>


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
