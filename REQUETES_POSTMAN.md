# 📋 Requêtes Postman - Services Wasalny

## ⚙️ Configuration Préalable de Postman

### 1. Désactiver le Proxy
- **File → Settings → Proxy**
- Décochez "Use system proxy"
- Ajoutez dans "Bypass proxy for domains": `localhost,127.0.0.1`

### 2. Augmenter le Timeout
- **File → Settings → General**
- **Request timeout**: `30000` ms

### 3. Important
- Utilisez **127.0.0.1** au lieu de **localhost**

---

## 🔐 1. AUTH SERVICE (Port 8086)

### 1.1 Inscription Client

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8086/auth/signup`
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "client1@test.com",
  "password": "Password123!",
  "username": "client1"
}
```

**Réponse attendue:**
```json
{
  "message": "Inscription réussie. Veuillez vérifier votre email pour activer votre compte.",
  "email": "client1@test.com"
}
```

---

### 1.2 Connexion

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8086/auth/login`
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "client1@test.com",
  "password": "Password123!"
}
```

**Réponse attendue:**
```json
{
  "token": "<REDACTED>",
  "expiresIn": 3600000,
  "userId": "uuid-du-client",
  "email": "client1@test.com",
  "username": "client1",
  "role": "CLIENT"
}
```

> ⚠️ **IMPORTANT:** Copiez le `token` et le `userId` pour les utiliser dans les requêtes suivantes

---

### 1.3 Vérifier le Compte

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8086/auth/verify`
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "client1@test.com",
  "verificationCode": "123456"
}
```

---

### 1.4 Renvoyer Code de Vérification

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8086/auth/resend?email=client1@test.com`

---

## 💳 2. PAIEMENT SERVICE (Port 8082)

> 🔑 **Pour toutes les requêtes ci-dessous, ajoutez le header:**
> ```
> Authorization: Bearer VOTRE_TOKEN_ICI
> ```

---

### 2.1 Initier Paiement - Carte Bancaire

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8082/paiements/initier`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "clientId": "VOTRE_USER_ID_ICI",
  "montant": 50.00,
  "typePaiement": "CARTE_BANCAIRE",
  "typeService": "ACHAT_TICKET",
  "referenceService": "VOTRE_USER_ID_ICI",
  "description": "Achat ticket bus ligne 12",
  "infoCarte": {
    "numeroCarte": "4532015112830366",
    "nomTitulaire": "JOHN DOE",
    "dateExpiration": "12/2025",
    "cvv": "123"
  }
}
```

> 💡 Remplacez `VOTRE_USER_ID_ICI` par le `userId` reçu lors de la connexion

**Réponse attendue:**
```json
{
  "id": "uuid-de-la-transaction",
  "montant": 50.00,
  "statut": "EN_ATTENTE",
  "typePaiement": "CARTE_BANCAIRE",
  "typeService": "ACHAT_TICKET",
  ...
}
```

> ⚠️ **Copiez l'ID de la transaction** pour les requêtes suivantes

---

### 2.2 Initier Paiement - Mobile Money

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8082/paiements/initier`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "clientId": "VOTRE_USER_ID_ICI",
  "montant": 30.00,
  "typePaiement": "MOBILE_MONEY",
  "typeService": "ACHAT_TICKET",
  "referenceService": "VOTRE_USER_ID_ICI",
  "description": "Achat ticket bus ligne 5"
}
```

---

### 2.3 Initier Paiement - Espèces

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8082/paiements/initier`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "clientId": "VOTRE_USER_ID_ICI",
  "montant": 20.00,
  "typePaiement": "ESPECES",
  "typeService": "ACHAT_TICKET",
  "referenceService": "VOTRE_USER_ID_ICI",
  "description": "Achat ticket bus ligne 8"
}
```

---

### 2.4 Initier Paiement - Abonnement

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8082/paiements/initier`
**Headers:**
```
Content-Type: application/json
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Body (raw JSON):**
```json
{
  "clientId": "VOTRE_USER_ID_ICI",
  "montant": 150.00,
  "typePaiement": "CARTE_BANCAIRE",
  "typeService": "ABONNEMENT",
  "referenceService": "VOTRE_USER_ID_ICI",
  "description": "Abonnement mensuel",
  "infoCarte": {
    "numeroCarte": "4532015112830366",
    "nomTitulaire": "JANE SMITH",
    "dateExpiration": "06/2026",
    "cvv": "456"
  }
}
```

---

### 2.5 Traiter un Paiement (ADMIN uniquement)

**Méthode:** `POST`
**URL:** `http://127.0.0.1:8082/paiements/ID_TRANSACTION/traiter`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

> 💡 Remplacez `ID_TRANSACTION` par l'ID de la transaction à traiter

---

### 2.6 Consulter une Transaction

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8082/paiements/ID_TRANSACTION`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ICI
```

---

### 2.7 Liste des Transactions d'un Client

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8082/paiements/client/VOTRE_USER_ID_ICI`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ICI
```

---

## 🎫 3. TICKET SERVICE (Port 8085)

> 🔑 **Pour toutes les requêtes ci-dessous, ajoutez le header:**
> ```
> Authorization: Bearer VOTRE_TOKEN_ICI
> ```

---

### 3.1 Consulter un Ticket

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8085/tickets/ID_TICKET`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ICI
```

---

### 3.2 Liste des Tickets d'un Client

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8085/tickets/client/VOTRE_USER_ID_ICI`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ICI
```

**Réponse attendue:**
```json
[
  {
    "id": "uuid-du-ticket",
    "clientId": "uuid-du-client",
    "montant": 50.00,
    "statut": "ACTIF",
    ...
  }
]
```

---

### 3.3 Valider un Ticket (ADMIN uniquement)

