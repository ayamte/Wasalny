/**
 * Backend API Endpoints to Implement
 * These endpoints should be implemented in the Trajet Service
 * Located in: backend/trajet-service/src/main/java/com/wasalny/trajet/controller
 */

// ============================================
// 1. CONFIGURATION HORAIRE ENDPOINTS
// ============================================

/**
 * POST /api/trajets/config-horaire
 * Description: Create a new schedule configuration
 * Authority: ADMIN
 * 
 * Request Body:
 * {
 *   "lineId": "123e4567-e89b-12d3-a456-426614174000",
 *   "numberOfBuses": 4,
 *   "firstDepartureA": "07:00",
 *   "firstDepartureB": "07:00",
 *   "intervalMinutes": 30,
 *   "durationAB": 60,
 *   "durationBA": 60,
 *   "pauseStationA": 30,
 *   "pauseStationB": 30,
 *   "stations": [
 *     { "name": "Casablanca", "stopTime": 5 },
 *     { "name": "Ain Sebaa", "stopTime": 5 },
 *     { "name": "Rabat", "stopTime": 5 }
 *   ]
 * }
 * 
 * Response: (201 Created)
 * {
 *   "id": "config-uuid",
 *   "lineId": "123e4567-e89b-12d3-a456-426614174000",
 *   "numberOfBuses": 4,
 *   "createdAt": "2025-11-19T10:30:00Z",
 *   "createdBy": "admin-uuid"
 * }
 */

/**
 * GET /api/trajets/config-horaire/ligne/{lineId}
 * Description: Get configuration for a specific line
 * Authority: ADMIN, CLIENT, CONDUCTEUR
 * Path Params:
 *   - lineId: UUID of the line
 * 
 * Response: (200 OK)
 * {
 *   "id": "config-uuid",
 *   "lineId": "123e4567-e89b-12d3-a456-426614174000",
 *   "numberOfBuses": 4,
 *   "firstDepartureA": "07:00",
 *   "firstDepartureB": "07:00",
 *   "intervalMinutes": 30,
 *   "durationAB": 60,
 *   "durationBA": 60,
 *   "pauseStationA": 30,
 *   "pauseStationB": 30,
 *   "stations": [...],
 *   "createdAt": "2025-11-19T10:30:00Z",
 *   "updatedAt": "2025-11-19T15:45:00Z"
 * }
 */

/**
 * PUT /api/trajets/config-horaire/{configId}
 * Description: Update an existing configuration
 * Authority: ADMIN
 * Path Params:
 *   - configId: UUID of the configuration
 * 
 * Request Body: Same as POST
 * Response: Updated configuration object (200 OK)
 */

/**
 * DELETE /api/trajets/config-horaire/{configId}
 * Description: Delete a configuration
 * Authority: ADMIN
 * Path Params:
 *   - configId: UUID of the configuration
 * 
 * Response: 204 No Content
 */

/**
 * GET /api/trajets/config-horaire
 * Description: Get all configurations (with pagination)
 * Authority: ADMIN
 * Query Params:
 *   - page: page number (default: 0)
 *   - size: page size (default: 20)
 *   - lineId: (optional) filter by line
 * 
 * Response: (200 OK)
 * {
 *   "content": [...],
 *   "totalElements": 10,
 *   "totalPages": 1,
 *   "currentPage": 0
 * }
 */

/**
 * POST /api/trajets/config-horaire/simuler
 * Description: Simulate a schedule configuration
 * Authority: ADMIN
 * 
 * Request Body:
 * {
 *   "numberOfBuses": 4,
 *   "firstDepartureA": "07:00",
 *   "firstDepartureB": "07:00",
 *   "intervalMinutes": 30,
 *   "durationAB": 60,
 *   "durationBA": 60,
 *   "pauseStationA": 30,
 *   "pauseStationB": 30
 * }
 * 
 * Response: (200 OK)
 * {
 *   "totalBuses": 8,
 *   "totalTrips": 8,
 *   "coverageStart": "07:00",
 *   "coverageEnd": "18:30",
 *   "averageFrequency": 30,
 *   "departuresA": ["07:00", "07:30", "08:00", "08:30"],
 *   "departuresB": ["07:00", "07:30", "08:00", "08:30"]
 * }
 */

/**
 * POST /api/trajets/config-horaire/{configId}/generer-trips
 * Description: Generate trips from a configuration
 * Authority: ADMIN
 * Path Params:
 *   - configId: UUID of the configuration
 * Query Params:
 *   - date: target date (format: YYYY-MM-DD, default: today)
 * 
 * Response: (201 Created)
 * {
 *   "tripsGenerated": 8,
 *   "tripIds": [
 *     "trip-uuid-1",
 *     "trip-uuid-2",
 *     ...
 *   ],
 *   "configId": "config-uuid",
 *   "generatedAt": "2025-11-19T10:30:00Z"
 * }
 */

