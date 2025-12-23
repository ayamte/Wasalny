# 📋 Résumé Détaillé du Projet Wasalny

## 🎯 Vue d'Ensemble

**Wasalny** est une application de gestion de transport en commun (système de bus) basée sur une architecture microservices. Le projet permet la gestion complète des trajets, des tickets, des paiements, des abonnements, et offre un suivi en temps réel de la géolocalisation des bus.

---

## 🏗️ Architecture Technique

### Stack Technologique

**Backend :**
- **Framework** : Spring Boot (Java)
- **Architecture** : Microservices avec Spring Cloud
- **Service Discovery** : Eureka Server
- **API Gateway** : Spring Cloud Gateway (port 8080)
- **Configuration Centralisée** : Spring Cloud Config Server (port 8888)
- **Base de données** : PostgreSQL 15 (8 bases de données distinctes)
- **Cache** : Redis
- **Message Broker** : RabbitMQ
- **Sécurité** : JWT (JSON Web Tokens)
- **Communication** : REST API, WebSocket (STOMP), Feign Client

**Frontend :**
- **Framework** : React 18.2.0
- **Build Tool** : Vite 5.0.8
- **Routing** : React Router DOM 6.20.0
- **HTTP Client** : Axios 1.6.2
- **Cartes** : Leaflet 1.9.4 + React Leaflet 4.2.1
- **WebSocket** : SockJS + STOMP.js
- **Styling** : Tailwind CSS 3.3.6
- **Icons** : Lucide React

**Infrastructure :**
- **Orchestration** : Docker Compose
- **Conteneurisation** : Docker
- **Réseau** : Bridge network (`wasalny-network`)

---

## 🔧 Microservices

### 1. **Auth Service** (Port 8086)
- **Responsabilité** : Authentification et autorisation
- **Base de données** : `auth_db` (PostgreSQL, port 5437)
- **Fonctionnalités** :
  - Login/Logout
  - Génération et validation de tokens JWT
  - Gestion des rôles (ADMIN, CLIENT, CONDUCTEUR)
  - Envoi d'emails (support email)
- **Dépendances** : Redis (cache), PostgreSQL

### 2. **User Service** (Port 8083)
- **Responsabilité** : Gestion des profils utilisateurs
- **Base de données** : `user_db` (PostgreSQL, port 5434)
- **Fonctionnalités** :
  - CRUD des utilisateurs
  - Gestion des profils (Client, Conducteur, Admin)
  - Informations des conducteurs (permis, statut, etc.)
- **Dépendances** : Redis, PostgreSQL, Eureka, Config Server

### 3. **Trajet Service** (Port 8081)
- **Responsabilité** : Gestion des trajets, bus, lignes, stations
- **Base de données** : `trajet_db` (PostgreSQL, port 5432)
- **Fonctionnalités principales** :
  - **Gestion des Bus** : CRUD, assignation aux lignes et conducteurs
  - **Gestion des Lignes** : Création, modification, stations
  - **Gestion des Stations** : CRUD, coordonnées GPS
  - **Gestion des Trips** : Génération automatique basée sur les configurations horaires
  - **Configuration Horaires** : Définition des horaires de départ, fréquences
  - **Assignations** :
    - Bus ↔ Ligne (avec stations de départ/arrivée)
    - Bus ↔ Conducteur (avec dates de validité)
  - **Gestion des Passages** : Confirmation des passages aux stations par les conducteurs
  - **Statuts des Trips** : PLANIFIE → EN_COURS → TERMINE
- **Endpoints clés** :
  - `GET /trajets/buses/assigned` - Bus assigné au conducteur
  - `GET /trajets/trips/assigned` - Trip assigné pour aujourd'hui
  - `POST /trajets/trips/{id}/demarrer` - Démarrer un trip
  - `POST /trajets/trips/{id}/confirmer-passage` - Confirmer passage à une station
  - `POST /trajets/trips/{id}/terminer` - Terminer un trip
- **Dépendances** : PostgreSQL, Eureka, Config Server, Geolocalisation Service

