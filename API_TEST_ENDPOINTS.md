# Guide Complet des Endpoints API - Wasalny Microservices

## 📋 Table des Matières
1. [Configuration](#configuration)
2. [Auth Service - Authentification](#1-auth-service---authentification)
3. [User Service - Gestion Utilisateurs](#2-user-service---gestion-utilisateurs)
4. [Trajet Service - Infrastructure](#3-trajet-service---infrastructure)
5. [Abonnement Service - Types Abonnements](#4-abonnement-service---types-abonnements)
6. [Trajet Service - Assignations](#5-trajet-service---assignations)
7. [Trajet Service - Génération Trips](#6-trajet-service---génération-trips)
8. [Paiement Service - Transactions](#7-paiement-service---transactions)
9. [Ticket Service - Tickets](#8-ticket-service---tickets)
10. [Abonnement Service - Abonnements](#9-abonnement-service---abonnements)
11. [Trajet Service - Opérations Conducteur](#10-trajet-service---opérations-conducteur)
12. [Geolocalisation Service - Tracking](#11-geolocalisation-service---tracking)
13. [Notification Service - Notifications](#12-notification-service---notifications)

---

## Configuration

### Base URL
```
http://localhost:8080
```

### Ports des Services
- API Gateway: 8080
- Auth Service: 8086
- User Service: 8083
- Trajet Service: 8081
- Geolocalisation Service: 8084
- Paiement Service: 8082
- Ticket Service: 8085
- Abonnement Service: 8087
- Notification Service: 8088

### Variables Globales à Sauvegarder
```javascript
// Tokens
ADMIN_TOKEN = ""
CONDUCTEUR_TOKEN = ""
CLIENT_TOKEN = ""

// IDs Utilisateurs
ADMIN_ID = ""
CONDUCTEUR_ID = ""
CLIENT_ID = ""

// IDs Infrastructure
STATION_DEPART_ID = ""
STATION_INTERMEDIAIRE_ID = ""
STATION_FINALE_ID = ""
LIGNE_ID = ""
BUS_ID = ""
CONFIG_HORAIRE_ID = ""
ASSIGNATION_ID = ""

// IDs Opérations
TRIP_ID = ""
TYPE_ABONNEMENT_ID = ""
TRANSACTION_TICKET_ID = ""
TRANSACTION_ABO_ID = ""
TICKET_ID = ""
ABONNEMENT_ID = ""
PASSAGE_1_ID = ""
PASSAGE_2_ID = ""
```

---

## 1. Auth Service - Authentification

### 1.1 Register ADMIN

**Endpoint:** `POST /auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Admin",
  "prenom": "System",
  "email": "admin@wasalny.com",
  "password": "<REDACTED>",
  "telephone": "0600000001",
  "role": "ADMIN"
}
```

**Response:** (Sauvegarder `ADMIN_TOKEN` et `ADMIN_ID`)
```json
{
  "token": "<REDACTED>",
  "id": "uuid-admin",
  "email": "admin@wasalny.com",
  "role": "ADMIN"
}
```

---

### 1.2 Register CONDUCTEUR

**Endpoint:** `POST /auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Conducteur",
  "prenom": "Hassan",
  "email": "conducteur@wasalny.com",
  "password": "<REDACTED>",
  "telephone": "0600000002",
  "role": "CONDUCTEUR"
}
```

**Response:** (Sauvegarder `CONDUCTEUR_TOKEN` et `CONDUCTEUR_ID`)
```json
{
  "token": "<REDACTED>",
  "id": "uuid-conducteur",
  "email": "conducteur@wasalny.com",
  "role": "CONDUCTEUR"
}
```

---

### 1.3 Register CLIENT

**Endpoint:** `POST /auth/register`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Client",
  "prenom": "Fatima",
  "email": "client@wasalny.com",
  "password": "<REDACTED>",
  "telephone": "0600000003",
  "role": "CLIENT"
}
```

**Response:** (Sauvegarder `CLIENT_TOKEN` et `CLIENT_ID`)
```json
{
  "token": "<REDACTED>",
  "id": "uuid-client",
  "email": "client@wasalny.com",
  "role": "CLIENT"
}
```

---

### 1.4 Login (Alternative)

**Endpoint:** `POST /auth/login`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "email": "admin@wasalny.com",
  "password": "<REDACTED>"
}
```

**Response:**
```json
{
  "token": "<REDACTED>",
  "id": "uuid-admin",
  "email": "admin@wasalny.com",
  "role": "ADMIN"
}
```

---

## 2. User Service - Gestion Utilisateurs

### 2.1 Get User Profile (ADMIN)

**Endpoint:** `GET /users/{ADMIN_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-admin",
  "nom": "Admin",
  "prenom": "System",
  "email": "admin@wasalny.com",
  "telephone": "0600000001",
  "role": "ADMIN",
  "dateCreation": "2025-11-18T20:00:00"
}
```

---

### 2.2 Get User Profile (CONDUCTEUR)

**Endpoint:** `GET /users/{CONDUCTEUR_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}"
}
```

---

### 2.3 Get User Profile (CLIENT)

**Endpoint:** `GET /users/{CLIENT_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

---

### 2.4 Get All Users (ADMIN only)

**Endpoint:** `GET /users`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "nom": "Admin",
    "email": "admin@wasalny.com",
    "role": "ADMIN"
  },
  {
    "id": "uuid-2",
    "nom": "Conducteur",
    "email": "conducteur@wasalny.com",
    "role": "CONDUCTEUR"
  }
]
```

---

## 3. Trajet Service - Infrastructure

### 3.1 Create Station DEPART

**Endpoint:** `POST /trajets/stations`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Hay Riad",
  "latitude": 33.9822,
  "longitude": -6.8489,
  "adresse": "Boulevard Hay Riad, Rabat"
}
```

**Response:** (Sauvegarder `STATION_DEPART_ID`)
```json
{
  "id": "uuid-station-depart",
  "nom": "Hay Riad",
  "latitude": 33.9822,
  "longitude": -6.8489,
  "adresse": "Boulevard Hay Riad, Rabat",
  "active": true,
  "createdAt": "2025-11-18T20:00:00"
}
```

---

### 3.2 Create Station INTERMEDIAIRE

**Endpoint:** `POST /trajets/stations`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Agdal",
  "latitude": 33.9715,
  "longitude": -6.8498,
  "adresse": "Avenue Ibn Sina, Agdal, Rabat"
}
```

**Response:** (Sauvegarder `STATION_INTERMEDIAIRE_ID`)
```json
{
  "id": "uuid-station-inter",
  "nom": "Agdal",
  "latitude": 33.9715,
  "longitude": -6.8498,
  "adresse": "Avenue Ibn Sina, Agdal, Rabat",
  "active": true
}
```

---

### 3.3 Create Station FINALE

**Endpoint:** `POST /trajets/stations`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Bab El Had",
  "latitude": 34.0209,
  "longitude": -6.8347,
  "adresse": "Place Bab El Had, Rabat"
}
```

**Response:** (Sauvegarder `STATION_FINALE_ID`)
```json
{
  "id": "uuid-station-finale",
  "nom": "Bab El Had",
  "latitude": 34.0209,
  "longitude": -6.8347,
  "adresse": "Place Bab El Had, Rabat",
  "active": true
}
```

---

### 3.4 Get All Stations (CLIENT can access)

**Endpoint:** `GET /trajets/stations`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-station-depart",
    "nom": "Hay Riad",
    "latitude": 33.9822,
    "longitude": -6.8489
  },
  {
    "id": "uuid-station-inter",
    "nom": "Agdal",
    "latitude": 33.9715,
    "longitude": -6.8498
  },
  {
    "id": "uuid-station-finale",
    "nom": "Bab El Had",
    "latitude": 34.0209,
    "longitude": -6.8347
  }
]
```

---

### 3.5 Create Ligne

**Endpoint:** `POST /trajets/lignes`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "numero": "L12",
  "nom": "Ligne Hay Riad - Bab El Had",
  "description": "Ligne directe centre ville",
  "stationDepartId": "{STATION_DEPART_ID}",
  "stationFinaleId": "{STATION_FINALE_ID}",
  "stationsIntermediaires": ["{STATION_INTERMEDIAIRE_ID}"],
  "tarifBase": 7.00
}
```

**Response:** (Sauvegarder `LIGNE_ID`)
```json
{
  "id": "uuid-ligne",
  "numero": "L12",
  "nom": "Ligne Hay Riad - Bab El Had",
  "description": "Ligne directe centre ville",
  "stationDepart": {
    "id": "uuid-station-depart",
    "nom": "Hay Riad"
  },
  "stationFinale": {
    "id": "uuid-station-finale",
    "nom": "Bab El Had"
  },
  "stationsIntermediaires": [
    {
      "id": "uuid-station-inter",
      "nom": "Agdal",
      "ordre": 1
    }
  ],
  "tarifBase": 7.00,
  "active": true
}
```

---

### 3.6 Get All Lignes (CLIENT can access)

**Endpoint:** `GET /trajets/lignes`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-ligne",
    "numero": "L12",
    "nom": "Ligne Hay Riad - Bab El Had",
    "tarifBase": 7.00,
    "active": true
  }
]
```

---

### 3.7 Get Ligne Details (with stations)

**Endpoint:** `GET /trajets/lignes/{LIGNE_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-ligne",
  "numero": "L12",
  "nom": "Ligne Hay Riad - Bab El Had",
  "stationDepart": {
    "id": "uuid-station-depart",
    "nom": "Hay Riad",
    "latitude": 33.9822,
    "longitude": -6.8489
  },
  "stationFinale": {
    "id": "uuid-station-finale",
    "nom": "Bab El Had",
    "latitude": 34.0209,
    "longitude": -6.8347
  },
  "stationsIntermediaires": [
    {
      "id": "uuid-station-inter",
      "nom": "Agdal",
      "ordre": 1
    }
  ],
  "tarifBase": 7.00,
  "active": true
}
```

---

### 3.8 Create Bus

**Endpoint:** `POST /trajets/bus`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "numeroImmatriculation": "ABC-123-45",
  "modele": "Mercedes Citaro",
  "capacite": 80,
  "statut": "DISPONIBLE"
}
```

**Response:** (Sauvegarder `BUS_ID`)
```json
{
  "id": "uuid-bus",
  "numeroImmatriculation": "ABC-123-45",
  "modele": "Mercedes Citaro",
  "capacite": 80,
  "statut": "DISPONIBLE",
  "createdAt": "2025-11-18T20:00:00"
}
```

---

### 3.9 Get All Bus (ADMIN only)

**Endpoint:** `GET /trajets/bus`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-bus",
    "numeroImmatriculation": "ABC-123-45",
    "modele": "Mercedes Citaro",
    "capacite": 80,
    "statut": "DISPONIBLE"
  }
]
```

---

### 3.10 Create Configuration Horaire

**Endpoint:** `POST /trajets/configurations-horaires`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "ligneId": "{LIGNE_ID}",
  "nom": "Horaires Semaine Ligne 12",
  "heureDebut": "06:00:00",
  "heureFin": "23:00:00",
  "intervalleMinutes": 30,
  "joursActifs": ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"],
  "active": true
}
```

**Response:** (Sauvegarder `CONFIG_HORAIRE_ID`)
```json
{
  "id": "uuid-config",
  "ligneId": "uuid-ligne",
  "nom": "Horaires Semaine Ligne 12",
  "heureDebut": "06:00:00",
  "heureFin": "23:00:00",
  "intervalleMinutes": 30,
  "joursActifs": ["LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI"],
  "active": true
}
```

---

### 3.11 Get Active Configurations

**Endpoint:** `GET /trajets/configurations-horaires/actives`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

---

## 4. Abonnement Service - Types Abonnements

### 4.1 Create Type Abonnement

**Endpoint:** `POST /abonnements/types`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "nom": "Mensuel Standard",
  "description": "Abonnement mensuel toutes lignes",
  "dureeJours": 30,
  "prix": 150.00,
  "lignesAutorisees": ["{LIGNE_ID}"]
}
```

**Response:** (Sauvegarder `TYPE_ABONNEMENT_ID`)
```json
{
  "id": "uuid-type-abo",
  "nom": "Mensuel Standard",
  "description": "Abonnement mensuel toutes lignes",
  "dureeJours": 30,
  "prix": 150.00,
  "lignesAutorisees": ["uuid-ligne"],
  "actif": true
}
```

---

### 4.2 Get All Types Abonnement (PUBLIC)

**Endpoint:** `GET /abonnements/types`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-type-abo",
    "nom": "Mensuel Standard",
    "description": "Abonnement mensuel toutes lignes",
    "dureeJours": 30,
    "prix": 150.00,
    "actif": true
  }
]
```

---

## 5. Trajet Service - Assignations

### 5.1 Assign Bus to Conducteur

**Endpoint:** `POST /trajets/assignations`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "busId": "{BUS_ID}",
  "conducteurId": "{CONDUCTEUR_ID}",
  "dateDebut": "2025-11-18",
  "dateFin": "2025-11-18"
}
```

**Response:** (Sauvegarder `ASSIGNATION_ID`)
```json
{
  "id": "uuid-assignation",
  "busId": "uuid-bus",
  "numeroImmatriculation": "ABC-123-45",
  "conducteurId": "uuid-conducteur",
  "dateDebut": "2025-11-18",
  "dateFin": "2025-11-18",
  "active": true
}
```

---

### 5.2 Get Assignations for Conducteur

**Endpoint:** `GET /trajets/assignations/conducteur/{CONDUCTEUR_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-assignation",
    "busId": "uuid-bus",
    "numeroImmatriculation": "ABC-123-45",
    "dateDebut": "2025-11-18",
    "dateFin": "2025-11-18",
    "active": true
  }
]
```

---

## 6. Trajet Service - Génération Trips

### 6.1 Generate Trips for Today

**Endpoint:** `POST /trajets/configurations-horaires/{CONFIG_HORAIRE_ID}/generer-trips?date=2025-11-18`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

**Response:** (Sauvegarder `TRIP_ID` du premier trip)
```json
[
  {
    "id": "uuid-trip-1",
    "numeroTrip": "L12-20251118-0600",
    "ligneId": "uuid-ligne",
    "nomLigne": "Ligne Hay Riad - Bab El Had",
    "heureDepart": "06:00:00",
    "heureArriveeEstimee": "06:45:00",
    "date": "2025-11-18",
    "statut": "PLANIFIE",
    "placesDisponibles": 80,
    "placesReservees": 0
  },
  {
    "id": "uuid-trip-2",
    "numeroTrip": "L12-20251118-0630",
    "heureDepart": "06:30:00",
    "statut": "PLANIFIE"
  }
]
```

---

### 6.2 Get Trips by Date (CLIENT can access)

**Endpoint:** `GET /trajets/trips?date=2025-11-18`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-trip-1",
    "numeroTrip": "L12-20251118-0600",
    "ligneId": "uuid-ligne",
    "nomLigne": "Ligne Hay Riad - Bab El Had",
    "heureDepart": "06:00:00",
    "heureArriveeEstimee": "06:45:00",
    "statut": "PLANIFIE",
    "placesDisponibles": 80
  }
]
```

---

### 6.3 Get Trip Details

**Endpoint:** `GET /trajets/trips/{TRIP_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-trip",
  "numeroTrip": "L12-20251118-0600",
  "ligne": {
    "id": "uuid-ligne",
    "numero": "L12",
    "nom": "Ligne Hay Riad - Bab El Had"
  },
  "heureDepart": "06:00:00",
  "heureArriveeEstimee": "06:45:00",
  "date": "2025-11-18",
  "statut": "PLANIFIE",
  "placesDisponibles": 80,
  "placesReservees": 0,
  "passagesStations": [
    {
      "stationId": "uuid-station-depart",
      "nomStation": "Hay Riad",
      "heurePassageEstimee": "06:00:00",
      "ordre": 1
    },
    {
      "stationId": "uuid-station-inter",
      "nomStation": "Agdal",
      "heurePassageEstimee": "06:20:00",
      "ordre": 2
    },
    {
      "stationId": "uuid-station-finale",
      "nomStation": "Bab El Had",
      "heurePassageEstimee": "06:45:00",
      "ordre": 3
    }
  ]
}
```

---

### 6.4 Get Trips by Ligne

**Endpoint:** `GET /trajets/trips/ligne/{LIGNE_ID}?date=2025-11-18`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

---

## 7. Paiement Service - Transactions

### 7.1 Initiate Payment for Ticket

**Endpoint:** `POST /paiements/initier`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "clientId": "{CLIENT_ID}",
  "montant": 7.00,
  "typePaiement": "TICKET",
  "referenceExterne": "{TRIP_ID}",
  "methodePaiement": "CARTE_BANCAIRE"
}
```

**Response:** (Sauvegarder `TRANSACTION_TICKET_ID`)
```json
{
  "id": "uuid-transaction-ticket",
  "clientId": "uuid-client",
  "montant": 7.00,
  "typePaiement": "TICKET",
  "referenceExterne": "uuid-trip",
  "methodePaiement": "CARTE_BANCAIRE",
  "statut": "EN_ATTENTE",
  "dateCreation": "2025-11-18T20:00:00"
}
```

---

### 7.2 Confirm Payment for Ticket

**Endpoint:** `POST /paiements/{TRANSACTION_TICKET_ID}/confirmer`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "referenceTransaction": "TXN-TICKET-001"
}
```

**Response:**
```json
{
  "id": "uuid-transaction-ticket",
  "clientId": "uuid-client",
  "montant": 7.00,
  "typePaiement": "TICKET",
  "statut": "CONFIRME",
  "referenceTransaction": "TXN-TICKET-001",
  "dateConfirmation": "2025-11-18T20:00:05"
}
```

**Note:** Un événement RabbitMQ est publié → Ticket-Service crée automatiquement le ticket

---

### 7.3 Initiate Payment for Abonnement

**Endpoint:** `POST /paiements/initier`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "clientId": "{CLIENT_ID}",
  "montant": 150.00,
  "typePaiement": "ABONNEMENT",
  "referenceExterne": "{TYPE_ABONNEMENT_ID}",
  "methodePaiement": "CARTE_BANCAIRE"
}
```

**Response:** (Sauvegarder `TRANSACTION_ABO_ID`)
```json
{
  "id": "uuid-transaction-abo",
  "clientId": "uuid-client",
  "montant": 150.00,
  "typePaiement": "ABONNEMENT",
  "referenceExterne": "uuid-type-abo",
  "methodePaiement": "CARTE_BANCAIRE",
  "statut": "EN_ATTENTE",
  "dateCreation": "2025-11-18T20:00:10"
}
```

---

### 7.4 Confirm Payment for Abonnement

**Endpoint:** `POST /paiements/{TRANSACTION_ABO_ID}/confirmer`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "referenceTransaction": "TXN-ABO-001"
}
```

**Response:**
```json
{
  "id": "uuid-transaction-abo",
  "clientId": "uuid-client",
  "montant": 150.00,
  "typePaiement": "ABONNEMENT",
  "statut": "CONFIRME",
  "referenceTransaction": "TXN-ABO-001",
  "dateConfirmation": "2025-11-18T20:00:15"
}
```

**Note:** Un événement RabbitMQ est publié → Abonnement-Service crée automatiquement l'abonnement

---

### 7.5 Get Client Transactions

**Endpoint:** `GET /paiements/client/{CLIENT_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-transaction-ticket",
    "montant": 7.00,
    "typePaiement": "TICKET",
    "statut": "CONFIRME",
    "dateCreation": "2025-11-18T20:00:00"
  },
  {
    "id": "uuid-transaction-abo",
    "montant": 150.00,
    "typePaiement": "ABONNEMENT",
    "statut": "CONFIRME",
    "dateCreation": "2025-11-18T20:00:10"
  }
]
```

---

### 7.6 Get All Transactions (ADMIN only)

**Endpoint:** `GET /paiements`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

---

## 8. Ticket Service - Tickets

### 8.1 Get Client Tickets

**Endpoint:** `GET /tickets/client/{CLIENT_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:** (Sauvegarder `TICKET_ID`)
```json
[
  {
    "id": "uuid-ticket",
    "numeroTicket": "TKT-20251118-001",
    "clientId": "uuid-client",
    "tripId": "uuid-trip",
    "numeroTrip": "L12-20251118-0600",
    "ligneId": "uuid-ligne",
    "nomLigne": "Ligne Hay Riad - Bab El Had",
    "stationDepartId": "uuid-station-depart",
    "nomStationDepart": "Hay Riad",
    "stationFinaleId": "uuid-station-finale",
    "nomStationFinale": "Bab El Had",
    "dateAchat": "2025-11-18T20:00:05",
    "prix": 7.00,
    "statut": "EN_ATTENTE",
    "transactionId": "uuid-transaction-ticket",
    "createdAt": "2025-11-18T20:00:05"
  }
]
```

---

### 8.2 Get Ticket Details

**Endpoint:** `GET /tickets/{TICKET_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-ticket",
  "numeroTicket": "TKT-20251118-001",
  "clientId": "uuid-client",
  "tripId": "uuid-trip",
  "numeroTrip": "L12-20251118-0600",
  "ligneId": "uuid-ligne",
  "nomLigne": "Ligne Hay Riad - Bab El Had",
  "stationDepartId": "uuid-station-depart",
  "nomStationDepart": "Hay Riad",
  "stationFinaleId": "uuid-station-finale",
  "nomStationFinale": "Bab El Had",
  "dateAchat": "2025-11-18T20:00:05",
  "prix": 7.00,
  "statut": "EN_ATTENTE",
  "transactionId": "uuid-transaction-ticket"
}
```

---

### 8.3 Validate Ticket (ADMIN)

**Endpoint:** `PUT /tickets/{TICKET_ID}/valider`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-ticket",
  "numeroTicket": "TKT-20251118-001",
  "statut": "VALIDE",
  "dateValidation": "2025-11-18T20:05:00"
}
```

---

### 8.4 Cancel Ticket (CLIENT)

**Endpoint:** `PUT /tickets/{TICKET_ID}/annuler`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-ticket",
  "numeroTicket": "TKT-20251118-001",
  "statut": "ANNULE"
}
```