// ============================================
// 2. LIGNE (ROUTE) ENDPOINTS
// ============================================

/**
 * GET /api/trajets/lignes
 * Description: Get all lines
 * Authority: PUBLIC
 * 
 * Response: (200 OK)
 * [
 *   {
 *     "id": "ligne-uuid",
 *     "name": "Ligne 1",
 *     "description": "Casablanca - Rabat",
 *     "isActive": true,
 *     "numberOfStations": 5
 *   },
 *   ...
 * ]
 */

/**
 * GET /api/trajets/lignes/{ligneId}
 * Description: Get a specific line
 * Authority: PUBLIC
 * Path Params:
 *   - ligneId: UUID of the line
 * 
 * Response: (200 OK)
 * {
 *   "id": "ligne-uuid",
 *   "name": "Ligne 1",
 *   "description": "Casablanca - Rabat",
 *   "isActive": true,
 *   "numberOfStations": 5,
 *   "stations": [...]
 * }
 */

/**
 * POST /api/trajets/lignes
 * Description: Create a new line
 * Authority: ADMIN
 * 
 * Request Body:
 * {
 *   "name": "Ligne 1",
 *   "description": "Casablanca - Rabat",
 *   "stationIds": ["station-uuid-1", "station-uuid-2", ...]
 * }
 * 
 * Response: (201 Created) - Line object
 */

/**
 * PUT /api/trajets/lignes/{ligneId}
 * Description: Update a line
 * Authority: ADMIN
 * 
 * Response: (200 OK) - Updated line object
 */

/**
 * DELETE /api/trajets/lignes/{ligneId}
 * Description: Delete a line
 * Authority: ADMIN
 * 
 * Response: 204 No Content
 */

// ============================================
// 3. STATION ENDPOINTS
// ============================================

/**
 * GET /api/trajets/stations
 * Description: Get all stations
 * Authority: PUBLIC
 * 
 * Response: (200 OK)
 * [
 *   {
 *     "id": "station-uuid",
 *     "name": "Casablanca Voyageurs",
 *     "city": "Casablanca",
 *     "latitude": 33.5731,
 *     "longitude": -7.5898,
 *     "isActive": true
 *   },
 *   ...
 * ]
 */

/**
 * GET /api/trajets/stations/ligne/{ligneId}
 * Description: Get stations for a specific line
 * Authority: PUBLIC
 * Path Params:
 *   - ligneId: UUID of the line
 * 
 * Response: (200 OK) - Array of station objects
 */

/**
 * GET /api/trajets/stations/{stationId}
 * Description: Get a specific station
 * Authority: PUBLIC
 * 
 * Response: (200 OK) - Station object
 */

/**
 * POST /api/trajets/stations
 * Description: Create a new station
 * Authority: ADMIN
 * 
 * Request Body:
 * {
 *   "name": "Casablanca Voyageurs",
 *   "city": "Casablanca",
 *   "latitude": 33.5731,
 *   "longitude": -7.5898
 * }
 * 
 * Response: (201 Created) - Station object
 */

/**
 * PUT /api/trajets/stations/{stationId}
 * Description: Update a station
 * Authority: ADMIN
 * 
 * Response: (200 OK) - Updated station object
 */

/**
 * DELETE /api/trajets/stations/{stationId}
 * Description: Delete a station
 * Authority: ADMIN
 * 
 * Response: 204 No Content
 */

// ============================================
// 4. BUS ENDPOINTS
// ============================================

/**
 * GET /api/trajets/buses
 * Description: Get all buses
 * Authority: ADMIN
 * 
 * Response: (200 OK)
 * [
 *   {
 *     "id": "bus-uuid",
 *     "registrationNumber": "AB-123456",
 *     "capacity": 50,
 *     "model": "Mercedes Sprinter",
 *     "isActive": true
 *   },
 *   ...
 * ]
 */

/**
 * GET /api/trajets/buses/{busId}
 * Description: Get a specific bus
 * Authority: ADMIN
 * 
 * Response: (200 OK) - Bus object
 */

/**
 * POST /api/trajets/buses
 * Description: Create a new bus
 * Authority: ADMIN
 * 
 * Request Body:
 * {
 *   "registrationNumber": "AB-123456",
 *   "capacity": 50,
 *   "model": "Mercedes Sprinter"
 * }
 * 
 * Response: (201 Created) - Bus object
 */

