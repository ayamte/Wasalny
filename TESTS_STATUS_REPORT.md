# Rapport d'État des Tests - Wasalny Microservices

Date: 2025-11-18
Status: ⚠️ Tests en cours - Problèmes de performance détectés

## 📊 État des Services

### Services Actifs (Healthy)
✅ Tous les 8 services principaux sont démarrés et healthy:
- eureka-server (8761)
- config-server (8888)
- api-gateway (8080)
- auth-service (8086)
- user-service (8083)
- trajet-service (8081)
- geolocalisation-service (8084)
- paiement-service (8082)
- ticket-service (8085)
- abonnement-service (8087)
- notification-service (8088)

### Bases de données PostgreSQL
✅ Toutes healthy:
- postgres-auth (5437)
- postgres-user (5434)
- postgres-trajet (5432)
- postgres-geo (5435)
- postgres-paiement (5433)
- postgres-ticket (5436)
- postgres-abonnement (5438)
- postgres-notification (5439)

### Infrastructure
✅ RabbitMQ (5672, 15672) - healthy
✅ Redis (6379) - healthy

---

## ⚠️ Problèmes Identifiés

### 1. **Timeout sur les endpoints d'authentification**

**Symptôme**: Les requêtes HTTP POST vers `/auth/register` et `/auth/login` timeout après 30 secondes.

**Détails**:
```bash
# Test direct
curl -X POST "http://localhost:8086/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"nom": "Admin", ...}'
# Result: curl: (56) Recv failure: Connection was reset
```

**Cause probable**:
- Le JwtAuthenticationFilter ou un autre filtre Spring Security prend trop de temps
- Communication lente avec user-service ou base de données
- Deadlock ou boucle infinie dans le code

**Configuration vérifiée**:
- ✅ SecurityConfiguration correcte: `/auth/**` est bien dans permitAll()
- ✅ CORS configuré correctement
- ✅ Service enregistré dans Eureka

**Logs auth-service**: Aucune erreur visible, mais pas de logs de requêtes reçues non plus

---

## 📝 Script de Test Créé

Un script bash complet a été créé: `test_complete_workflow.sh`

**Couverture du test**:
1. ✅ Auth-service - Register & Login (3 utilisateurs: ADMIN, CONDUCTEUR, CLIENT)
2. ✅ User-service - Profiles
3. ✅ Trajet-service - Infrastructure (lignes, stations, bus, configurations)
4. ✅ Abonnement-service - Types d'abonnements
5. ✅ Trajet-service - Assignations bus-conducteur
6. ✅ Trajet-service - Génération des trips
7. ✅ CLIENT - Consultation infrastructure
8. ✅ Paiement-service - Achat ticket
9. ✅ Ticket-service - Vérification ticket créé
10. ✅ Paiement-service - Achat abonnement
11. ✅ Abonnement-service - Vérification abonnement créé
12. ✅ CONDUCTEUR - Démarrage trip
13. ✅ Geolocalisation-service - Mise à jour positions (3 positions)
14. ✅ CLIENT - Suivi temps réel du bus
15. ✅ CONDUCTEUR - Confirmation passages stations
16. ✅ CONDUCTEUR - Terminaison trip
17. ✅ Notification-service - Vérification notifications
18. ✅ Statistiques finales

**Status**: ❌ Bloqué à l'étape 1 (Register ADMIN)

---

## 🔧 Recommandations

### Actions Immédiates

1. **Débugger l'auth-service**:
   ```bash
   # Vérifier les logs en temps réel
   docker logs -f auth-service

   # Vérifier la santé
   curl http://localhost:8086/actuator/health

   # Tester avec timeout plus long
   curl --max-time 120 -X POST "http://localhost:8086/auth/register" ...
   ```

2. **Vérifier les dépendances**:
   - Tester user-service directement
   - Vérifier postgres-auth connectivity
   - Vérifier Redis connectivity

