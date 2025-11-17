# Données de Test Réelles - Base de Données

## 📊 Données existantes dans la base de données

### 👥 UTILISATEURS (auth_db.users)

| ID | Email | Username | Rôle | Activé |
|----|-------|----------|------|--------|
| 1 | ayakim127@gmail.com | admin1 | ADMIN | ✅ Oui |
| 3 | testclient3@example.com | testclient3 | CLIENT | ❌ Non |
| 4 | conducteurtest@example.com | conducteurtest | CONDUCTEUR | ❌ Non |

### 👤 PROFILS CLIENTS (user_db.client_profiles)

| ID | Email | Nom | Prénom | Statut |
|----|-------|-----|--------|--------|
| 2 | ayamtejjal123@gmail.com | Dupont | Jean | ACTIF |
| 5 | testclient@wasalny.com | - | - | ACTIF |

### 🎫 TICKETS (ticket_db.tickets)

| ID | Client ID | Numéro Ticket | Prix | Statut | Date Achat |
|----|-----------|---------------|------|--------|------------|
| 4ae6e073-f0c0-4195-80f7-1d7aa366d5c0 | 123e4567-e89b-12d3-a456-426614174001 | TKT-526239 | 75.50 | UTILISE | 2025-11-16 |

**Détails du ticket** :
- **ID** : `4ae6e073-f0c0-4195-80f7-1d7aa366d5c0`
- **Trip ID** : `a0b1c2d3-e4f5-6789-0123-456789abcdef`
- **Transaction ID** : `4ec35aeb-22ec-4e45-b127-eb881856fd6b`
- **Station Finale ID** : `8101ba0f-6154-4e37-bbbe-dd5a12cd98a4`
- **Numéro Trip** : `TRIP-a0b1c2d3`
- **Station Finale** : Station Finale

### 💳 TRANSACTIONS (paiement_db.transactions)

| ID | Client ID | Montant | Statut | Type Paiement |
|----|-----------|---------|--------|---------------|
| b564bd98-2400-4961-b42e-60205e9b0092 | 123e4567-e89b-12d3-a456-426614174000 | 50.00 | EN_ATTENTE | CARTE_BANCAIRE |
| 4ec35aeb-22ec-4e45-b127-eb881856fd6b | 123e4567-e89b-12d3-a456-426614174001 | 75.50 | REUSSIE | CARTE_BANCAIRE |

---

## 🧪 Exemples de Requêtes Postman avec Données Réelles

### 1️⃣ Connexion ADMIN

```http
POST http://localhost:8080/auth-service/auth/login
Content-Type: application/json

{
  "email": "ayakim127@gmail.com",
  "password": "<REDACTED>"
}
```

**Note** : Le compte admin existe et est activé. Vous devez connaître le mot de passe.

---

### 2️⃣ Récupérer le Ticket Existant

**Avec le vrai ID du ticket** :

```http
GET http://localhost:8080/ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0
Authorization: Bearer {token_client_ou_admin}
```

**Résultat attendu** :
```json
{
  "id": "4ae6e073-f0c0-4195-80f7-1d7aa366d5c0",
  "clientId": "123e4567-e89b-12d3-a456-426614174001",
  "numeroTicket": "TKT-526239",
  "prix": 75.50,
  "statut": "UTILISE",
  "dateAchat": "2025-11-16T13:38:10.377605",
  "tripId": "a0b1c2d3-e4f5-6789-0123-456789abcdef",
  "transactionId": "4ec35aeb-22ec-4e45-b127-eb881856fd6b"
}
```

---

### 3️⃣ Récupérer les Tickets d'un Client

**Avec le vrai Client ID** :

```http
GET http://localhost:8080/ticket-service/tickets/client/123e4567-e89b-12d3-a456-426614174001
Authorization: Bearer {token}
```

---

### 4️⃣ Récupérer une Transaction Existante

**Transaction EN_ATTENTE** :

```http
GET http://localhost:8080/paiement-service/paiements/b564bd98-2400-4961-b42e-60205e9b0092
Authorization: Bearer {token}
```

**Transaction REUSSIE** :

```http
GET http://localhost:8080/paiement-service/paiements/4ec35aeb-22ec-4e45-b127-eb881856fd6b
Authorization: Bearer {token}
```

---

### 5️⃣ Récupérer les Transactions d'un Client

**Client 1** (a une transaction EN_ATTENTE) :

```http
GET http://localhost:8080/paiement-service/paiements/client/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer {token}
```

**Client 2** (a une transaction REUSSIE) :

```http
GET http://localhost:8080/paiement-service/paiements/client/123e4567-e89b-12d3-a456-426614174001
Authorization: Bearer {token}
```

---

### 6️⃣ Traiter un Paiement (ADMIN uniquement)

**Traiter la transaction EN_ATTENTE** :

```http
POST http://localhost:8080/paiement-service/paiements/b564bd98-2400-4961-b42e-60205e9b0092/traiter
Authorization: Bearer {token_admin}
```

---