/**
 * PUT /api/trajets/buses/{busId}
 * Description: Update a bus
 * Authority: ADMIN
 * 
 * Response: (200 OK) - Updated bus object
 */

/**
 * DELETE /api/trajets/buses/{busId}
 * Description: Delete a bus
 * Authority: ADMIN
 * 
 * Response: 204 No Content
 */

// ============================================
// 5. TRIP ENDPOINTS
// ============================================

/**
 * GET /api/trajets/trips
 * Description: Get all trips
 * Authority: ADMIN
 * Query Params:
 *   - status: (optional) filter by status
 *   - date: (optional) filter by date
 * 
 * Response: (200 OK) - Array of trip objects
 */

/**
 * GET /api/trajets/trips/{tripId}
 * Description: Get a specific trip
 * Authority: PUBLIC
 * 
 * Response: (200 OK)
 * {
 *   "id": "trip-uuid",
 *   "numeroTrip": "LGN001-2025-11-19-07:00",
 *   "ligneId": "ligne-uuid",
 *   "busId": "bus-uuid",
 *   "conducteurId": "user-uuid",
 *   "dateTrip": "2025-11-19",
 *   "heureDepart": "07:00",
 *   "heureArriveeEstimee": "08:30",
 *   "status": "PLANIFIE",
 *   "nbrPlaces": 50,
 *   "nbrReservations": 35,
 *   "nbrPlacesDisponibles": 15,
 *   "passages": [...]
 * }
 */

/**
 * GET /api/trajets/trips/date/{date}
 * Description: Get all trips for a specific date
 * Authority: PUBLIC
 * Path Params:
 *   - date: Date in format YYYY-MM-DD
 * 
 * Response: (200 OK) - Array of trip objects
 */

/**
 * POST /api/trajets/trips/{tripId}/demarrer
 * Description: Start a trip
 * Authority: CONDUCTEUR
 * 
 * Response: (200 OK) - Updated trip object
 */

/**
 * POST /api/trajets/trips/{tripId}/terminer
 * Description: End a trip
 * Authority: CONDUCTEUR
 * 
 * Response: (200 OK) - Updated trip object
 */

/**
 * POST /api/trajets/trips/{tripId}/annuler
 * Description: Cancel a trip
 * Authority: ADMIN
 * 
 * Response: (200 OK) - Updated trip object
 */

// ============================================
// ERROR RESPONSES
// ============================================

/**
 * All endpoints may return:
 * 
 * 400 Bad Request
 * {
 *   "error": "INVALID_REQUEST",
 *   "message": "Validation failed",
 *   "details": {...}
 * }
 * 
 * 401 Unauthorized
 * {
 *   "error": "UNAUTHORIZED",
 *   "message": "Authentication required"
 * }
 * 
 * 403 Forbidden
 * {
 *   "error": "FORBIDDEN",
 *   "message": "Insufficient permissions"
 * }
 * 
 * 404 Not Found
 * {
 *   "error": "NOT_FOUND",
 *   "message": "Resource not found"
 * }
 * 
 * 500 Internal Server Error
 * {
 *   "error": "SERVER_ERROR",
 *   "message": "An unexpected error occurred"
 * }
 */

export const ENDPOINTS = {
  // Configuration
  CONFIG: '/api/trajets/config-horaire',
  CONFIG_BY_LINE: (lineId) => `/api/trajets/config-horaire/ligne/${lineId}`,
  CONFIG_SIMULATE: '/api/trajets/config-horaire/simuler',
  CONFIG_GENERATE_TRIPS: (configId) => `/api/trajets/config-horaire/${configId}/generer-trips`,

  // Lignes
  LIGNES: '/api/trajets/lignes',
  LIGNE_BY_ID: (ligneId) => `/api/trajets/lignes/${ligneId}`,

  // Stations
  STATIONS: '/api/trajets/stations',
  STATIONS_BY_LINE: (ligneId) => `/api/trajets/stations/ligne/${ligneId}`,
  STATION_BY_ID: (stationId) => `/api/trajets/stations/${stationId}`,

  // Buses
  BUSES: '/api/trajets/buses',
  BUS_BY_ID: (busId) => `/api/trajets/buses/${busId}`,

  // Trips
  TRIPS: '/api/trajets/trips',
  TRIP_BY_ID: (tripId) => `/api/trajets/trips/${tripId}`,
  TRIPS_BY_DATE: (date) => `/api/trajets/trips/date/${date}`,
  TRIP_START: (tripId) => `/api/trajets/trips/${tripId}/demarrer`,
  TRIP_END: (tripId) => `/api/trajets/trips/${tripId}/terminer`,
  TRIP_CANCEL: (tripId) => `/api/trajets/trips/${tripId}/annuler`,
};
