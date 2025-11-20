# Guide API Complet - Wasalny (Paths Corrects)

## 🔗 URLs de Base

```
API Gateway:        http://localhost:8080
Auth Service:       http://localhost:8086
User Service:       http://localhost:8083
Trajet Service:     http://localhost:8081
Geo Service:        http://localhost:8084
Paiement Service:   http://localhost:8082
Ticket Service:     http://localhost:8085
Abonnement Service: http://localhost:8087
Notification:       http://localhost:8088
```

---

## 1️⃣ AUTH-SERVICE (Port 8086)

### 1.1 Register ADMIN
```http
POST http://localhost:8086/auth/signup
Content-Type: application/json

{
  "nom": "Admin",
  "prenom": "System",
  "email": "admin@wasalny.com",
  "password": "<REDACTED>",
  "telephone": "0600000001",
  "role": "ADMIN"
}
```

### 1.2 Register CONDUCTEUR
```http
POST http://localhost:8086/auth/signup
Content-Type: application/json

{
  "nom": "Conducteur",
  "prenom": "Hassan",
  "email": "conducteur@wasalny.com",
  "password": "<REDACTED>",
  "telephone": "0600000002",
  "role": "CONDUCTEUR"
}
```

### 1.3 Register CLIENT
```http
POST http://localhost:8086/auth/signup
Content-Type: application/json

{
  "nom": "Client",
  "prenom": "Fatima",
  "email": "client@wasalny.com",
  "password": "<REDACTED>",
  "telephone": "0600000003",
  "role": "CLIENT"
}
```

### 1.4 Login
```http
POST http://localhost:8086/auth/login
Content-Type: application/json

{
  "email": "admin@wasalny.com",
  "password": "<REDACTED>"
}
```

**Response:** Sauvegarder le `token` et `id`

---

## 2️⃣ USER-SERVICE (Port 8083)

### 2.1 Get All Users (ADMIN)
```http
GET http://localhost:8083/admin/users
Authorization: Bearer {ADMIN_TOKEN}
```

### 2.2 Get Users by Role (ADMIN)
```http
GET http://localhost:8083/admin/users/role/CLIENT
Authorization: Bearer {ADMIN_TOKEN}
```

### 2.3 Get Client Profile
```http
GET http://localhost:8083/client/profile
Authorization: Bearer {CLIENT_TOKEN}
```

### 2.4 Update Client Profile
```http
PUT http://localhost:8083/client/profile
Authorization: Bearer {CLIENT_TOKEN}
Content-Type: application/json

{
  "nom": "Client Updated",
  "prenom": "Fatima",
  "telephone": "0600000099"
}
```

### 2.5 Get Conducteur Profile
```http
GET http://localhost:8083/conducteur/profile
Authorization: Bearer {CONDUCTEUR_TOKEN}
```

### 2.6 Update Conducteur Profile
```http
PUT http://localhost:8083/conducteur/profile
Authorization: Bearer {CONDUCTEUR_TOKEN}
Content-Type: application/json

{
  "nom": "Conducteur",
  "prenom": "Hassan Updated",
  "telephone": "0600000088"
}
```

---

## 3️⃣ TRAJET-SERVICE (Port 8081)

### 3.1 Create Station DEPART
```http
POST http://localhost:8081/trajets/stations
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "nom": "Hay Riad",
  "latitude": 33.9822,
  "longitude": -6.8489,
  "adresse": "Boulevard Hay Riad, Rabat"
}
```

**Response:** Sauvegarder `id` comme `STATION_DEPART_ID`

### 3.2 Create Station INTERMEDIAIRE
```http
POST http://localhost:8081/trajets/stations
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "nom": "Agdal",
  "latitude": 33.9715,
  "longitude": -6.8498,
  "adresse": "Avenue Ibn Sina, Agdal, Rabat"
}
```

**Response:** Sauvegarder `id` comme `STATION_INTERMEDIAIRE_ID`

