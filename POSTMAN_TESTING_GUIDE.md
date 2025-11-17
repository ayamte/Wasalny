# Guide de Test des Services avec Postman

## Services Actifs

Tous les services suivants sont maintenant actifs et prêts à être testés :

### Infrastructure
- **Eureka Server**: http://localhost:8761
- **Config Server**: http://localhost:8888
- **API Gateway**: http://localhost:8080

### Services Métier
- **Auth Service**: Port 8086 (via Gateway: http://localhost:8080/auth-service)
- **User Service**: Port 8083 (via Gateway: http://localhost:8080/user-service)
- **Ticket Service**: Port 8085 (via Gateway: http://localhost:8080/ticket-service)
- **Paiement Service**: Port 8082 (via Gateway: http://localhost:8080/paiement-service)

## Accès via API Gateway

Toutes les requêtes doivent passer par l'API Gateway à `http://localhost:8080`

### Routes disponibles

#### Auth Service
```
POST   http://localhost:8080/auth-service/api/auth/signup/client
POST   http://localhost:8080/auth-service/api/auth/signup/driver
POST   http://localhost:8080/auth-service/api/auth/login
POST   http://localhost:8080/auth-service/api/auth/verify-email
POST   http://localhost:8080/auth-service/api/auth/resend-verification
POST   http://localhost:8080/auth-service/api/auth/forgot-password
POST   http://localhost:8080/auth-service/api/auth/reset-password
POST   http://localhost:8080/auth-service/api/auth/logout
GET    http://localhost:8080/auth-service/actuator/health
```

#### User Service
```
GET    http://localhost:8080/user-service/api/users/me
PUT    http://localhost:8080/user-service/api/users/me
GET    http://localhost:8080/user-service/api/users/{id}
GET    http://localhost:8080/user-service/actuator/health
```

#### Ticket Service
```
POST   http://localhost:8080/ticket-service/api/tickets
GET    http://localhost:8080/ticket-service/api/tickets
GET    http://localhost:8080/ticket-service/api/tickets/{id}
PUT    http://localhost:8080/ticket-service/api/tickets/{id}/validate
GET    http://localhost:8080/ticket-service/actuator/health
```

#### Paiement Service
```
POST   http://localhost:8080/paiement-service/api/paiements
GET    http://localhost:8080/paiement-service/api/paiements/{id}
GET    http://localhost:8080/paiement-service/api/paiements/user/{userId}
GET    http://localhost:8080/paiement-service/actuator/health
```

## Exemples de Requêtes

### 1. Inscription Client (Signup)
```http
POST http://localhost:8080/auth-service/api/auth/signup/client
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test123!@#",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "+212600000000"
}
```

### 2. Connexion (Login)
```http
POST http://localhost:8080/auth-service/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!@#"
}
```

Réponse attendue:
```json
{
  "token": "<REDACTED>",
  "type": "Bearer",
  "userId": "uuid-here",
  "username": "testuser",
  "email": "test@example.com"
}
```

### 3. Récupérer le Profil Utilisateur
```http
GET http://localhost:8080/user-service/api/users/me
Authorization: Bearer {token}
```

### 4. Créer un Ticket
```http
POST http://localhost:8080/ticket-service/api/tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "trajetId": "uuid-trajet",
  "prix": 50.0,
  "seatNumber": "A1"
}
```

### 5. Créer un Paiement
```http
POST http://localhost:8080/paiement-service/api/paiements
Authorization: Bearer {token}
Content-Type: application/json

{
  "montant": 50.0,
  "methodePaiement": "CARTE_BANCAIRE",
  "ticketId": "uuid-ticket"
}
```

## Vérification de l'État des Services

### Vérifier Eureka Dashboard
Ouvrir dans le navigateur: http://localhost:8761

Vous devriez voir tous les services enregistrés:
- API-GATEWAY
- AUTH-SERVICE
- USER-SERVICE
- TICKET-SERVICE (en cours d'enregistrement)
- PAIEMENT-SERVICE (en cours d'enregistrement)
- TRAJET-SERVICE
- GEOLOCALISATION-SERVICE
- NOTIFICATION-SERVICE
- ABONNEMENT-SERVICE

### Health Checks
```
GET http://localhost:8080/auth-service/actuator/health
GET http://localhost:8080/user-service/actuator/health
GET http://localhost:8080/ticket-service/actuator/health
GET http://localhost:8080/paiement-service/actuator/health
GET http://localhost:8080/actuator/health  (Gateway)
```

## Commandes Docker Utiles

### Vérifier l'état des conteneurs
```bash
docker ps
```

### Voir les logs d'un service
```bash
docker logs auth-service
docker logs user-service
docker logs wasalny-ticket-service-1
docker logs wasalny-paiement-service-1
```

### Redémarrer un service
```bash
docker-compose restart auth-service
docker-compose restart user-service
```

### Arrêter tous les services
```bash
docker-compose down
```

### Démarrer tous les services
```bash
docker-compose up -d
```

## Notes Importantes

1. **Authentication**: La plupart des endpoints nécessitent un token JWT. Commencez par `/auth/signup` ou `/auth/login` pour obtenir un token.

2. **Headers requis**:
   - `Content-Type: application/json`
   - `Authorization: Bearer {token}` (pour les endpoints protégés)

3. **Temps de démarrage**: Les services peuvent prendre 1-2 minutes pour démarrer complètement et s'enregistrer dans Eureka.

4. **RabbitMQ**: Les services Ticket et Paiement utilisent RabbitMQ pour la messagerie asynchrone. Le management UI est disponible à http://localhost:15672 (admin/mot_de_passe_configuré)

5. **Redis**: Utilisé pour le cache et les sessions, accessible sur le port 6379.

6. **Bases de données PostgreSQL**:
   - Auth DB: Port 5437
   - User DB: Port 5434
   - Ticket DB: Port 5436
   - Paiement DB: Port 5433

## Corrections Appliquées

J'ai corrigé la configuration Docker Compose pour les services Ticket et Paiement en ajoutant les variables d'environnement RabbitMQ manquantes:
- `SPRING_RABBITMQ_USERNAME`
- `SPRING_RABBITMQ_PASSWORD`

Ces services devraient maintenant démarrer correctement.
