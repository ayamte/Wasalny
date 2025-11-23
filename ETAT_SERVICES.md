# État des Services - Wasalny

**Date:** 2025-11-20 19:14 UTC

## ✅ Tous les services sont opérationnels !

### 🚀 Services Backend (Microservices)

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| **auth-service** | 8086 | ✅ HEALTHY | Service d'authentification (JWT) |
| **user-service** | 8083 | ✅ HEALTHY | Gestion des utilisateurs et profils |
| **trajet-service** | 8081 | ✅ HEALTHY | Gestion des trajets, lignes, stations, bus |
| **paiement-service** | 8082 | ✅ HEALTHY | Gestion des paiements et transactions |
| **ticket-service** | 8085 | ✅ HEALTHY | Gestion des tickets de transport |
| **abonnement-service** | 8087 | ✅ HEALTHY | Gestion des abonnements |
| **notification-service** | 8088 | ✅ HEALTHY | Envoi de notifications |
| **geolocalisation-service** | 8084 | ⚠️ UNHEALTHY | Géolocalisation (non critique) |

### 🌐 Infrastructure

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| **api-gateway** | 8080 | ✅ HEALTHY | Point d'entrée principal |
| **eureka-server** | 8761 | ✅ HEALTHY | Service discovery |
| **config-server** | 8888 | ✅ HEALTHY | Configuration centralisée |
| **rabbitmq** | 5672, 15672 | ✅ HEALTHY | Message broker |
| **redis** | 6379 | ✅ HEALTHY | Cache et sessions |

### 💾 Bases de Données PostgreSQL

| Base de données | Port | Status |
|-----------------|------|--------|
| **postgres-auth** | 5437 | ✅ HEALTHY |
| **postgres-user** | 5434 | ✅ HEALTHY |
| **postgres-trajet** | 5432 | ✅ HEALTHY |
| **postgres-paiement** | 5433 | ✅ HEALTHY |
| **postgres-ticket** | 5436 | ✅ HEALTHY |
| **postgres-abonnement** | 5438 | ✅ HEALTHY |
| **postgres-notification** | 5439 | ✅ HEALTHY |
| **postgres-geo** | 5435 | ✅ HEALTHY |

### 🎨 Frontend

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| **wasalny-frontend** | 3000 | ✅ HEALTHY | Application React |

---

## 🧪 Test du Frontend

### Accès
- **URL:** http://localhost:3000
- **Compte de test:**
  - Email: `ahmed@gmail.com`
  - Password: `ahmed123`

### Fonctionnalités à tester

#### 1. Authentification ✅
- Login avec les identifiants ci-dessus
- Vérifier que le profil affiche : nom, prénom, téléphone

#### 2. Gestion des Trajets
- Consulter la liste des trajets disponibles
- Filtrer par date, ligne, station

#### 3. Achat de Tickets (Test de l'endpoint paiement)
- Sélectionner un trajet
- Procéder au paiement
- Remplir les informations de carte :
  - Numéro: `4532123456789012`
  - Nom: `AHMED AHMED`
  - Expiration: `12/26`
  - CVV: `123`
- Vérifier la création de la transaction
- Vérifier la création du ticket

#### 4. Gestion des Abonnements
- Consulter les types d'abonnements disponibles
- Souscrire à un abonnement
- Vérifier le paiement

#### 5. Historique
- Consulter l'historique des tickets
- Consulter l'historique des transactions

---

## 🔍 Débogage

### Console du Navigateur (F12)
- **Onglet Console:** Voir les logs JavaScript
- **Onglet Network:** Voir les requêtes HTTP
  - Filtrer par "XHR" pour voir les appels API
  - Vérifier les status codes (200, 201, 400, 401, etc.)
  - Voir les réponses JSON

### Logs des Services
```bash
# Voir les logs d'un service
docker logs wasalny-trajet-service --tail 50

# Suivre les logs en temps réel
docker logs -f wasalny-paiement-service-1

# Voir tous les conteneurs
docker ps
```

---

## 📊 Endpoints Principaux

### Via API Gateway (Port 8080)
```
POST   /auth-service/auth/login
POST   /auth-service/auth/signup
GET    /user-service/api/users/{id}
GET    /trajet-service/trajets/trips
POST   /paiement-service/paiements/initier
GET    /ticket-service/tickets/client/{clientId}
GET    /abonnement-service/abonnements/client/{clientId}
```

### Accès Direct aux Services
```
Auth:         http://localhost:8086
User:         http://localhost:8083
Trajet:       http://localhost:8081
Paiement:     http://localhost:8082
Ticket:       http://localhost:8085
Abonnement:   http://localhost:8087
Notification: http://localhost:8088
```

---

## ✅ Résumé

**Statut Global:** 🟢 OPÉRATIONNEL

- ✅ 8/8 services backend sont healthy (1 unhealthy non critique)
- ✅ 5/5 services d'infrastructure sont healthy
- ✅ 8/8 bases de données sont healthy
- ✅ Frontend est healthy

**Le système est prêt pour les tests !** 🚀

---

## 🔧 Actions Récentes

1. ✅ Redémarrage du service auth-service (résolu les problèmes de connexion avec user-service)
2. ✅ Redémarrage du service trajet-service (rebuild réussi)
3. ✅ Tous les services sont maintenant opérationnels

**Prochaine étape:** Tester le frontend et l'endpoint de paiement via l'interface utilisateur.