### 3.3 Create Station FINALE
```http
POST http://localhost:8081/trajets/stations
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "nom": "Bab El Had",
  "latitude": 34.0209,
  "longitude": -6.8347,
  "adresse": "Place Bab El Had, Rabat"
}
```

**Response:** Sauvegarder `id` comme `STATION_FINALE_ID`

### 3.4 Get All Stations
```http
GET http://localhost:8081/trajets/stations
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.5 Get Station by ID
```http
GET http://localhost:8081/trajets/stations/{STATION_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.6 Create Ligne
```http
POST http://localhost:8081/trajets/lignes
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json


{
  "numero": "L12",
  "nom": "Ligne Hay Riad - Bab El Had",
  "stationDepartId": "{STATION_DEPART_ID}",
  "stationArriveeId": "{STATION_FINALE_ID}"",
  "stationsIntermediairesIds": ["{STATION_INTERMEDIAIRE_ID}"],
  "prixStandard": 7.00,
  "vitesseStandardKmH": 40.0
}
```

**Response:** Sauvegarder `id` comme `LIGNE_ID`

### 3.7 Get All Lignes
```http
GET http://localhost:8081/trajets/lignes
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.8 Get Ligne by ID
```http
GET http://localhost:8081/trajets/lignes/{LIGNE_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.9 Get Ligne Stations
```http
GET http://localhost:8081/trajets/lignes/{LIGNE_ID}/stations
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.10 Create Bus
```http
POST http://localhost:8081/trajets/buses
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "numeroImmatriculation": "ABC-123-45",
  "modele": "Mercedes Citaro",
  "capacite": 80,
  "statut": "DISPONIBLE"
}
```

**Response:** Sauvegarder `id` comme `BUS_ID`

### 3.11 Get All Buses
```http
GET http://localhost:8081/trajets/buses
Authorization: Bearer {ADMIN_TOKEN}
```

### 3.12 Get Bus by ID
```http
GET http://localhost:8081/trajets/buses/{BUS_ID}
Authorization: Bearer {ADMIN_TOKEN}
```

### 3.13 Create Configuration Horaire
```http
POST http://localhost:8081/trajets/configurations-horaires
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "ligneId": "{ID_LIGNE}",
  "heureDebut": "06:00:00",
  "heureFin": "23:00:00",
  "frequenceMinutes": 30,
  "nombreBus": 2,
  "tempsArretMinutes": 2,
  "tempsPauseMinutes": 15,
  "dureeAllerMinutes": 45,
  "dureeRetourMinutes": 45
}
```

**Response:** Sauvegarder `id` comme `CONFIG_HORAIRE_ID`

### 3.14 Get Active Configurations
```http
GET http://localhost:8081/trajets/configurations-horaires/actives
Authorization: Bearer {ADMIN_TOKEN}
```

### 3.15 Create Assignation Bus-Conducteur
```http
POST http://localhost:8081/trajets/assignations
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "busId": "{BUS_ID}",
  "conducteurId": "{CONDUCTEUR_ID}",
  "dateDebut": "2025-11-18",
  "dateFin": "2025-11-18"
}
```

**Response:** Sauvegarder `id` comme `ASSIGNATION_ID`

### 3.16 Get Conductor Assignations
```http
GET http://localhost:8081/trajets/assignations/conducteur/{CONDUCTEUR_ID}
Authorization: Bearer {CONDUCTEUR_TOKEN}
```

### 3.17 Generate Trips for Date
```http
POST http://localhost:8081/trajets/configurations-horaires/{CONFIG_HORAIRE_ID}/generer-trips?date=2025-11-18
Authorization: Bearer {ADMIN_TOKEN}
```

**Response:** Sauvegarder premier `id` comme `TRIP_ID`

### 3.18 Get Trips by Date
```http
GET http://localhost:8081/trajets/trips/date/2025-11-18
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.19 Get Trip by ID
```http
GET http://localhost:8081/trajets/trips/{TRIP_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.20 Get Trips by Ligne and Date
```http
GET http://localhost:8081/trajets/trips/ligne/{LIGNE_ID}/date/2025-11-18
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.21 Search Trips
```http
POST http://localhost:8081/trajets/trips/rechercher
Authorization: Bearer {CLIENT_TOKEN}
Content-Type: application/json

{
  "stationDepartId": "{STATION_DEPART_ID}",
  "stationArriveeId": "{STATION_FINALE_ID}",
  "date": "2025-11-18"
}
```

