# Guide de Liaison - Gestion des Conducteurs et des Bus

## Vue d'ensemble

Ce document décrit la liaison complète entre les pages frontend de gestion des conducteurs et des bus avec leurs services backend respectifs (user-service et trajet-service).

## Architecture

```
Frontend (React)
├── DriversManagement.jsx → driversService.js → user-service (Backend)
├── BusesManagement.jsx → busService.js → trajet-service (Backend)
└── busAssignmentService.js → trajet-service (Backend)
```

## 1. Gestion des Conducteurs

### Frontend
**Fichier**: `frontend/src/services/user/gestion_conducteur/DriversManagement.jsx`

**Fonctionnalités**:
- ✅ Liste tous les conducteurs (ADMIN)
- ✅ Ajouter un nouveau conducteur
- ✅ Modifier un conducteur existant
- ✅ Supprimer un conducteur
- ✅ Gestion des états de chargement
- ✅ Messages d'erreur et de succès

### Service Frontend
**Fichier**: `frontend/src/services/user/driversService.js`

**Méthodes disponibles**:
```javascript
// Récupérer tous les conducteurs
driversService.getAllDrivers()

// Récupérer un conducteur par ID
driversService.getDriverById(driverId)

// Récupérer un conducteur par email
driversService.getDriverByEmail(email)

// Créer un nouveau conducteur
driversService.createDriver({
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone: string,
  licenseNumber: string
})

// Mettre à jour un conducteur
driversService.updateDriver(email, {
  firstName: string,
  lastName: string,
  phone: string,
  licenseNumber: string
})

// Supprimer un conducteur
driversService.deleteDriver(driverId)

// Activer un conducteur
driversService.activateDriver(driverId)

// Désactiver un conducteur
driversService.deactivateDriver(driverId)
```

### Backend - User Service
**Contrôleur**: `backend/user-service/src/main/java/com/wasalny/user/controller/ConducteurController.java`

**Endpoints API**:
```
GET    /api/users/admin/conducteurs              - Liste tous les conducteurs (ADMIN)
GET    /api/users/admin/conducteurs/{id}         - Récupère un conducteur par ID (ADMIN)
GET    /api/users/conducteur/profile?email=...   - Récupère le profil d'un conducteur
POST   /api/users/admin/conducteurs              - Crée un nouveau conducteur (ADMIN)
PUT    /api/users/conducteur/profile?email=...   - Met à jour un conducteur
DELETE /api/users/admin/conducteurs/{id}         - Supprime un conducteur (ADMIN)
PUT    /api/users/admin/conducteurs/{id}/activer - Active un conducteur (ADMIN)
DELETE /api/users/admin/conducteurs/{id}/desactiver - Désactive un conducteur (ADMIN)
```

**Format des données**:
```json
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "prenom": "string",
  "nom": "string",
  "telephone": "string",
  "numeroPermis": "string",
  "actif": boolean,
  "createdAt": "ISO-8601 date"
}
```

## 2. Gestion des Bus

### Frontend
**Fichier**: `frontend/src/services/trajet/pages/gestion_bus/BusesManagement.jsx`

**Fonctionnalités**:
- ✅ Liste tous les bus (ADMIN)
- ✅ Ajouter un nouveau bus
- ✅ Modifier un bus existant
- ✅ Supprimer un bus
- ✅ Affichage du statut (Actif/Inactif)
- ✅ Gestion des états de chargement
- ✅ Messages d'erreur et de succès

### Service Frontend
**Fichier**: `frontend/src/services/trajet/configurationService.js`

**Méthodes disponibles** (busService):
```javascript
// Récupérer tous les bus
busService.getAllBuses()

// Récupérer un bus par ID
busService.getBusById(busId)

// Créer un nouveau bus
busService.createBus({
  numeroImmatriculation: string,
  modele: string,
  capacite: number
})

// Mettre à jour un bus
busService.updateBus(busId, {
  numeroImmatriculation: string,
  modele: string,
  capacite: number
})

// Supprimer un bus
busService.deleteBus(busId)
```

### Backend - Trajet Service
**Contrôleur**: `backend/trajet-service/src/main/java/com/wasalny/trajet/controller/BusController.java`

**Endpoints API**:
```
GET    /api/trajets/buses                        - Liste tous les bus actifs (ADMIN, CONDUCTEUR)
GET    /api/trajets/buses/{id}                   - Récupère un bus par ID (ADMIN, CONDUCTEUR)
GET    /api/trajets/buses/immatriculation/{num}  - Récupère un bus par immatriculation
POST   /api/trajets/buses                        - Crée un nouveau bus (ADMIN)
PUT    /api/trajets/buses/{id}                   - Met à jour un bus (ADMIN)
DELETE /api/trajets/buses/{id}                   - Supprime un bus (ADMIN)
PUT    /api/trajets/buses/{id}/activer           - Active un bus (ADMIN)
PUT    /api/trajets/buses/{id}/desactiver        - Désactive un bus (ADMIN)
```

**Format des données**:
```json
{
  "id": "uuid",
  "numeroImmatriculation": "string",
  "modele": "string",
  "capacite": number,
  "actif": boolean,
  "createdAt": "ISO-8601 date"
}
```

## 3. Assignation Bus-Conducteur

### Service Frontend
**Fichier**: `frontend/src/services/trajet/busAssignmentService.js`

**Méthodes disponibles**:
```javascript
// Assigner un bus à une ligne
busAssignmentService.assignBus({
  busId: string (UUID),
  ligneId: string (UUID),
  stationDepartId: string (UUID)
})

// Récupérer les assignations par ligne
busAssignmentService.getAssignmentsByLine(ligneId)

// Désactiver une assignation
busAssignmentService.deactivateAssignment(assignmentId)
```