---

### 8.5 Refund Ticket (ADMIN)

**Endpoint:** `PUT /tickets/{TICKET_ID}/rembourser`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

---

## 9. Abonnement Service - Abonnements

### 9.1 Get Client Abonnements

**Endpoint:** `GET /abonnements/client/{CLIENT_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:** (Sauvegarder `ABONNEMENT_ID`)
```json
[
  {
    "id": "uuid-abonnement",
    "numeroAbonnement": "ABO-20251118-001",
    "clientId": "uuid-client",
    "typeAbonnementId": "uuid-type-abo",
    "nomTypeAbonnement": "Mensuel Standard",
    "dateDebut": "2025-11-18",
    "dateFin": "2025-12-18",
    "dateAchat": "2025-11-18T20:00:15",
    "statut": "ACTIF",
    "montantPaye": 150.00,
    "transactionId": "uuid-transaction-abo",
    "lignesAutorisees": ["uuid-ligne"],
    "zoneGeographique": "Rabat Centre",
    "valide": true,
    "expire": false
  }
]
```

---

### 9.2 Get Abonnement Details

**Endpoint:** `GET /abonnements/{ABONNEMENT_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-abonnement",
  "numeroAbonnement": "ABO-20251118-001",
  "clientId": "uuid-client",
  "typeAbonnement": {
    "id": "uuid-type-abo",
    "nom": "Mensuel Standard",
    "dureeJours": 30,
    "prix": 150.00
  },
  "dateDebut": "2025-11-18",
  "dateFin": "2025-12-18",
  "statut": "ACTIF",
  "lignesAutorisees": ["uuid-ligne"],
  "zoneGeographique": "Rabat Centre",
  "valide": true,
  "expire": false
}
```

---

### 9.3 Renew Abonnement (CLIENT)

**Endpoint:** `POST /abonnements/{ABONNEMENT_ID}/renouveler`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-abonnement",
  "numeroAbonnement": "ABO-20251118-001",
  "dateDebut": "2025-11-18",
  "dateFin": "2025-12-18",
  "statut": "ACTIF"
}
```

