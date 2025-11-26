# 🚍 Wasalny - Plateforme de Transport Intelligente

Wasalny est une plateforme de transport public moderne construite sur une architecture microservices, offrant des services de planification de trajets, de géolocalisation en temps réel, de paiement et de gestion d'abonnements.

---

## 📋 Table des Matières

- [Architecture du Projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Démarrage du Système](#démarrage-du-système)
- [Vérification du Démarrage](#vérification-du-démarrage)
- [Accès aux Services](#accès-aux-services)
- [Configuration Postman](#configuration-postman)
- [Gestion des Services](#gestion-des-services)
- [Dépannage](#dépannage)

---

## 🏗️ Architecture du Projet

### Services d'Infrastructure

| Service | Port | Description |
|---------|------|-------------|
| **Eureka Server** | 8761 | Registre de services pour la découverte dynamique |
| **Config Server** | 8888 | Gestion centralisée de la configuration |
| **API Gateway** | 8080 | Point d'entrée unique pour toutes les requêtes |

### Microservices Métier

| Service | Port | Fonction |
|---------|------|----------|
| **Auth Service** | 8086 | Authentification et gestion JWT |
| **User Service** | 8083 | Gestion des profils utilisateurs |
| **Trajet Service** | 8081 | Planification des trajets |
| **Geolocalisation Service** | 8084 | Suivi de localisation en temps réel |
| **Paiement Service** | 8082 | Traitement des paiements |
| **Ticket Service** | 8085 | Émission et validation des tickets |
| **Abonnement Service** | 8087 | Gestion des abonnements |
| **Notification Service** | 8088 | Notifications multi-canaux |

### Infrastructure de Support

| Composant | Ports | Description |
|-----------|-------|-------------|
| **PostgreSQL** | 5432-5439 | 8 bases de données dédiées (une par service) |
| **Redis** | 6379 | Cache distribué |
| **RabbitMQ** | 5672, 15672 | Message broker pour communication asynchrone |
| **Frontend React** | 3000 | Interface utilisateur |

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 1.29 ou supérieure)
- Au moins **8 GB de RAM** disponible pour Docker
- **Ports disponibles** : 3000, 5432-5439, 5672, 6379, 8080-8088, 8761, 8888, 15672

---

## 📦 Installation

### 1. Cloner le Projet

```bash
git clone <votre-repository-url>
cd wasalny
```

### 2. Vérifier les Ports Disponibles

```bash
# Vérifier que les ports nécessaires sont libres
netstat -an | grep -E ":(3000|5432|5672|6379|8080|8761|8888|15672)"
```

---

## 🚀 Démarrage du Système

### Option A : Démarrage Simple (Recommandé)

Pour démarrer tous les services en une seule commande :

```bash
# Démarrer tous les services
docker-compose up -d

# Surveiller les logs
docker-compose logs -f
```

### Option B : Démarrage Progressif (Pour le Debugging)

Pour un démarrage contrôlé avec surveillance :

```bash
# 1. Démarrer l'infrastructure de données
docker-compose up -d postgres-auth postgres-user postgres-trajet postgres-geo \
  postgres-paiement postgres-ticket postgres-abonnement postgres-notification \
  rabbitmq redis

# Attendre 30 secondes
sleep 30

# 2. Démarrer Eureka Server
docker-compose up -d eureka-server

# Attendre 3 minutes (Eureka prend du temps à démarrer)
sleep 180

# 3. Démarrer Config Server
docker-compose up -d config-server

# Attendre 1 minute
sleep 60

# 4. Démarrer API Gateway et tous les microservices
docker-compose up -d api-gateway auth-service user-service trajet-service \
  geolocalisation-service paiement-service ticket-service \
  abonnement-service notification-service

# 5. Démarrer le Frontend
docker-compose up -d frontend
```

---

## ✅ Vérification du Démarrage

### Vérifier l'État des Services

```bash
# Voir l'état de tous les conteneurs
docker-compose ps

# Vérifier les logs d'un service spécifique
docker-compose logs -f <nom-du-service>
```

### Vérifier Eureka Server

```bash
# Via curl
curl http://localhost:8761/actuator/health

# Ou ouvrir dans le navigateur
http://localhost:8761
```

Tous les microservices doivent apparaître comme "UP" dans le dashboard Eureka.

---

## 🌐 Accès aux Services

### Dashboards et Interfaces Web

| Service | URL | Identifiants |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | - |
| **API Gateway** | http://localhost:8080 | - |
| **Eureka Dashboard** | http://localhost:8761 | - |
| **RabbitMQ Management** | http://localhost:15672 | admin / admin |
| **Config Server** | http://localhost:8888 | - |

### Accès aux Microservices

#### URLs Directes (Développement uniquement)

| Service | URL Directe | URL Via API Gateway |
|---------|-------------|---------------------|
| Auth Service | http://localhost:8086 | http://localhost:8080/api/auth |
| User Service | http://localhost:8083 | http://localhost:8080/api/users |
| Trajet Service | http://localhost:8081 | http://localhost:8080/api/trajets |
| Geolocalisation Service | http://localhost:8084 | http://localhost:8080/api/locations |
| Paiement Service | http://localhost:8082 | http://localhost:8080/api/paiements |
| Ticket Service | http://localhost:8085 | http://localhost:8080/api/tickets |
| Abonnement Service | http://localhost:8087 | http://localhost:8080/api/abonnements |
| Notification Service | http://localhost:8088 | http://localhost:8080/api/notifications |

> **Note** : En production, utilisez toujours l'API Gateway pour accéder aux microservices.

### Accès aux Bases de Données

Utilisez un client PostgreSQL (DBeaver, pgAdmin, psql) avec ces paramètres :

| Base de Données | Host | Port | Database | User | Password |
|-----------------|------|------|----------|------|----------|
| Auth DB | localhost | 5437 | auth_db | wasalny_user | wasalny_password |
| User DB | localhost | 5434 | user_db | wasalny_user | wasalny_password |
| Trajet DB | localhost | 5432 | trajet_db | wasalny_user | wasalny_password |
| Geo DB | localhost | 5435 | geolocalisation_db | wasalny_user | wasalny_password |
| Paiement DB | localhost | 5433 | paiement_db | wasalny_user | wasalny_password |
| Ticket DB | localhost | 5436 | ticket_db | wasalny_user | wasalny_password |
| Abonnement DB | localhost | 5438 | abonnement_db | wasalny_user | wasalny_password |
| Notification DB | localhost | 5439 | notification_db | wasalny_user | wasalny_password |

#### Exemple de connexion avec psql

```bash
psql -h localhost -p 5437 -U wasalny_user -d auth_db
```

---

## 🧪 Configuration Postman

### 1. Créer un Environnement Postman

Créez un nouvel environnement avec les variables suivantes :

| Variable | Valeur Initiale | Description |
|----------|-----------------|-------------|
| `base_url` | http://localhost:8080 | URL de l'API Gateway |
| `auth_token` | `{{jwt_token}}` | Token JWT (sera rempli après connexion) |

### 2. Exemple de Requêtes

#### Authentification

```http
POST {{base_url}}/api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

#### Utiliser le Token JWT

```http
GET {{base_url}}/api/users/profile
Authorization: Bearer {{auth_token}}
```

---

## 🔄 Gestion des Services

### Arrêter les Services

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### Redémarrer un Service Spécifique

```bash
# Redémarrer un service
docker-compose restart <nom-du-service>

# Exemple
docker-compose restart auth-service
```

### Voir les Logs

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f <nom-du-service>

# Dernières 100 lignes
docker-compose logs --tail=100 <nom-du-service>
```