### 7️⃣ Consulter Profil Client

**Client Jean Dupont** :

```http
GET http://localhost:8080/user-service/client/profile?email=ayamtejjal123@gmail.com
Authorization: Bearer {token_client}
```

**Autre client** :

```http
GET http://localhost:8080/user-service/client/profile?email=testclient@wasalny.com
Authorization: Bearer {token_client}
```

---

### 8️⃣ Valider le Ticket Existant (ADMIN)

```http
PUT http://localhost:8080/ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0/valider
Authorization: Bearer {token_admin}
```

**Note** : Le ticket est actuellement au statut "UTILISE", donc cette opération pourrait échouer selon la logique métier.

---

### 9️⃣ Annuler le Ticket (CLIENT)

```http
PUT http://localhost:8080/ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0/annuler
Authorization: Bearer {token_client}
```

---

### 🔟 Rembourser le Ticket (ADMIN)

```http
PUT http://localhost:8080/ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0/rembourser
Authorization: Bearer {token_admin}
```

---

## 🎯 Scénario de Test Complet avec Données Réelles

### Scénario ADMIN :

1. **Login Admin** ✅
   ```
   POST /auth-service/auth/login
   Email: ayakim127@gmail.com
   ```

2. **Lister tous les utilisateurs** ✅
   ```
   GET /user-service/admin/users
   ```

3. **Voir les clients** ✅
   ```
   GET /user-service/admin/users/role/CLIENT
   ```

4. **Modifier statut d'un client** ✅
   ```
   PUT /user-service/admin/client/testclient@wasalny.com/status?statut=SUSPENDU
   ```

5. **Voir le ticket** ✅
   ```
   GET /ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0
   ```

6. **Valider le ticket** ✅
   ```
   PUT /ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0/valider
   ```

7. **Voir la transaction** ✅
   ```
   GET /paiement-service/paiements/b564bd98-2400-4961-b42e-60205e9b0092
   ```

8. **Traiter le paiement** ✅
   ```
   POST /paiement-service/paiements/b564bd98-2400-4961-b42e-60205e9b0092/traiter
   ```

### Scénario CLIENT (à créer d'abord) :

Puisque les clients existants ne sont pas activés ou vous ne connaissez pas leur mot de passe, créez un nouveau client :

1. **Créer un compte** ✅
   ```
   POST /auth-service/auth/signup
   ```

2. **Vérifier le compte** ✅
   ```
   POST /auth-service/auth/verify
   ```

3. **Se connecter** ✅
   ```
   POST /auth-service/auth/login
   ```

4. **Voir son profil** ✅
   ```
   GET /user-service/client/profile?email={votre_email}
   ```

5. **Initier un paiement** ✅
   ```
   POST /paiement-service/paiements/initier
   ```

6. **Voir ses transactions** ✅
   ```
   GET /paiement-service/paiements/client/{votre_client_id}
   ```

---

## ⚠️ Notes Importantes

1. **IDs à utiliser pour les tests** :
   - Ticket ID : `4ae6e073-f0c0-4195-80f7-1d7aa366d5c0`
   - Transaction EN_ATTENTE : `b564bd98-2400-4961-b42e-60205e9b0092`
   - Transaction REUSSIE : `4ec35aeb-22ec-4e45-b127-eb881856fd6b`
   - Client ID 1 : `123e4567-e89b-12d3-a456-426614174000`
   - Client ID 2 : `123e4567-e89b-12d3-a456-426614174001`

2. **Compte Admin disponible** :
   - Email : `ayakim127@gmail.com`
   - Username : `admin1`
   - Statut : Activé ✅
   - Vous devez connaître le mot de passe pour vous connecter

3. **Clients existants** :
   - `ayamtejjal123@gmail.com` - Profil créé, mais vérifiez s'il est activé dans auth_db
   - `testclient@wasalny.com` - Profil créé, mais vérifiez s'il est activé dans auth_db
   - `testclient3@example.com` - NON activé ❌

4. **Pour tester les routes CLIENT**, je recommande de :
   - Créer un nouveau compte avec `/auth/signup`
   - Le vérifier avec `/auth/verify`
   - Se connecter pour obtenir un token valide

---

## 📝 Commandes SQL Utiles

Pour vérifier les données :

```bash
# Voir tous les tickets
docker exec postgres-ticket psql -U wasalny_user -d ticket_db -c "SELECT * FROM tickets;"

# Voir toutes les transactions
docker exec postgres-paiement psql -U wasalny_user -d paiement_db -c "SELECT * FROM transactions;"

# Voir tous les utilisateurs
docker exec postgres-auth psql -U wasalny_user -d auth_db -c "SELECT * FROM users;"

# Voir tous les clients
docker exec postgres-user psql -U wasalny_user -d user_db -c "SELECT cp.id, up.email, cp.nom, cp.prenom, cp.statut FROM client_profiles cp JOIN user_profiles up ON cp.id = up.id;"
```

---

**✅ Vous pouvez maintenant tester avec des données réelles !**