### 3.22 Start Trip (CONDUCTEUR)
```http
POST http://localhost:8081/trajets/trips/{TRIP_ID}/demarrer
Authorization: Bearer {CONDUCTEUR_TOKEN}
```

### 3.23 Reserve Place (CLIENT)
```http
POST http://localhost:8081/trajets/trips/{TRIP_ID}/reserver-place
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.24 Get Available Seats
```http
GET http://localhost:8081/trajets/trips/{TRIP_ID}/places-disponibles
Authorization: Bearer {CLIENT_TOKEN}
```

### 3.25 Get Trip Passages
```http
GET http://localhost:8081/trajets/passages/trip/{TRIP_ID}
Authorization: Bearer {CONDUCTEUR_TOKEN}
```

**Response:** Sauvegarder les `id` comme `PASSAGE_1_ID`, `PASSAGE_2_ID`, etc.

### 3.26 Confirm Station Passage (CONDUCTEUR)
```http
POST http://localhost:8081/trajets/passages/{PASSAGE_ID}/confirmer
Authorization: Bearer {CONDUCTEUR_TOKEN}
```

### 3.27 Update Trip Location (CONDUCTEUR)
```http
POST http://localhost:8081/trajets/trips/{TRIP_ID}/update-location
Authorization: Bearer {CONDUCTEUR_TOKEN}
Content-Type: application/json

{
  "latitude": 33.9770,
  "longitude": -6.8492,
  "vitesse": 45.5,
  "direction": "Nord"
}
```

### 3.28 Finish Trip (CONDUCTEUR)
```http
POST http://localhost:8081/trajets/trips/{TRIP_ID}/terminer
Authorization: Bearer {CONDUCTEUR_TOKEN}
```

### 3.29 Cancel Trip (ADMIN)
```http
POST http://localhost:8081/trajets/trips/{TRIP_ID}/annuler
Authorization: Bearer {ADMIN_TOKEN}
```

---

## 4️⃣ GEOLOCALISATION-SERVICE (Port 8084)

### 4.1 Create Location (CONDUCTEUR)
```http
POST http://localhost:8084/locations
Authorization: Bearer {CONDUCTEUR_TOKEN}
Content-Type: application/json

{
  "busId": "{BUS_ID}",
  "latitude": 33.9822,
  "longitude": -6.8489,
  "vitesse": 0.0,
  "direction": "Nord"
}
```

### 4.2 Get Bus Locations
```http
GET http://localhost:8084/locations?busId={BUS_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 4.3 Get Latest Bus Location
```http
GET http://localhost:8084/locations/latest?busId={BUS_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 4.4 Get Location by Bus ID
```http
GET http://localhost:8084/locations/{BUS_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 4.5 Get Nearby Locations
```http
GET http://localhost:8084/locations/nearby?latitude=33.9715&longitude=-6.8498&radiusKm=5.0
Authorization: Bearer {CLIENT_TOKEN}
```

### 4.6 Update Location (CONDUCTEUR)
```http
PUT http://localhost:8084/locations/{LOCATION_ID}
Authorization: Bearer {CONDUCTEUR_TOKEN}
Content-Type: application/json

{
  "busId": "{BUS_ID}",
  "latitude": 33.9715,
  "longitude": -6.8498,
  "vitesse": 30.0,
  "direction": "Nord"
}
```

### 4.7 Delete Location (ADMIN)
```http
DELETE http://localhost:8084/locations/{LOCATION_ID}
Authorization: Bearer {ADMIN_TOKEN}
```

---

## 5️⃣ ABONNEMENT-SERVICE (Port 8087)