---

### 9.4 Cancel Abonnement (CLIENT)

**Endpoint:** `PUT /abonnements/{ABONNEMENT_ID}/annuler`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

---

### 9.5 Get All Abonnements (ADMIN only)

**Endpoint:** `GET /abonnements`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

---

## 10. Trajet Service - Opérations Conducteur

### 10.1 Start Trip (CONDUCTEUR)

**Endpoint:** `POST /trajets/trips/{TRIP_ID}/demarrer`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-trip",
  "numeroTrip": "L12-20251118-0600",
  "statut": "EN_COURS",
  "heureDepartReelle": "2025-11-18T06:02:00",
  "busId": "uuid-bus",
  "conducteurId": "uuid-conducteur"
}
```

---

### 10.2 Reserve Place in Trip (CLIENT)

**Endpoint:** `POST /trajets/trips/{TRIP_ID}/reserver-place`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-trip",
  "numeroTrip": "L12-20251118-0600",
  "placesDisponibles": 79,
  "placesReservees": 1
}
```

---

### 10.3 Get Passages Stations for Trip

**Endpoint:** `GET /trajets/passages-stations/trip/{TRIP_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}"
}
```

**Response:** (Sauvegarder `PASSAGE_1_ID` et `PASSAGE_2_ID`)
```json
[
  {
    "id": "uuid-passage-1",
    "tripId": "uuid-trip",
    "stationId": "uuid-station-depart",
    "nomStation": "Hay Riad",
    "heurePassageEstimee": "06:00:00",
    "ordre": 1,
    "confirme": false
  },
  {
    "id": "uuid-passage-2",
    "stationId": "uuid-station-inter",
    "nomStation": "Agdal",
    "heurePassageEstimee": "06:20:00",
    "ordre": 2,
    "confirme": false
  },
  {
    "id": "uuid-passage-3",
    "stationId": "uuid-station-finale",
    "nomStation": "Bab El Had",
    "heurePassageEstimee": "06:45:00",
    "ordre": 3,
    "confirme": false
  }
]
```