### 4. **Geolocalisation Service** (Port 8084)
- **Responsabilité** : Suivi en temps réel de la position des bus
- **Base de données** : `geolocalisation_db` (PostgreSQL, port 5435)
- **Fonctionnalités** :
  - Enregistrement des positions GPS des bus
  - WebSocket (STOMP) pour la diffusion en temps réel
  - Topic : `/topic/bus/{busId}/location`
  - Endpoint WebSocket : `/ws`
- **Dépendances** : PostgreSQL, Redis, Eureka, Config Server

### 5. **Paiement Service** (Port 8082)
- **Responsabilité** : Gestion des transactions de paiement
- **Base de données** : `paiement_db` (PostgreSQL, port 5433)
- **Fonctionnalités** :
  - Initiation de paiements
  - Traitement des transactions
  - Types de paiement : CARTE_BANCAIRE, MOBILE_MONEY, ESPECES
  - Types de service : ACHAT_TICKET, ABONNEMENT
  - Validation des cartes bancaires
  - Publication d'événements via RabbitMQ
  - Statuts : EN_ATTENTE → REUSSIE/ECHOUEE
- **Endpoints clés** :
  - `POST /paiements/initier` - Initier un paiement
  - `POST /paiements/{id}/traiter` - Traiter une transaction
- **Dépendances** : PostgreSQL, RabbitMQ, Redis, Eureka, Config Server

### 6. **Ticket Service** (Port 8085)
- **Responsabilité** : Gestion des tickets de transport
- **Base de données** : `ticket_db` (PostgreSQL, port 5436)
- **Fonctionnalités** :
  - Création de tickets après paiement réussi
  - Gestion des statuts des tickets
  - Association ticket ↔ trip
  - Écoute des événements de paiement via RabbitMQ
- **Dépendances** : PostgreSQL, RabbitMQ, Eureka, Config Server

### 7. **Abonnement Service** (Port 8087)
- **Responsabilité** : Gestion des abonnements
- **Base de données** : `abonnement_db` (PostgreSQL, port 5438)
- **Fonctionnalités** :
  - Création et gestion des abonnements
  - Écoute des événements de paiement via RabbitMQ
- **Dépendances** : PostgreSQL, RabbitMQ, Eureka, Config Server

### 8. **Notification Service** (Port 8088)
- **Responsabilité** : Gestion des notifications
- **Base de données** : `notification_db` (PostgreSQL, port 5439)
- **Fonctionnalités** :
  - Envoi de notifications aux utilisateurs
  - Écoute des événements via RabbitMQ
- **Dépendances** : PostgreSQL, RabbitMQ, Eureka, Config Server

---

## 🌐 Infrastructure

### API Gateway (Port 8080)
- Point d'entrée unique pour tous les microservices
- Routage des requêtes vers les services appropriés
- Gestion de l'authentification JWT
- Routes configurées pour chaque service

### Eureka Server (Port 8761)
- Service discovery pour tous les microservices
- Enregistrement automatique des services au démarrage
- Health checks

### Config Server (Port 8888)
- Configuration centralisée pour tous les services
- Fichiers de configuration par service dans `/infrastructure/config-server/src/main/resources/config/`

### Frontend (Port 3000)
- Application React servie via Nginx
- Communication avec l'API Gateway sur `http://localhost:8080`
- Interface utilisateur pour :
  - Clients : Achat de tickets, suivi des trajets, géolocalisation en temps réel
  - Conducteurs : Dashboard, gestion des trips, confirmation des passages
  - Admins : Gestion des bus, lignes, stations, assignations, configurations

---

## 🗄️ Bases de Données

Chaque microservice possède sa propre base de données PostgreSQL :

1. **auth_db** (port 5437) - Authentification
2. **user_db** (port 5434) - Utilisateurs
3. **trajet_db** (port 5432) - Trajets, bus, lignes, stations, trips
4. **geolocalisation_db** (port 5435) - Positions GPS
5. **paiement_db** (port 5433) - Transactions
6. **ticket_db** (port 5436) - Tickets
7. **abonnement_db** (port 5438) - Abonnements
8. **notification_db** (port 5439) - Notifications

**Pattern** : Database per Service (microservices pattern)

---

## 🔐 Sécurité