### 5.1 Get All Subscription Types (PUBLIC)
```http
GET http://localhost:8087/abonnements/types
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.2 Get Active Subscription Types
```http
GET http://localhost:8087/abonnements/types/actifs
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.3 Create Subscription Type (ADMIN)
```http
POST http://localhost:8087/abonnements/types
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "nom": "Mensuel Standard",
  "description": "Abonnement mensuel toutes lignes",
  "dureeJours": 30,
  "prix": 150.00,
  "lignesAutorisees": ["{LIGNE_ID}"]
}
```

**Response:** Sauvegarder `id` comme `TYPE_ABONNEMENT_ID`

### 5.4 Get Client Subscriptions
```http
GET http://localhost:8087/abonnements/client/{CLIENT_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.5 Get Active Client Subscription
```http
GET http://localhost:8087/abonnements/client/{CLIENT_ID}/actif
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.6 Get Subscription by ID
```http
GET http://localhost:8087/abonnements/{ABONNEMENT_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.7 Check Line Access
```http
GET http://localhost:8087/abonnements/client/{CLIENT_ID}/peut-utiliser-ligne/{LIGNE_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.8 Renew Subscription (CLIENT)
```http
PUT http://localhost:8087/abonnements/{ABONNEMENT_ID}/renouveler
Authorization: Bearer {CLIENT_TOKEN}
```

### 5.9 Cancel Subscription (CLIENT)
```http
PUT http://localhost:8087/abonnements/{ABONNEMENT_ID}/annuler
Authorization: Bearer {CLIENT_TOKEN}
```

---

## 6️⃣ PAIEMENT-SERVICE (Port 8082)

### 6.1 Initiate Payment for Ticket
```http
POST http://localhost:8082/paiements/initier
Authorization: Bearer {CLIENT_TOKEN}
Content-Type: application/json

{
  "clientId": "{CLIENT_ID}",
  "montant": 7.00,
  "typePaiement": "TICKET",
  "referenceExterne": "{TRIP_ID}",
  "methodePaiement": "CARTE_BANCAIRE"
}
```

**Response:** Sauvegarder `id` comme `TRANSACTION_TICKET_ID`

### 6.2 Process Payment (ADMIN) - ⚠️ NOT "confirmer"
```http
POST http://localhost:8082/paiements/{TRANSACTION_TICKET_ID}/traiter
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "referenceTransaction": "TXN-TICKET-001"
}
```

### 6.3 Initiate Payment for Abonnement
```http
POST http://localhost:8082/paiements/initier
Authorization: Bearer {CLIENT_TOKEN}
Content-Type: application/json

{
  "clientId": "{CLIENT_ID}",
  "montant": 150.00,
  "typePaiement": "ABONNEMENT",
  "referenceExterne": "{TYPE_ABONNEMENT_ID}",
  "methodePaiement": "CARTE_BANCAIRE"
}
```

**Response:** Sauvegarder `id` comme `TRANSACTION_ABO_ID`

### 6.4 Process Payment for Abonnement (ADMIN)
```http
POST http://localhost:8082/paiements/{TRANSACTION_ABO_ID}/traiter
Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "referenceTransaction": "TXN-ABO-001"
}
```

### 6.5 Get Transaction by ID
```http
GET http://localhost:8082/paiements/{TRANSACTION_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 6.6 Get Client Transactions
```http
GET http://localhost:8082/paiements/client/{CLIENT_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

---

## 7️⃣ TICKET-SERVICE (Port 8085)

### 7.1 Get Ticket by ID
```http
GET http://localhost:8085/tickets/{TICKET_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 7.2 Get Client Tickets
```http
GET http://localhost:8085/tickets/client/{CLIENT_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

**Response:** Sauvegarder premier `id` comme `TICKET_ID`

### 7.3 Validate Ticket (ADMIN)
```http
PUT http://localhost:8085/tickets/{TICKET_ID}/valider
Authorization: Bearer {ADMIN_TOKEN}
```

### 7.4 Cancel Ticket (CLIENT)
```http
PUT http://localhost:8085/tickets/{TICKET_ID}/annuler
Authorization: Bearer {CLIENT_TOKEN}
```