---

### 10.4 Confirm Station Passage (CONDUCTEUR)

**Endpoint:** `POST /trajets/passages-stations/{PASSAGE_1_ID}/confirmer`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-passage-1",
  "tripId": "uuid-trip",
  "stationId": "uuid-station-depart",
  "nomStation": "Hay Riad",
  "heurePassageReelle": "2025-11-18T06:02:00",
  "confirme": true
}
```

**Repeat for PASSAGE_2_ID, PASSAGE_3_ID...**

---

### 10.5 Finish Trip (CONDUCTEUR)

**Endpoint:** `POST /trajets/trips/{TRIP_ID}/terminer`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-trip",
  "numeroTrip": "L12-20251118-0600",
  "statut": "TERMINE",
  "heureArriveeReelle": "2025-11-18T06:48:00"
}
```

---

## 11. Geolocalisation Service - Tracking

### 11.1 Update Bus Location #1 (CONDUCTEUR)

**Endpoint:** `POST /locations`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "busId": "{BUS_ID}",
  "latitude": 33.9822,
  "longitude": -6.8489,
  "vitesse": 0.0,
  "direction": "Nord"
}
```

**Response:**
```json
{
  "id": 1,
  "busId": "uuid-bus",
  "latitude": 33.9822,
  "longitude": -6.8489,
  "vitesse": 0.0,
  "direction": "Nord",
  "timestamp": "2025-11-18T06:02:00"
}
```

---

### 11.2 Update Bus Location #2 (En route)

**Endpoint:** `POST /locations`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "busId": "{BUS_ID}",
  "latitude": 33.9770,
  "longitude": -6.8492,
  "vitesse": 45.5,
  "direction": "Nord"
}
```