3. **Alternatives de test**:
   - Utiliser Postman/Insomnia avec timeout plus long
   - Tester avec des utilisateurs déjà existants dans la base
   - Bypass authentication temporairement pour tester les autres services

### Actions à Moyen Terme

1. **Performance**:
   - Profiler l'auth-service (JVM monitoring)
   - Optimiser le JwtAuthenticationFilter
   - Ajouter des indices sur les tables users
   - Configurer connection pooling PostgreSQL

2. **Logging**:
   - Augmenter niveau de log à DEBUG pour auth-service
   - Ajouter logs dans JwtAuthenticationFilter
   - Ajouter metrics Prometheus

3. **Tests**:
   - Créer tests unitaires pour AuthController
   - Tests d'intégration avec Testcontainers
   - Load testing avec K6 ou Gatling

---

## 📈 Prochaines Étapes

### Plan A: Résoudre le problème d'authentification
1. Augmenter timeout dans Spring Boot
2. Ajouter logs détaillés dans JwtAuthenticationFilter
3. Vérifier si la base de données répond
4. Rebuild et redeploy auth-service

### Plan B: Contourner pour continuer les tests
1. Créer manuellement des users dans la base de données
2. Générer des JWT tokens valides manuellement
3. Tester les autres services avec ces tokens
4. Revenir sur auth-service plus tard

### Plan C: Tests partiels
1. Tester chaque service individuellement
2. Créer des données de test directement en base
3. Vérifier communication RabbitMQ
4. Valider les endpoints critiques

---

## 📊 Matrice de Test des Endpoints

### Auth Service (8086)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /auth/register | POST | Public | ❌ Timeout | Bloqué après 30s |
| /auth/login | POST | Public | ❌ Non testé | - |

### User Service (8083)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /users/{id} | GET | ALL | ⏸️ En attente | Nécessite token |
| /users | GET | ADMIN | ⏸️ En attente | Nécessite token |

### Trajet Service (8081)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /trajets/lignes | POST | ADMIN | ⏸️ En attente | Infrastructure setup |
| /trajets/lignes | GET | ALL | ⏸️ En attente | - |
| /trajets/stations | POST | ADMIN | ⏸️ En attente | - |
| /trajets/stations | GET | ALL | ⏸️ En attente | - |
| /trajets/bus | POST | ADMIN | ⏸️ En attente | - |
| /trajets/configurations-horaires | POST | ADMIN | ⏸️ En attente | - |
| /trajets/assignations | POST | ADMIN | ⏸️ En attente | - |
| /trajets/trips | GET | ALL | ⏸️ En attente | - |
| /trajets/trips/{id}/demarrer | POST | CONDUCTEUR | ⏸️ En attente | - |
| /trajets/trips/{id}/terminer | POST | CONDUCTEUR | ⏸️ En attente | - |
| /trajets/passages-stations/{id}/confirmer | POST | CONDUCTEUR | ⏸️ En attente | - |

### Geolocalisation Service (8084)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /locations | POST | CONDUCTEUR | ⏸️ En attente | Update bus position |
| /locations/latest | GET | ALL | ⏸️ En attente | Real-time tracking |
| /locations/nearby | GET | ALL | ⏸️ En attente | Proximity search |

### Paiement Service (8082)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /paiements/initier | POST | CLIENT | ⏸️ En attente | - |
| /paiements/{id}/confirmer | POST | ADMIN | ⏸️ En attente | - |
| /paiements/client/{id} | GET | CLIENT/ADMIN | ⏸️ En attente | - |

### Ticket Service (8085)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /tickets/client/{id} | GET | CLIENT/ADMIN | ⏸️ En attente | Via RabbitMQ |
| /tickets/{id} | GET | CLIENT/ADMIN | ⏸️ En attente | - |
| /tickets/{id}/valider | PUT | ADMIN | ⏸️ En attente | - |

