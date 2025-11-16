# Test de Communication entre Services - Architecture Wasalny

## ✅ État des Services

### Services en Fonctionnement
- ✅ **eureka-server** (port 8761) - Service discovery
- ✅ **config-server** (port 8888) - Configuration centralisée
- ✅ **api-gateway** (port 8080) - Point d'entrée unique
- ✅ **user-service** (port 8083) - Gestion des profils utilisateurs
- ✅ **paiement-service** (port 8082) - Gestion des paiements **+ JWT**
- ✅ **ticket-service** (port 8085) - Gestion des tickets **+ JWT**
- ✅ **rabbitmq** (port 5672, management 15672) - Messaging
- ✅ **redis** (port 6379) - Cache

### Services avec Problèmes
- ⚠️ **auth-service** (port 8086) - Variables d'environnement SUPPORT_EMAIL et APP_PASSWORD manquantes

## 🔄 Communications Configurées

### 1. Communication Synchrone (Feign)
```
auth-service → user-service
```
**Statut** : Configuré mais auth-service ne démarre pas (problème de config email)

### 2. Communication Asynchrone (RabbitMQ)
```
paiement-service → RabbitMQ → ticket-service
```
**Statut** : ✅ **Fonctionnel**
- Exchange: `payment.exchange`
- Queue: `payment.completed.queue`
- Routing Key: `payment.completed`

### 3. Authentification JWT
Tous les services (paiement et ticket) valident les tokens JWT avec les rôles :
- **CLIENT** : Pour les clients
- **ADMIN** : Pour les administrateurs

## 📋 Tests de Communication

### Test 1 : Vérifier l'enregistrement dans Eureka

```bash
curl http://localhost:8761/eureka/apps
```

**Services enregistrés** :
- API-GATEWAY ✅
- CONFIG-SERVER ✅
- PAIEMENT-SERVICE ✅
- TICKET-SERVICE ✅
- USER-SERVICE ✅
- NOTIFICATION-SERVICE ✅
- TRAJET-SERVICE ✅

### Test 2 : Health Check des Services

```bash
# Paiement Service
curl http://localhost:8082/actuator/health

# Ticket Service
curl http://localhost:8085/actuator/health

# User Service
curl http://localhost:8083/actuator/health
```

### Test 3 : Communication RabbitMQ (Sans Authentification - Pour Test Initial)

**Note** : Les services paiement et ticket ont maintenant l'authentification JWT activée.
Pour tester SANS authentification, vous devez d'abord :
1. Corriger le problème de auth-service (variables d'environnement)
2. S'inscrire/se connecter pour obtenir un token JWT

**OU** temporairement désactiver la sécurité pour les tests.

#### Option A : Avec JWT (Recommandé - Production)

1. **Créer un utilisateur et obtenir un token** (quand auth-service fonctionne)
```bash
# Inscription
curl -X POST http://localhost:8086/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Test",
    "prenom": "Client",
    "email": "client@test.com",
    "motDePasse": "Password123!",
    "role": "CLIENT"
  }'

# Connexion
curl -X POST http://localhost:8086/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "client@test.com",
    "motDePasse": "Password123!"
  }'
```

2. **Initier un paiement (CLIENT)**
```bash
TOKEN="<votre_jwt_token>"

curl -X POST http://localhost:8082/paiements/initier \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "clientId": "uuid-du-client",
    "montant": 50.00,
    "typePaiement": "CARTE_BANCAIRE",
    "typeService": "ACHAT_TICKET",
    "referenceService": "ref-ticket-123",
    "description": "Achat ticket bus",
    "infoCarte": {
      "numero": "4111111111111111",
      "nomTitulaire": "Test Client",
      "dateExpiration": "12/25",
      "cvv": "123"
    }
  }'
```

3. **Traiter le paiement (ADMIN uniquement)**
```bash
ADMIN_TOKEN="<votre_admin_jwt_token>"
TRANSACTION_ID="<id_de_la_transaction>"

curl -X POST http://localhost:8082/paiements/$TRANSACTION_ID/traiter \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

4. **Vérifier la création automatique du ticket**
```bash
CLIENT_ID="<votre_client_id>"

curl http://localhost:8085/tickets/client/$CLIENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

#### Option B : Test Sans JWT (Développement - Temporaire)

Pour tester rapidement sans JWT, modifiez temporairement la SecurityConfiguration :

```java
// Dans paiement-service et ticket-service
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll()  // Permet tout temporairement
        );
    return http.build();
}
```

### Test 4 : Vérifier RabbitMQ Management UI

```bash
# Accéder à l'interface RabbitMQ
http://localhost:15672
# Login: admin / Password: admin
```

Vérifier :
- Exchange `payment.exchange` existe
- Queue `payment.completed.queue` existe
- Binding entre l'exchange et la queue avec routing key `payment.completed`

## 🔐 Permissions des Routes

### Paiement Service

| Route | Méthode | Rôle Requis | Description |
|-------|---------|-------------|-------------|
| `/paiements/initier` | POST | CLIENT | Initier un paiement |
| `/paiements/{id}/traiter` | POST | ADMIN | Traiter un paiement |
| `/paiements/{id}` | GET | CLIENT, ADMIN | Voir détails transaction |
| `/paiements/client/{clientId}` | GET | CLIENT, ADMIN | Historique transactions |
| `/actuator/**` | GET | Public | Health checks |

### Ticket Service

| Route | Méthode | Rôle Requis | Description |
|-------|---------|-------------|-------------|
| `/tickets/{id}` | GET | CLIENT, ADMIN | Voir détails ticket |
| `/tickets/client/{clientId}` | GET | CLIENT, ADMIN | Historique tickets |
| `/tickets/{id}/valider` | PUT | ADMIN | Valider un ticket |
| `/tickets/{id}/annuler` | PUT | CLIENT | Annuler un ticket |
| `/tickets/{id}/rembourser` | PUT | ADMIN | Rembourser un ticket |
| `/actuator/**` | GET | Public | Health checks |

## 🐛 Problèmes Identifiés

### 1. Auth Service ne démarre pas
**Erreur** : `Could not resolve placeholder 'SUPPORT_EMAIL' in value "${SUPPORT_EMAIL}"`

**Solution** : Ajouter les variables d'environnement dans docker-compose.yml ou .env :
```env
SUPPORT_EMAIL=votre-email@gmail.com
APP_PASSWORD=<REDACTED>
```

### 2. Test des routes protégées sans token
**Erreur** : 401 Unauthorized ou 403 Forbidden

**Solution** :
1. Corriger auth-service
2. S'inscrire et se connecter pour obtenir un JWT
3. Inclure le token dans le header : `Authorization: Bearer <token>`

## ✅ Résumé de l'État

### Fonctionnel
- ✅ Services déployés et enregistrés dans Eureka
- ✅ RabbitMQ connecté et configuré
- ✅ Communication asynchrone paiement → ticket configurée
- ✅ JWT configuré sur paiement-service et ticket-service
- ✅ Permissions basées sur les rôles configurées

### À Corriger
- ⚠️ Auth-service : Variables d'environnement manquantes
- ⚠️ Tests end-to-end complets avec JWT à effectuer une fois auth-service corrigé

### Prochaines Étapes
1. Ajouter SUPPORT_EMAIL et APP_PASSWORD dans les variables d'environnement
2. Redémarrer auth-service
3. Tester le flux complet :
   - Inscription → Connexion → Obtenir JWT
   - Initier paiement (CLIENT)
   - Traiter paiement (ADMIN)
   - Vérifier création automatique du ticket
   - Gérer le ticket (annuler, valider, rembourser)