**Response:**
```json
{
  "id": 2,
  "busId": "uuid-bus",
  "latitude": 33.9770,
  "longitude": -6.8492,
  "vitesse": 45.5,
  "direction": "Nord",
  "timestamp": "2025-11-18T06:15:00"
}
```

---

### 11.3 Update Bus Location #3 (Agdal)

**Endpoint:** `POST /locations`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "busId": "{BUS_ID}",
  "latitude": 33.9715,
  "longitude": -6.8498,
  "vitesse": 0.0,
  "direction": "Nord"
}
```

---

### 11.4 Get Latest Bus Location (CLIENT)

**Endpoint:** `GET /locations/latest?busId={BUS_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": 3,
  "busId": "uuid-bus",
  "latitude": 33.9715,
  "longitude": -6.8498,
  "vitesse": 0.0,
  "direction": "Nord",
  "timestamp": "2025-11-18T06:22:00"
}
```

---

### 11.5 Get All Bus Locations (CLIENT)

**Endpoint:** `GET /locations?busId={BUS_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": 1,
    "busId": "uuid-bus",
    "latitude": 33.9822,
    "longitude": -6.8489,
    "timestamp": "2025-11-18T06:02:00"
  },
  {
    "id": 2,
    "latitude": 33.9770,
    "longitude": -6.8492,
    "timestamp": "2025-11-18T06:15:00"
  },
  {
    "id": 3,
    "latitude": 33.9715,
    "longitude": -6.8498,
    "timestamp": "2025-11-18T06:22:00"
  }
]
```

---

### 11.6 Get Nearby Buses (CLIENT)

**Endpoint:** `GET /locations/nearby?latitude=33.9715&longitude=-6.8498&radiusKm=5.0`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": 3,
    "busId": "uuid-bus",
    "latitude": 33.9715,
    "longitude": -6.8498,
    "vitesse": 0.0,
    "distance": 0.0,
    "timestamp": "2025-11-18T06:22:00"
  }
]
```

