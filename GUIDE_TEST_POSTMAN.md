# Guide de Test Postman - Microservices Wasalny

## 🔗 Point d'entrée : API Gateway
**Base URL** : `http://localhost:8080`

Toutes les requêtes passent par l'API Gateway sur le port 8080.

---

## 📋 Table des matières
1. [AUTH-SERVICE - Routes publiques](#1-auth-service---routes-publiques)
2. [USER-SERVICE - Routes Admin](#2-user-service---routes-admin)
3. [USER-SERVICE - Routes Client](#3-user-service---routes-client)
4. [USER-SERVICE - Routes Conducteur](#4-user-service---routes-conducteur)
5. [TICKET-SERVICE - Routes Client/Admin](#5-ticket-service---routes-clientadmin)
6. [PAIEMENT-SERVICE - Routes Client/Admin](#6-paiement-service---routes-clientadmin)

---

## 1. AUTH-SERVICE - Routes publiques

### 🔓 Aucune authentification requise

### 1.1 Inscription d'un utilisateur
```http
POST http://localhost:8080/auth-service/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Test123!@#",
  "role": "CLIENT",
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+212600000001"
}
```

**Rôles disponibles** : `CLIENT`, `CONDUCTEUR`, `ADMIN`

**Réponse** :
```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "userId": "uuid-here"
}
```

---

### 1.2 Connexion (Login)
```http
POST http://localhost:8080/auth-service/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Test123!@#"
}
```

**Réponse** :
```json
{
  "token": "<REDACTED>",
  "type": "Bearer",
  "userId": "uuid-here",
  "username": "john_doe",
  "email": "john@example.com",
  "role": "CLIENT"
}
```

⚠️ **Important** : Copiez le token pour les requêtes suivantes !

---

### 1.3 Vérifier le compte (avec code email)
```http
POST http://localhost:8080/auth-service/auth/verify
Content-Type: application/json

{
  "email": "john@example.com",
  "verificationCode": "123456"
}
```

---

### 1.4 Renvoyer le code de vérification
```http
POST http://localhost:8080/auth-service/auth/resend?email=john@example.com
```

---

## 2. USER-SERVICE - Routes Admin

### 🔒 Authentification requise : ROLE_ADMIN

**Header obligatoire** :
```
Authorization: Bearer {votre_token_admin}
```

### 2.1 Lister tous les utilisateurs
```http
GET http://localhost:8080/user-service/admin/users
Authorization: Bearer {token_admin}
```

---

### 2.2 Lister les utilisateurs par rôle
```http
GET http://localhost:8080/user-service/admin/users/role/CLIENT
Authorization: Bearer {token_admin}
```

**Rôles disponibles** : `CLIENT`, `CONDUCTEUR`, `ADMIN`

---

### 2.3 Modifier le statut d'un client
```http
PUT http://localhost:8080/user-service/admin/client/john@example.com/status?statut=ACTIF
Authorization: Bearer {token_admin}
```

**Statuts disponibles** : `ACTIF`, `INACTIF`, `SUSPENDU`, `BLOQUE`

---

### 2.4 Modifier le statut d'un conducteur
```http
PUT http://localhost:8080/user-service/admin/conducteur/driver@example.com/status?statut=ACTIF
Authorization: Bearer {token_admin}
```

**Statuts disponibles** : `EN_ATTENTE`, `ACTIF`, `INACTIF`, `SUSPENDU`, `BLOQUE`

---

### 2.5 Supprimer un utilisateur
```http
DELETE http://localhost:8080/user-service/admin/users/john@example.com
Authorization: Bearer {token_admin}
```

---

### 2.6 Créer un profil utilisateur (interne)
```http
POST http://localhost:8080/user-service/admin/users/create?email=test@test.com&username=testuser&role=CLIENT&dateCreation=2025-11-17T10:00:00
Authorization: Bearer {token_admin}
```

⚠️ **Note** : Cette route est normalement appelée par l'auth-service lors de l'inscription.

---

## 3. USER-SERVICE - Routes Client

### 🔒 Authentification requise : ROLE_CLIENT

**Header obligatoire** :
```
Authorization: Bearer {votre_token_client}
```

### 3.1 Consulter son profil
```http
GET http://localhost:8080/user-service/client/profile?email=john@example.com
Authorization: Bearer {token_client}
```

---

### 3.2 Modifier son profil
```http
PUT http://localhost:8080/user-service/client/profile?email=john@example.com
Authorization: Bearer {token_client}
Content-Type: application/json

{
  "nom": "Doe",
  "prenom": "John",
  "telephone": "+212600000001",
  "adresse": "123 Rue Example, Casablanca"
}
```

---

### 3.3 Changer son mot de passe
```http
PUT http://localhost:8080/user-service/client/password
Authorization: Bearer {token_client}
Content-Type: application/json

{
  "email": "john@example.com",
  "currentPassword": "Test123!@#",
  "newPassword": "NewPass123!@#",
  "verificationCode": "123456"
}
```

---

### 3.4 Supprimer son compte
```http
DELETE http://localhost:8080/user-service/client/account?email=john@example.com
Authorization: Bearer {token_client}
```

---

## 4. USER-SERVICE - Routes Conducteur

### 🔒 Authentification requise : ROLE_CONDUCTEUR

**Header obligatoire** :
```
Authorization: Bearer {votre_token_conducteur}
```

### 4.1 Consulter son profil
```http
GET http://localhost:8080/user-service/conducteur/profile?email=driver@example.com
Authorization: Bearer {token_conducteur}
```

---

### 4.2 Modifier son profil
```http
PUT http://localhost:8080/user-service/conducteur/profile?email=driver@example.com
Authorization: Bearer {token_conducteur}
Content-Type: application/json

{
  "nom": "Alami",
  "prenom": "Ahmed",
  "telephone": "+212600000002",
  "adresse": "456 Rue Example, Rabat",
  "numeroPermis": "AB123456",
  "typeVehicule": "Berline",
  "numeroImmatriculation": "123456-A-78"
}
```

---

## 5. TICKET-SERVICE - Routes Client/Admin

### 5.1 Récupérer un ticket par ID

**🔒 Rôles autorisés** : `ROLE_CLIENT`, `ROLE_ADMIN`

```http
GET http://localhost:8080/ticket-service/tickets/{ticketId}
Authorization: Bearer {token}
```

**Exemple** :
```http
GET http://localhost:8080/ticket-service/tickets/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer {token}
```

---

### 5.2 Récupérer tous les tickets d'un client

**🔒 Rôles autorisés** : `ROLE_CLIENT`, `ROLE_ADMIN`

```http
GET http://localhost:8080/ticket-service/tickets/client/{clientId}
Authorization: Bearer {token}
```

**Exemple** :
```http
GET http://localhost:8080/ticket-service/tickets/client/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer {token}
```

---

### 5.3 Annuler un ticket

**🔒 Rôle autorisé** : `ROLE_CLIENT` uniquement

```http
PUT http://localhost:8080/ticket-service/tickets/{ticketId}/annuler
Authorization: Bearer {token_client}
```

**Exemple** :
```http
PUT http://localhost:8080/ticket-service/tickets/123e4567-e89b-12d3-a456-426614174000/annuler
Authorization: Bearer {token_client}
```

---

### 5.4 Valider un ticket

**🔒 Rôle autorisé** : `ROLE_ADMIN` uniquement

```http
PUT http://localhost:8080/ticket-service/tickets/{ticketId}/valider
Authorization: Bearer {token_admin}
```

**Exemple** :
```http
PUT http://localhost:8080/ticket-service/tickets/123e4567-e89b-12d3-a456-426614174000/valider
Authorization: Bearer {token_admin}
```

---

### 5.5 Rembourser un ticket

**🔒 Rôle autorisé** : `ROLE_ADMIN` uniquement

```http
PUT http://localhost:8080/ticket-service/tickets/{ticketId}/rembourser
Authorization: Bearer {token_admin}
```

**Exemple** :
```http
PUT http://localhost:8080/ticket-service/tickets/123e4567-e89b-12d3-a456-426614174000/rembourser
Authorization: Bearer {token_admin}
```

---

## 6. PAIEMENT-SERVICE - Routes Client/Admin

### 6.1 Initier un paiement

**🔒 Rôle autorisé** : `ROLE_CLIENT` uniquement

```http
POST http://localhost:8080/paiement-service/paiements/initier
Authorization: Bearer {token_client}
Content-Type: application/json

{
  "clientId": "123e4567-e89b-12d3-a456-426614174000",
  "montant": 50.00,
  "typePaiement": "CARTE_BANCAIRE",
  "typeService": "TICKET",
  "referenceService": "ticket-ref-123",
  "description": "Achat ticket trajet Casablanca-Rabat",
  "infoCarte": {
    "numeroCarteMasque": "************1234",
    "typeCarteBancaire": "VISA"
  }
}
```

**Types de paiement disponibles** : `CARTE_BANCAIRE`, `ESPECES`, `MOBILE_MONEY`

**Types de service disponibles** : `TICKET`, `ABONNEMENT`

---

### 6.2 Traiter un paiement

**🔒 Rôle autorisé** : `ROLE_ADMIN` uniquement

```http
POST http://localhost:8080/paiement-service/paiements/{transactionId}/traiter
Authorization: Bearer {token_admin}
```

**Exemple** :
```http
POST http://localhost:8080/paiement-service/paiements/123e4567-e89b-12d3-a456-426614174000/traiter
Authorization: Bearer {token_admin}
```

---

### 6.3 Récupérer une transaction par ID

**🔒 Rôles autorisés** : `ROLE_CLIENT`, `ROLE_ADMIN`

```http
GET http://localhost:8080/paiement-service/paiements/{transactionId}
Authorization: Bearer {token}
```

**Exemple** :
```http
GET http://localhost:8080/paiement-service/paiements/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer {token}
```

---

### 6.4 Récupérer toutes les transactions d'un client

**🔒 Rôles autorisés** : `ROLE_CLIENT`, `ROLE_ADMIN`

```http
GET http://localhost:8080/paiement-service/paiements/client/{clientId}
Authorization: Bearer {token}
```

**Exemple** :
```http
GET http://localhost:8080/paiement-service/paiements/client/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer {token}
```

---

## 📝 Scénario de test complet

### Scénario CLIENT :

1. **Inscription** : `POST /auth-service/auth/signup` (rôle CLIENT)
2. **Vérification email** : `POST /auth-service/auth/verify`
3. **Connexion** : `POST /auth-service/auth/login` → Récupérer le token
4. **Consulter profil** : `GET /user-service/client/profile?email=...`
5. **Modifier profil** : `PUT /user-service/client/profile?email=...`
6. **Initier paiement** : `POST /paiement-service/paiements/initier`
7. **Voir mes paiements** : `GET /paiement-service/paiements/client/{clientId}`
8. **Voir mes tickets** : `GET /ticket-service/tickets/client/{clientId}`
9. **Annuler un ticket** : `PUT /ticket-service/tickets/{ticketId}/annuler`

### Scénario ADMIN :

1. **Connexion admin** : `POST /auth-service/auth/login` → Récupérer le token admin
2. **Lister tous les utilisateurs** : `GET /user-service/admin/users`
3. **Lister les clients** : `GET /user-service/admin/users/role/CLIENT`
4. **Modifier statut client** : `PUT /user-service/admin/client/{email}/status?statut=ACTIF`
5. **Valider un ticket** : `PUT /ticket-service/tickets/{ticketId}/valider`
6. **Traiter un paiement** : `POST /paiement-service/paiements/{transactionId}/traiter`
7. **Rembourser un ticket** : `PUT /ticket-service/tickets/{ticketId}/rembourser`
8. **Voir tous les paiements d'un client** : `GET /paiement-service/paiements/client/{clientId}`
9. **Supprimer un utilisateur** : `DELETE /user-service/admin/users/{email}`

---

## ⚠️ Notes importantes

1. **Tous les IDs utilisent le format UUID** (exemple: `123e4567-e89b-12d3-a456-426614174000`)

2. **Le token JWT doit être inclus dans le header** pour toutes les routes protégées :
   ```
   Authorization: Bearer {votre_token}
   ```

3. **Routes corrigées** par rapport au guide précédent :
   - ❌ `/user-service/api/users/me` (n'existe pas)
   - ✅ `/user-service/client/profile?email=...` (correct)
   - ❌ `/ticket-service/api/tickets` (n'existe pas)
   - ✅ `/ticket-service/tickets/client/{clientId}` (correct)
   - ❌ `/paiement-service/api/paiements` (n'existe pas)
   - ✅ `/paiement-service/paiements/initier` (correct)

4. **Vérification des services actifs** :
   ```bash
   # Vérifier Eureka
   http://localhost:8761

   # Vérifier les health checks
   http://localhost:8080/auth-service/actuator/health
   http://localhost:8080/user-service/actuator/health
   http://localhost:8080/ticket-service/actuator/health
   http://localhost:8080/paiement-service/actuator/health
   ```

5. **En cas d'erreur 401 (Unauthorized)** : Vérifiez que votre token est valide et que vous avez le bon rôle pour l'endpoint.

6. **En cas d'erreur 403 (Forbidden)** : Vous n'avez pas les permissions nécessaires (mauvais rôle).

---

## 🎯 Récapitulatif des rôles

| Endpoint | CLIENT | CONDUCTEUR | ADMIN |
|----------|--------|------------|-------|
| `/auth/*` | ✅ Public | ✅ Public | ✅ Public |
| `/user-service/client/*` | ✅ | ❌ | ❌ |
| `/user-service/conducteur/*` | ❌ | ✅ | ❌ |
| `/user-service/admin/*` | ❌ | ❌ | ✅ |
| `/ticket-service/tickets/{id}` (GET) | ✅ | ❌ | ✅ |
| `/ticket-service/tickets/client/{id}` (GET) | ✅ | ❌ | ✅ |
| `/ticket-service/tickets/{id}/annuler` (PUT) | ✅ | ❌ | ❌ |
| `/ticket-service/tickets/{id}/valider` (PUT) | ❌ | ❌ | ✅ |
| `/ticket-service/tickets/{id}/rembourser` (PUT) | ❌ | ❌ | ✅ |
| `/paiement-service/paiements/initier` (POST) | ✅ | ❌ | ❌ |
| `/paiement-service/paiements/{id}/traiter` (POST) | ❌ | ❌ | ✅ |
| `/paiement-service/paiements/{id}` (GET) | ✅ | ❌ | ✅ |
| `/paiement-service/paiements/client/{id}` (GET) | ✅ | ❌ | ✅ |

---

**✅ Tous les services sont prêts pour les tests !**