### Backend - Trajet Service
**Contrôleur**: `backend/trajet-service/src/main/java/com/wasalny/trajet/controller/BusAssignmentController.java`

**Endpoints API**:
```
POST   /api/trajets/bus-assignments              - Assigne un bus (ADMIN)
GET    /api/trajets/bus-assignments/ligne/{id}   - Récupère les assignations d'une ligne
PUT    /api/trajets/bus-assignments/{id}/desactiver - Désactive une assignation (ADMIN)
```

**Format des données**:
```json
{
  "id": "uuid",
  "busId": "uuid",
  "ligneId": "uuid",
  "stationDepartId": "uuid",
  "actif": boolean,
  "createdAt": "ISO-8601 date"
}
```

## 4. Configuration et Sécurité

### Variables d'environnement
```javascript
// Frontend (.env)
VITE_API_GATEWAY_URL=http://localhost:8080
```

### Authentification
Tous les appels API utilisent le token JWT stocké dans le localStorage:
```javascript
Authorization: Bearer <token>
```

### Intercepteurs Axios
Les services frontend incluent des intercepteurs pour:
- Ajouter automatiquement le token JWT aux requêtes
- Gérer les erreurs 401 (redirection vers /auth)
- Gérer les erreurs génériques

## 5. Gestion des Erreurs

### Messages d'erreur
Les erreurs backend sont formatées comme suit:
```json
{
  "error": "ERROR_CODE",
  "message": "Description de l'erreur",
  "details": {...}
}
```

### Codes d'erreur communs
- `400` - Mauvaise requête (validation échouée)
- `401` - Non authentifié
- `403` - Accès refusé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## 6. Workflow complet

### Créer un conducteur
```
1. Admin clique sur "Ajouter Conducteur"
2. Remplit le formulaire (nom, email, mot de passe, etc.)
3. Frontend valide les champs
4. Appel à driversService.createDriver()
5. Backend (user-service):
   a. Crée un compte utilisateur via auth-service
   b. Crée le profil conducteur
   c. Retourne le conducteur créé
6. Frontend affiche un message de succès
7. Recharge la liste des conducteurs
```

### Créer un bus
```
1. Admin clique sur "Ajouter Bus"
2. Remplit le formulaire (immatriculation, modèle, capacité)
3. Frontend valide les champs
4. Appel à busService.createBus()
5. Backend (trajet-service):
   a. Valide les données
   b. Crée le bus dans la base de données
   c. Retourne le bus créé
6. Frontend affiche un message de succès
7. Recharge la liste des bus
```

### Assigner un bus à une ligne
```
1. Admin sélectionne un bus, une ligne, et une station de départ
2. Appel à busAssignmentService.assignBus()
3. Backend (trajet-service):
   a. Vérifie que le bus et la ligne existent
   b. Vérifie que le bus n'est pas déjà assigné
   c. Crée l'assignation
   d. Retourne l'assignation créée
4. Frontend affiche un message de succès
```

## 7. Structure des fichiers

```
frontend/
├── src/
│   ├── services/
│   │   ├── user/
│   │   │   ├── driversService.js          ← Service API conducteurs
│   │   │   └── gestion_conducteur/
│   │   │       ├── DriversManagement.jsx  ← Page de gestion
│   │   │       └── DriversManagement.css
│   │   └── trajet/
│   │       ├── configurationService.js    ← Service API trajets/bus
│   │       ├── busAssignmentService.js    ← Service API assignations
│   │       └── pages/
│   │           └── gestion_bus/
│   │               ├── BusesManagement.jsx  ← Page de gestion
│   │               └── BusesManagement.css
│   └── App.jsx                            ← Routes principales

backend/
├── user-service/
│   └── src/main/java/com/wasalny/user/
│       └── controller/
│           └── ConducteurController.java  ← API conducteurs
└── trajet-service/
    └── src/main/java/com/wasalny/trajet/
        └── controller/
            ├── BusController.java         ← API bus
            └── BusAssignmentController.java ← API assignations
```

## 8. Tests

### Tester l'API des conducteurs
```bash
# Liste tous les conducteurs
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/users/admin/conducteurs

# Créer un conducteur
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "driver1",
    "email": "driver1@test.com",
    "password": "<REDACTED>",
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "+212600000000",
    "numeroPermis": "ABC123"
  }' \
  http://localhost:8080/api/users/admin/conducteurs
```

### Tester l'API des bus
```bash
# Liste tous les bus
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/trajets/buses

# Créer un bus
curl -X POST -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroImmatriculation": "AB-123456",
    "modele": "Mercedes Sprinter",
    "capacite": 50
  }' \
  http://localhost:8080/api/trajets/buses
```

## 9. Points importants

### Permissions
- **ADMIN**: Peut tout faire (CRUD complet)
- **CONDUCTEUR**: Peut consulter les bus et ses assignations
- **CLIENT**: Pas d'accès aux pages de gestion

### Validation
- Frontend: Validation des champs obligatoires
- Backend: Validation avec annotations Jakarta Bean Validation
- Email: Format valide requis
- Capacité bus: Doit être > 0

### État des données
- Les conducteurs et bus ont un état `actif` (boolean)
- La suppression logique est préférée à la suppression physique
- Les assignations peuvent être désactivées

## 10. Améliorations futures

- [ ] Pagination pour les listes longues
- [ ] Filtres et recherche
- [ ] Export des données (CSV, PDF)
- [ ] Historique des modifications
- [ ] Assignation automatique bus-conducteur
- [ ] Notification lors de l'assignation
- [ ] Dashboard avec statistiques

## Support

Pour toute question ou problème:
1. Vérifier les logs backend (Docker logs)
2. Vérifier la console navigateur (F12)
3. Vérifier que l'authentification fonctionne
4. Vérifier que tous les services sont démarrés