---

### 11.7 Update Trip Location (CONDUCTEUR) - Via Trip ID

**Endpoint:** `POST /trajets/trips/{TRIP_ID}/update-location`

**Headers:**
```json
{
  "Authorization": "Bearer {CONDUCTEUR_TOKEN}",
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "latitude": 33.9715,
  "longitude": -6.8498,
  "vitesse": 45.5,
  "direction": "Nord"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Location updated for bus uuid-bus"
}
```

---

## 12. Notification Service - Notifications

### 12.1 Get User Notifications (CLIENT)

**Endpoint:** `GET /notifications/user/{CLIENT_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-notif-1",
    "userId": "uuid-client",
    "titre": "Ticket acheté",
    "message": "Votre ticket TKT-20251118-001 pour le trip L12-20251118-0600 a été créé avec succès",
    "type": "TICKET",
    "lu": false,
    "dateCreation": "2025-11-18T20:00:05"
  },
  {
    "id": "uuid-notif-2",
    "userId": "uuid-client",
    "titre": "Abonnement activé",
    "message": "Votre abonnement Mensuel Standard (ABO-20251118-001) est maintenant actif",
    "type": "ABONNEMENT",
    "lu": false,
    "dateCreation": "2025-11-18T20:00:15"
  }
]
```

---