**Méthode:** `PUT`
**URL:** `http://127.0.0.1:8085/tickets/ID_TICKET/valider`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

---

### 3.4 Annuler un Ticket (CLIENT)

**Méthode:** `PUT`
**URL:** `http://127.0.0.1:8085/tickets/ID_TICKET/annuler`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ICI
```

---

### 3.5 Rembourser un Ticket (ADMIN uniquement)

**Méthode:** `PUT`
**URL:** `http://127.0.0.1:8085/tickets/ID_TICKET/rembourser`
**Headers:**
```
Authorization: Bearer VOTRE_TOKEN_ADMIN_ICI
```

---

## 🏥 4. HEALTH CHECKS (Vérification des Services)

### 4.1 Auth Service Health

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8086/actuator/health`

**Réponse attendue:**
```json
{
  "status": "UP",
  ...
}
```

---

### 4.2 User Service Health

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8083/actuator/health`

---

### 4.3 Paiement Service Health

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8082/actuator/health`

---

### 4.4 Ticket Service Health

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8085/actuator/health`

---

### 4.5 API Gateway Health

**Méthode:** `GET`
**URL:** `http://127.0.0.1:8080/actuator/health`

---

## 🎯 Scénario de Test Complet

### Étape 1: Vérifier les Services
```
GET http://127.0.0.1:8086/actuator/health  → Auth
GET http://127.0.0.1:8082/actuator/health  → Paiement
GET http://127.0.0.1:8085/actuator/health  → Ticket
```
✅ Tous doivent retourner `"status": "UP"`

---

### Étape 2: Créer un Compte
```
POST http://127.0.0.1:8086/auth/signup
```
Body:
```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "username": "testuser"
}
```

---

### Étape 3: Se Connecter
```
POST http://127.0.0.1:8086/auth/login
```
Body:
```json
{
  "email": "test@example.com",
  "password": "Password123!"
}
```
📝 **Copiez le `token` et le `userId`**

---

### Étape 4: Initier un Paiement
```
POST http://127.0.0.1:8082/paiements/initier
Header: Authorization: Bearer VOTRE_TOKEN
```
Body:
```json
{
  "clientId": "VOTRE_USER_ID",
  "montant": 50.00,
  "typePaiement": "CARTE_BANCAIRE",
  "typeService": "ACHAT_TICKET",
  "referenceService": "VOTRE_USER_ID",
  "description": "Test paiement",
  "infoCarte": {
    "numeroCarte": "4532015112830366",
    "nomTitulaire": "TEST USER",
    "dateExpiration": "12/2025",
    "cvv": "123"
  }
}
```
📝 **Copiez l'ID de la transaction**

---

### Étape 5: Consulter la Transaction
```
GET http://127.0.0.1:8082/paiements/ID_TRANSACTION
Header: Authorization: Bearer VOTRE_TOKEN
```

---

### Étape 6: Consulter les Tickets
```
GET http://127.0.0.1:8085/tickets/client/VOTRE_USER_ID
Header: Authorization: Bearer VOTRE_TOKEN
```

---

## 📊 Types de Données

### Types de Paiement (TypePaiement)
- `CARTE_BANCAIRE` - Nécessite l'objet `infoCarte`
- `MOBILE_MONEY` - Pas besoin d'infoCarte
- `ESPECES` - Pas besoin d'infoCarte

### Types de Service (TypeService)
- `ACHAT_TICKET` - Pour acheter des tickets
- `ABONNEMENT` - Pour les abonnements

### Statuts de Transaction
- `EN_ATTENTE` - Transaction créée
- `EN_COURS` - En traitement
- `REUSSIE` - Paiement réussi
- `ECHOUEE` - Paiement échoué
- `REMBOURSEE` - Transaction remboursée

### Rôles Utilisateurs
- `CLIENT` - Utilisateur normal
- `ADMIN` - Administrateur

---

## 🔧 Dépannage

### Problème: ESOCKETTIMEDOUT
**Solutions:**
1. Utilisez `127.0.0.1` au lieu de `localhost`
2. Désactivez le proxy dans Postman (Settings → Proxy)
3. Augmentez le timeout à 30000 ms (Settings → General)
4. Vérifiez que le service est UP avec `/actuator/health`

### Problème: 401 Unauthorized
**Solutions:**
1. Vérifiez que le token est valide (pas expiré)
2. Vérifiez que le header Authorization est bien présent: `Bearer TOKEN`
3. Reconnectez-vous pour obtenir un nouveau token

### Problème: 403 Forbidden
**Solutions:**
1. Vérifiez que vous avez le bon rôle (CLIENT ou ADMIN)
2. Certaines opérations nécessitent le rôle ADMIN

### Problème: 404 Not Found
**Solutions:**
1. Vérifiez l'URL et le port
2. Vérifiez que l'ID utilisé existe (userId, transactionId, ticketId)

---

## 📝 Ports des Services

| Service | Port |
|---------|------|
| Auth Service | 8086 |
| User Service | 8083 |
| Paiement Service | 8082 |
| Ticket Service | 8085 |
| Trajet Service | 8081 |
| Géolocalisation Service | 8084 |
| Abonnement Service | 8087 |
| Notification Service | 8088 |
| API Gateway | 8080 |
| Eureka Server | 8761 |

---

## 💡 Conseils

1. **Toujours commencer par vérifier les health checks**
2. **Gardez une trace de vos IDs** (userId, token, transactionId, ticketId)
3. **Utilisez Postman Environment Variables** pour stocker token, userId, etc.
4. **Testez d'abord avec les health checks** avant de faire des requêtes complexes
5. **Vérifiez les logs Docker** si une requête échoue: `docker logs nom-du-service`

---

**Créé pour le projet Wasalny - Système de Transport Intelligent**