### 7.5 Refund Ticket (ADMIN)
```http
PUT http://localhost:8085/tickets/{TICKET_ID}/rembourser
Authorization: Bearer {ADMIN_TOKEN}
```

---

## 8️⃣ NOTIFICATION-SERVICE (Port 8088)

### 8.1 Get User Notifications
```http
GET http://localhost:8088/notifications
Authorization: Bearer {CLIENT_TOKEN}
```

### 8.2 Get Client Notifications - ⚠️ NOT "/user/{userId}"
```http
GET http://localhost:8088/notifications/client/{CLIENT_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 8.3 Get Unread Notifications
```http
GET http://localhost:8088/notifications/unread
Authorization: Bearer {CLIENT_TOKEN}
```

### 8.4 Get Notification by ID
```http
GET http://localhost:8088/notifications/{NOTIFICATION_ID}
Authorization: Bearer {CLIENT_TOKEN}
```

### 8.5 Mark Notification as Read
```http
PUT http://localhost:8088/notifications/{NOTIFICATION_ID}/read
Authorization: Bearer {CLIENT_TOKEN}
```

---

## 📊 WORKFLOW COMPLET - ORDRE D'EXÉCUTION

### Phase 1: Authentification
1. POST `/auth/signup` - Register ADMIN → sauvegarder `ADMIN_TOKEN`, `ADMIN_ID`
2. POST `/auth/signup` - Register CONDUCTEUR → sauvegarder `CONDUCTEUR_TOKEN`, `CONDUCTEUR_ID`
3. POST `/auth/signup` - Register CLIENT → sauvegarder `CLIENT_TOKEN`, `CLIENT_ID`

### Phase 2: Setup Infrastructure (ADMIN)
4. POST `/trajets/stations` - Create Hay Riad → `STATION_DEPART_ID`
5. POST `/trajets/stations` - Create Agdal → `STATION_INTERMEDIAIRE_ID`
6. POST `/trajets/stations` - Create Bab El Had → `STATION_FINALE_ID`
7. POST `/trajets/lignes` - Create Ligne L12 → `LIGNE_ID`
8. POST `/trajets/buses` - Create Bus ABC-123-45 → `BUS_ID`
9. POST `/trajets/configurations-horaires` - Create Config → `CONFIG_HORAIRE_ID`
10. POST `/abonnements/types` - Create Type Abonnement → `TYPE_ABONNEMENT_ID`

### Phase 3: Assignation (ADMIN)
11. POST `/trajets/assignations` - Assign Bus to Conducteur → `ASSIGNATION_ID`

### Phase 4: Generate Trips (ADMIN)
12. POST `/trajets/configurations-horaires/{id}/generer-trips?date=2025-11-18` → `TRIP_ID`

### Phase 5: Client Consultation
13. GET `/trajets/stations` - View stations
14. GET `/trajets/lignes` - View lignes
15. GET `/trajets/trips/date/2025-11-18` - View trips
16. GET `/trajets/trips/{TRIP_ID}` - View trip details

### Phase 6: Client Achète Ticket
17. POST `/paiements/initier` - Initiate ticket payment → `TRANSACTION_TICKET_ID`
18. POST `/paiements/{id}/traiter` - ADMIN processes payment
19. **Attendre 2-3 secondes** (RabbitMQ)
20. GET `/tickets/client/{CLIENT_ID}` - Verify ticket created → `TICKET_ID`

### Phase 7: Client Achète Abonnement
21. POST `/paiements/initier` - Initiate subscription payment → `TRANSACTION_ABO_ID`
22. POST `/paiements/{id}/traiter` - ADMIN processes payment
23. **Attendre 2-3 secondes** (RabbitMQ)
24. GET `/abonnements/client/{CLIENT_ID}` - Verify abonnement created → `ABONNEMENT_ID`

### Phase 8: Conducteur Démarre Trip
25. POST `/trajets/trips/{TRIP_ID}/demarrer` - Start trip
26. POST `/locations` - Update location #1 (Hay Riad)
27. POST `/locations` - Update location #2 (En route)
28. POST `/locations` - Update location #3 (Agdal)

### Phase 9: Client Suit le Bus
29. GET `/locations/latest?busId={BUS_ID}` - Get latest location
30. GET `/locations?busId={BUS_ID}` - Get all locations
31. GET `/locations/nearby?latitude=33.9715&longitude=-6.8498&radiusKm=5.0` - Nearby buses

### Phase 10: Conducteur Termine Trip
32. GET `/trajets/passages/trip/{TRIP_ID}` - Get passages → `PASSAGE_1_ID`, `PASSAGE_2_ID`
33. POST `/trajets/passages/{PASSAGE_1_ID}/confirmer` - Confirm passage 1
34. POST `/trajets/passages/{PASSAGE_2_ID}/confirmer` - Confirm passage 2
35. POST `/trajets/trips/{TRIP_ID}/terminer` - Finish trip

### Phase 11: Vérifications Finales
36. GET `/notifications/client/{CLIENT_ID}` - Check notifications
37. GET `/paiements/client/{CLIENT_ID}` - Check transactions
38. GET `/tickets/client/{CLIENT_ID}` - Check tickets
39. GET `/abonnements/client/{CLIENT_ID}` - Check abonnements

---

## ⚠️ DIFFÉRENCES IMPORTANTES

### User-Service
- ❌ **PAS** `/users`
- ✅ Utiliser `/admin/users`, `/client/profile`, `/conducteur/profile`

### Paiement-Service
- ❌ **PAS** `/paiements/{id}/confirmer`
- ✅ Utiliser `/paiements/{id}/traiter`

### Notification-Service
- ❌ **PAS** `/notifications/user/{userId}`
- ✅ Utiliser `/notifications/client/{clientId}`

### Trajet-Service - Passages
- ❌ **PAS** `/trajets/passages-stations/{id}/confirmer`
- ✅ Utiliser `/trajets/passages/{id}/confirmer`

---

## 🎯 VARIABLES À MAINTENIR

```javascript
// Tokens
ADMIN_TOKEN = "<REDACTED>"
CONDUCTEUR_TOKEN = "<REDACTED>"
CLIENT_TOKEN = "<REDACTED>"