- **JWT** : Tokens pour l'authentification
- **Rôles** : ADMIN, CLIENT, CONDUCTEUR
- **Spring Security** : Protection des endpoints
- **@PreAuthorize** : Contrôle d'accès basé sur les rôles
- **Secret JWT** : Configurable via variables d'environnement

---

## 📡 Communication Inter-Services

### Synchronous
- **REST API** : Appels HTTP directs
- **Feign Client** : Communication déclarative entre services
- **API Gateway** : Routage centralisé

### Asynchronous
- **RabbitMQ** : Messages asynchrones pour :
  - Événements de paiement → Ticket Service, Abonnement Service, Notification Service
- **WebSocket (STOMP)** : Géolocalisation en temps réel
  - Topic : `/topic/bus/{busId}/location`
  - Connexion : `ws://localhost:8084/ws`

---

## 🚀 Démarrage de l'Application

### Via Docker Compose
```bash
docker-compose up -d
```

### Services démarrés dans l'ordre :
1. Bases de données PostgreSQL (8 instances)
2. Redis
3. RabbitMQ
4. Eureka Server
5. Config Server
6. API Gateway
7. Microservices (Auth, User, Trajet, Geolocalisation, Paiement, Ticket, Abonnement, Notification)
8. Frontend

### Ports exposés :
- Frontend : 3000
- API Gateway : 8080
- Eureka : 8761
- Config Server : 8888
- RabbitMQ Management : 15672
- Services : 8081-8088

---

## 👥 Rôles et Fonctionnalités

### ADMIN
- Gestion complète des bus (CRUD)
- Gestion des lignes et stations
- Assignation bus ↔ ligne ↔ conducteur
- Configuration des horaires
- Génération automatique des trips
- Vue d'ensemble du système

### CONDUCTEUR
- Dashboard avec bus assigné
- Visualisation des trips du jour
- Démarrage/arrêt des trips
- Confirmation des passages aux stations
- Mise à jour de la position GPS du bus
- Suivi du statut du trip (PLANIFIE → EN_COURS → TERMINE)

### CLIENT
- Recherche de trajets
- Achat de tickets
- Achat d'abonnements
- Suivi des trajets en temps réel (géolocalisation)
- Historique des trajets ("Mes Trajets")
- Calcul de l'ETA (Estimated Time of Arrival)
- Visualisation sur carte Leaflet

---

## 🔄 Flux de Données Principaux

### 1. Achat de Ticket
```
CLIENT → API Gateway → Paiement Service (initier)
  → Paiement Service (traiter)
  → RabbitMQ (événement paiement réussi)
  → Ticket Service (créer ticket)
  → Notification Service (notifier client)
```

### 2. Démarrage d'un Trip
```
CONDUCTEUR → API Gateway → Trajet Service (démarrer trip)
  → Trajet Service (confirmer première station)
  → Geolocalisation Service (mettre à jour position)
  → WebSocket (broadcast position)
  → Frontend CLIENT (mise à jour carte en temps réel)
```

### 3. Confirmation de Passage
```
CONDUCTEUR → API Gateway → Trajet Service (confirmer passage)
  → Geolocalisation Service (mettre à jour position)
  → WebSocket (broadcast nouvelle position)
  → Frontend CLIENT (mise à jour ETA)
```

---

## 📁 Structure du Projet

```
wasalny/
├── backend/
│   ├── auth-service/
│   ├── user-service/
│   ├── trajet-service/
│   ├── geolocalisation-service/
│   ├── paiement-service/
│   ├── ticket-service/
│   ├── abonnement-service/
│   └── notification-service/
├── frontend/
│   ├── src/
│   │   ├── components/        # Composants React
│   │   ├── services/          # Services API
│   │   ├── commun/            # Composants communs
│   │   └── utils/             # Utilitaires
│   ├── public/
│   └── package.json
├── infrastructure/
│   ├── api-gateway/
│   ├── config-server/
│   └── eureka-server/
├── docker-compose.yml
├── test-paiement.ps1           # Script de test PowerShell
└── Documentation/
    ├── TEST_APPLICATION_GUIDE.md
    ├── GUIDE_TEST_MES_TRAJETS.md
    └── TEST_ASSIGNATION_BUS.md
```

---

## 🧪 Tests et Scripts