### 12.2 Get All Notifications (ADMIN)

**Endpoint:** `GET /notifications`

**Headers:**
```json
{
  "Authorization": "Bearer {ADMIN_TOKEN}"
}
```

**Response:**
```json
[
  {
    "id": "uuid-notif-1",
    "userId": "uuid-client",
    "titre": "Ticket acheté",
    "type": "TICKET",
    "dateCreation": "2025-11-18T20:00:05"
  },
  {
    "id": "uuid-notif-2",
    "userId": "uuid-client",
    "titre": "Abonnement activé",
    "type": "ABONNEMENT",
    "dateCreation": "2025-11-18T20:00:15"
  }
]
```

---

### 12.3 Mark Notification as Read

**Endpoint:** `PUT /notifications/{NOTIFICATION_ID}/marquer-lu`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "id": "uuid-notif-1",
  "lu": true,
  "dateLecture": "2025-11-18T20:10:00"
}
```

---

### 12.4 Get Unread Notifications Count

**Endpoint:** `GET /notifications/user/{CLIENT_ID}/non-lues/count`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```json
{
  "count": 2
}
```

---

### 12.5 Delete Notification

**Endpoint:** `DELETE /notifications/{NOTIFICATION_ID}`

**Headers:**
```json
{
  "Authorization": "Bearer {CLIENT_TOKEN}"
}
```

**Response:**
```
204 No Content
```

---

## 📊 Workflow Complet Résumé

### Ordre d'Exécution Recommandé

1. **Setup (ADMIN)**
   - 1.1 → 1.2 → 1.3: Register 3 users (ADMIN, CONDUCTEUR, CLIENT)
   - 3.1 → 3.3: Create 3 stations
   - 3.5: Create ligne
   - 3.8: Create bus
   - 3.10: Create configuration horaire
   - 4.1: Create type abonnement
   - 5.1: Assign bus to conducteur
   - 6.1: Generate trips

2. **CLIENT - Consultation**
   - 3.4: Get stations
   - 3.6: Get lignes
   - 6.2: Get trips
   - 6.3: Get trip details

3. **CLIENT - Achats**
   - 7.1: Initiate payment ticket
   - 7.2: Confirm payment (ADMIN)
   - 8.1: Verify ticket created (wait 2-3 seconds)
   - 7.3: Initiate payment abonnement
   - 7.4: Confirm payment (ADMIN)
   - 9.1: Verify abonnement created (wait 2-3 seconds)

4. **CONDUCTEUR - Opérations**
   - 10.1: Start trip
   - 11.1 → 11.3: Update bus locations (3 positions)
   - 10.3: Get passages stations
   - 10.4: Confirm passages (repeat for each station)
   - 10.5: Finish trip

5. **CLIENT - Tracking**
   - 11.4: Get latest bus location
   - 11.5: Get all bus locations
   - 11.6: Get nearby buses

6. **Vérifications Finales**
   - 12.1: Check notifications (CLIENT)
   - 12.2: Check all notifications (ADMIN)
   - 7.5: Get client transactions
   - 8.1: Get client tickets
   - 9.1: Get client abonnements

---

## 🔧 Notes Importantes

### Délais à Respecter
- Attendre **2-3 secondes** après confirmation paiement avant de vérifier ticket/abonnement (RabbitMQ)
- Attendre **1 seconde** entre chaque mise à jour de géolocalisation

### Variables à Remplacer
- `{ADMIN_TOKEN}`: Token JWT de l'admin
- `{CONDUCTEUR_TOKEN}`: Token JWT du conducteur
- `{CLIENT_TOKEN}`: Token JWT du client
- `{*_ID}`: Remplacer par les IDs obtenus des réponses précédentes

### Status Codes Attendus
- **200 OK**: Opération réussie (GET, PUT)
- **201 Created**: Ressource créée (POST)
- **204 No Content**: Suppression réussie (DELETE)
- **401 Unauthorized**: Token manquant/invalide
- **403 Forbidden**: Permissions insuffisantes
- **404 Not Found**: Ressource introuvable

### Headers Requis
- **Authorization**: `Bearer {TOKEN}` pour tous les endpoints (sauf register/login)
- **Content-Type**: `application/json` pour tous les POST/PUT

---

**Document généré pour tests manuels avec Postman/Insomnia**
