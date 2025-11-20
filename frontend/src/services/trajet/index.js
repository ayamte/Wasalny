export { default as ConfigurationPage } from './pages/configuration/configuration';
export { default as RechercheTrajetPage } from './pages/recherche/recherche';

// Services
export {
  configurationService,
  ligneService,
  stationService,
  busService,
  tripService,
  handleApiError,
} from './configurationService';

// API Endpoints
export { ENDPOINTS } from './API_ENDPOINTS';

// Utils
export const trajetUtils = {
  timeToMinutes: (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  },

  minutesToTime: (minutes) => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  },

  calculateSchedule: (data) => {
    const startMinutesA = ((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    })(data.firstDepartureA);

    const startMinutesB = ((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    })(data.firstDepartureB);

    const departuresA = [];
    const departuresB = [];

    for (let i = 0; i < data.numberOfBuses; i++) {
      const departureTime = startMinutesA + i * data.intervalMinutes;
      departuresA.push(
        ((minutes) => {
          const hours = Math.floor(minutes / 60) % 24;
          const mins = minutes % 60;
          return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        })(departureTime)
      );
    }

    for (let i = 0; i < data.numberOfBuses; i++) {
      const departureTime = startMinutesB + i * data.intervalMinutes;
      departuresB.push(
        ((minutes) => {
          const hours = Math.floor(minutes / 60) % 24;
          const mins = minutes % 60;
          return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        })(departureTime)
      );
    }

    const totalBuses = data.numberOfBuses * 2;
    const totalTrips = departuresA.length + departuresB.length;

    const coverageStart = data.firstDepartureA;
    const lastDepartureA = departuresA[departuresA.length - 1] || data.firstDepartureA;
    const lastDepartureB = departuresB[departuresB.length - 1] || data.firstDepartureB;

    const timeToMin = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const maxEndA = timeToMin(lastDepartureA) + data.durationAB + data.pauseStationB;
    const maxEndB = timeToMin(lastDepartureB) + data.durationBA + data.pauseStationA;

    const coverageEnd = ((minutes) => {
      const hours = Math.floor(minutes / 60) % 24;
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    })(Math.max(maxEndA, maxEndB));

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
  },
};

export default {
  ConfigurationPage,
  RechercheTrajetPage,
  configurationService,
  ligneService,
  stationService,
  busService,
  tripService,
  handleApiError,
  ENDPOINTS,
  trajetUtils,
};