### Scripts de Test Disponibles
- `test-paiement.ps1` : Test complet du flux de paiement
- `test-paiement-direct.ps1` : Test direct du service de paiement
- `test-paiement-endpoint.http` : Requêtes HTTP pour tester

### Comptes de Test
- **Admin** : `asmahm8888@gmail.com`
- **Conducteur** : `nouveau.conducteur@wasalny.com` / `test`
- **Client** : `ahmed@gmail.com` / `ahmed123`

---

## 🎯 Fonctionnalités Clés Implémentées

### ✅ Backend
- Architecture microservices complète
- Service discovery avec Eureka
- Configuration centralisée
- API Gateway avec routage
- Authentification JWT
- Communication asynchrone (RabbitMQ)
- WebSocket pour temps réel
- 8 bases de données isolées
- Cache Redis

### ✅ Frontend
- Interface React moderne
- Dashboard conducteur
- Suivi géolocalisation en temps réel
- Cartes interactives (Leaflet)
- Calcul ETA
- Gestion des tickets
- Interface admin complète
- Responsive design

### ✅ Fonctionnalités Métier
- Gestion complète des bus
- Planification automatique des trips
- Assignation bus-conducteur
- Confirmation des passages
- Achat de tickets
- Paiements multiples (carte, mobile money, espèces)
- Abonnements
- Notifications
- Géolocalisation temps réel

---

## 🔧 Configuration

### Variables d'Environnement Principales
- `JWT_SECRET` : Secret pour la signature JWT
- `JWT_EXPIRATION` : Durée de validité des tokens (défaut: 86400000ms)
- `REDIS_PASSWORD` : Mot de passe Redis
- `RABBITMQ_USER` / `RABBITMQ_PASSWORD` : Credentials RabbitMQ
- `SUPPORT_EMAIL` / `APP_PASSWORD` : Configuration email

### Ports par Service
- Frontend : 3000
- API Gateway : 8080
- Trajet Service : 8081
- Paiement Service : 8082
- User Service : 8083
- Geolocalisation Service : 8084
- Ticket Service : 8085
- Auth Service : 8086
- Abonnement Service : 8087
- Notification Service : 8088
- Eureka : 8761
- Config Server : 8888
- RabbitMQ : 5672 (AMQP), 15672 (Management)
- Redis : 6379

---

## 📊 État Actuel du Projet

### ✅ Fonctionnel
- Tous les microservices sont opérationnels
- Communication inter-services fonctionnelle
- Frontend connecté au backend
- Tests de paiement validés
- Géolocalisation en temps réel opérationnelle
- Dashboard conducteur fonctionnel

### 📝 Documentation Disponible
- Guide de test de l'application
- Guide de test de géolocalisation
- Guide de test d'assignation bus
- Scripts de test PowerShell

---

## 🎓 Technologies et Patterns Utilisés

- **Microservices Architecture** : Séparation des responsabilités
- **Database per Service** : Isolation des données
- **API Gateway Pattern** : Point d'entrée unique
- **Service Discovery** : Eureka pour la découverte automatique
- **Configuration Management** : Config Server centralisé
- **Event-Driven Architecture** : RabbitMQ pour les événements
- **CQRS-like** : Séparation lecture/écriture
- **JWT Authentication** : Authentification stateless
- **WebSocket** : Communication temps réel
- **Docker Compose** : Orchestration des services

---

## 🚧 Points d'Attention

1. **WebSocket** : Actuellement configuré pour `localhost:8084` en développement. En production, passer par l'API Gateway.
2. **Redis Warnings** : Certains warnings Redis peuvent apparaître mais ne sont pas critiques.
3. **Health Checks** : Tous les services ont des health checks configurés.
4. **Dépendances** : Les services démarrent dans un ordre spécifique basé sur les `depends_on` dans docker-compose.

---

## 📞 Support et Documentation

- Documentation technique dans les fichiers `.md`
- Scripts de test pour validation
- Logs Docker disponibles via `docker logs <container-name>`
- Eureka Dashboard : http://localhost:8761
- RabbitMQ Management : http://localhost:15672

---

**Date de création du résumé** : 2025-01-27  
**Version du projet** : 1.0  
**Statut** : ✅ Opérationnel et prêt pour développement/amélioration