### Abonnement Service (8087)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /abonnements/types | POST | ADMIN | ⏸️ En attente | - |
| /abonnements/client/{id} | GET | CLIENT/ADMIN | ⏸️ En attente | Via RabbitMQ |
| /abonnements/{id} | GET | CLIENT/ADMIN | ⏸️ En attente | - |

### Notification Service (8088)
| Endpoint | Méthode | Rôle | Status | Notes |
|----------|---------|------|--------|-------|
| /notifications/user/{id} | GET | ALL | ⏸️ En attente | Via RabbitMQ |
| /notifications | GET | ADMIN | ⏸️ En attente | - |

---

## 🎯 Objectifs de Test

### Tests Fonctionnels
- [ ] Authentification (Register/Login)
- [ ] Gestion utilisateurs (Profiles)
- [ ] Création infrastructure (Lignes, Stations, Bus)
- [ ] Configuration horaires
- [ ] Assignation bus-conducteur
- [ ] Génération trips automatique
- [ ] Achat ticket via paiement
- [ ] Achat abonnement via paiement
- [ ] Communication RabbitMQ (Ticket/Abonnement creation)
- [ ] Démarrage trip par conducteur
- [ ] Mise à jour géolocalisation
- [ ] Suivi temps réel par client
- [ ] Confirmation passages stations
- [ ] Terminaison trip
- [ ] Notifications envoyées
- [ ] Permissions par rôle (ADMIN, CONDUCTEUR, CLIENT)

### Tests d'Intégration
- [ ] Communication inter-services via Eureka
- [ ] Routage API Gateway
- [ ] Events RabbitMQ (Payment → Ticket/Abonnement)
- [ ] Events RabbitMQ (Ticket/Abonnement → Notification)
- [ ] Cache Redis (Geolocalisation)
- [ ] JWT propagation entre services

### Tests de Performance
- [ ] Temps de réponse < 2s pour GET
- [ ] Temps de réponse < 5s pour POST/PUT
- [ ] Latence géolocalisation < 500ms
- [ ] Throughput min 100 req/s par service

---

## 💡 Notes Techniques

### Architecture Validée
✅ 11 services (8 métier + 3 infrastructure)
✅ 8 bases PostgreSQL séparées
✅ RabbitMQ pour messaging asynchrone
✅ Redis pour cache
✅ Eureka pour service discovery
✅ Config Server pour configuration centralisée
✅ API Gateway pour routage
✅ JWT pour authentification
✅ Spring Security avec permissions par rôle

### Intégrations Configurées
✅ Ticket/Abonnement ← PaymentEventListener
✅ Notification ← Ticket/Abonnement Events
✅ Trajet → Geolocalisation (WebClient)
✅ All services → Eureka
✅ All services → Config Server

### Améliorations Récentes (merge-final)
✅ JWT security ajouté à trajet-service et geolocalisation-service
✅ Permissions role-based sur 53 endpoints
✅ Liaison Tickets ↔ Trips (ligneId, stationDepartId, etc.)
✅ Liaison Abonnements ↔ Lignes (lignesAutorisees, zoneGeographique)
✅ UuidListConverter pour persistance List<UUID>

---

## 📞 Support & Debugging

### Commandes Utiles

```bash
# Vérifier tous les services
docker-compose ps

# Logs en temps réel
docker logs -f auth-service
docker logs -f api-gateway

# Rebuild un service
docker-compose build auth-service
docker-compose up -d auth-service

# Restart tous les services
docker-compose restart

# Vérifier Eureka
curl http://localhost:8761/eureka/apps

# Vérifier RabbitMQ
curl -u "${RABBITMQ_USER}:${RABBITMQ_PASSWORD}" http://localhost:15672/api/queues

# Vérifier santé
curl http://localhost:8086/actuator/health
```

### Variables d'Environnement Importantes

```bash
JWT_SECRET=<REDACTED>
JWT_EXPIRATION=86400000
SPRING_PROFILES_ACTIVE=dev
```

---

**Rapport généré automatiquement par Claude Code**