// User IDs
ADMIN_ID = "uuid-admin"
CONDUCTEUR_ID = "uuid-conducteur"
CLIENT_ID = "uuid-client"

// Infrastructure IDs
STATION_DEPART_ID = "uuid-station-1"
STATION_INTERMEDIAIRE_ID = "uuid-station-2"
STATION_FINALE_ID = "uuid-station-3"
LIGNE_ID = "uuid-ligne"
BUS_ID = "uuid-bus"
CONFIG_HORAIRE_ID = "uuid-config"
TYPE_ABONNEMENT_ID = "uuid-type-abo"

// Operation IDs
ASSIGNATION_ID = "uuid-assignation"
TRIP_ID = "uuid-trip"
TRANSACTION_TICKET_ID = "uuid-trans-ticket"
TRANSACTION_ABO_ID = "uuid-trans-abo"
TICKET_ID = "uuid-ticket"
ABONNEMENT_ID = "uuid-abonnement"
PASSAGE_1_ID = "uuid-passage-1"
PASSAGE_2_ID = "uuid-passage-2"
LOCATION_ID = "1"
NOTIFICATION_ID = "uuid-notif"
```

---

## 📝 NOTES IMPORTANTES

1. **Attendre les événements RabbitMQ**: 2-3 secondes après confirmation paiement avant de vérifier ticket/abonnement
2. **Headers requis**: Toujours inclure `Authorization: Bearer {TOKEN}` et `Content-Type: application/json` pour POST/PUT
3. **Ports directs**: Utiliser les ports directs (8081, 8082, etc.) pour éviter les problèmes d'API Gateway
4. **Status codes**: 200 OK, 201 Created, 204 No Content, 401 Unauthorized, 403 Forbidden, 404 Not Found

---

**Document corrigé avec les paths réels du code source** ✅
