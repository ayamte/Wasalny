# 🔄 Intégration merge-final: trajet-service + merge2

**Date**: 2025-11-18
**Branche**: merge-final
**Services**: Tous les services de merge2 + trajet-service + geolocalisation-service

---

## ✅ Étapes Complétées

1. ✅ **Création branche merge-final** à partir de merge2
2. ✅ **Fusion trajet-service** dans merge-final
3. ✅ **Résolution conflits** notification-service (conservé version merge2 corrigée)

---

## 🚧 Étapes Restantes

### 1. Configuration Docker Compose

#### Services à ajouter:
- `trajet-service` (port 8089)
- `geolocalisation-service` (port 8090)
- `postgres-trajet` (port 5438)
- `postgres-geolocalisation` (port 5439)

#### Configuration trajet-service:
```yaml
trajet-service:
  build:
    context: ./backend/trajet-service
    dockerfile: Dockerfile
  container_name: wasalny-trajet-service
  ports:
    - "8089:8089"
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-trajet:5432/trajet_db
    SPRING_DATASOURCE_USERNAME: wasalny_user
    SPRING_DATASOURCE_PASSWORD: <REDACTED>
    EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
    SPRING_CLOUD_CONFIG_URI: http://config-server:8888
    GEOLOCALISATION_SERVICE_URL: http://geolocalisation-service:8090
  depends_on:
    - postgres-trajet
    - eureka-server
    - config-server
  networks:
    - wasalny-network
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8089/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 5
```

#### Configuration geolocalisation-service:
```yaml
geolocalisation-service:
  build:
    context: ./backend/geolocalisation-service
    dockerfile: Dockerfile
  container_name: wasalny-geolocalisation-service
  ports:
    - "8090:8090"
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-geolocalisation:5432/geolocalisation_db
    SPRING_DATASOURCE_USERNAME: wasalny_user
    SPRING_DATASOURCE_PASSWORD: <REDACTED>
    EUREKA_CLIENT_SERVICEURL_DEFAULTZONE: http://eureka-server:8761/eureka/
    SPRING_CLOUD_CONFIG_URI: http://config-server:8888
  depends_on:
    - postgres-geolocalisation
    - eureka-server
    - config-server
  networks:
    - wasalny-network
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8090/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 5
```

---

### 2. Configuration Base de Données

#### Créer postgres-trajet:
```yaml
postgres-trajet:
  image: postgres:15-alpine
  container_name: postgres-trajet
  ports:
    - "5438:5432"
  environment:
    POSTGRES_DB: trajet_db
    POSTGRES_USER: wasalny_user
    POSTGRES_PASSWORD: <REDACTED>
  volumes:
    - postgres-trajet-data:/var/lib/postgresql/data
  networks:
    - wasalny-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U wasalny_user -d trajet_db"]
    interval: 10s
    timeout: 5s
    retries: 5
```

#### Créer postgres-geolocalisation:
```yaml
postgres-geolocalisation:
  image: postgres:15-alpine
  container_name: postgres-geolocalisation
  ports:
    - "5439:5432"
  environment:
    POSTGRES_DB: geolocalisation_db
    POSTGRES_USER: wasalny_user
    POSTGRES_PASSWORD: <REDACTED>
  volumes:
    - postgres-geolocalisation-data:/var/lib/postgresql/data
  networks:
    - wasalny-network
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U wasalny_user -d geolocalisation_db"]
    interval: 10s
    timeout: 5s
    retries: 5
```

#### Volumes à ajouter:
```yaml
volumes:
  postgres-trajet-data:
  postgres-geolocalisation-data:
```

---

### 3. Configuration des Permissions (Sécurité)

#### Rôles à gérer:
- **ADMIN**: Accès complet à tous les endpoints
- **CLIENT**: Consultation lignes, stations, trips, suivi bus en temps réel
- **CONDUCTEUR**: Consultation trip assigné, confirmation passages, mise à jour localisation

#### Fichiers à créer/modifier:

##### trajet-service/config/SecurityConfiguration.java
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/**").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

##### trajet-service/config/JwtAuthenticationFilter.java
**À CRÉER** - Copier depuis paiement-service ou notification-service

##### trajet-service/config/JwtService.java
**À CRÉER** - Copier depuis paiement-service ou notification-service

#### Permissions par endpoint:

**LigneController**:
- `GET /api/trajets/lignes` → CLIENT, ADMIN, CONDUCTEUR
- `POST /api/trajets/lignes` → ADMIN seulement
- `PUT /api/trajets/lignes/{id}/*` → ADMIN seulement

**StationController**:
- `GET /api/trajets/stations` → CLIENT, ADMIN, CONDUCTEUR
- `POST /api/trajets/stations` → ADMIN seulement
- `PUT /api/trajets/stations/{id}/*` → ADMIN seulement

**BusController**:
- `GET /api/trajets/bus` → ADMIN, CONDUCTEUR
- `POST /api/trajets/bus` → ADMIN seulement
- `PUT /api/trajets/bus/{id}/*` → ADMIN seulement

**TripController**:
- `GET /api/trajets/trips` → CLIENT, ADMIN, CONDUCTEUR
- `GET /api/trajets/trips/search` → CLIENT, ADMIN, CONDUCTEUR
- `POST /api/trajets/trips` → ADMIN seulement
- `POST /api/trajets/trips/{id}/demarrer` → CONDUCTEUR seulement
- `POST /api/trajets/trips/{id}/terminer` → CONDUCTEUR seulement
- `DELETE /api/trajets/trips/{id}` → ADMIN seulement

**PassageStationController**:
- `POST /api/trajets/trips/{tripId}/confirmer-passage` → CONDUCTEUR seulement
- `GET /api/trajets/trips/{tripId}/passages` → CLIENT, ADMIN, CONDUCTEUR

**AssignationBusConducteurController**:
- `POST /api/trajets/assignations` → ADMIN seulement
- `GET /api/trajets/assignations/*` → ADMIN, CONDUCTEUR
- `PUT /api/trajets/assignations/{id}/desactiver` → ADMIN seulement

**ConfigurationHoraireController**:
- `POST /api/trajets/configurations-horaires` → ADMIN seulement
- `GET /api/trajets/configurations-horaires/*` → ADMIN, CONDUCTEUR
- `PUT /api/trajets/configurations-horaires/{id}/*` → ADMIN seulement

---

### 4. Liaison Tickets avec Trips

#### Modifications ticket-service:

**Entité Ticket** - Ajouter champs:
```java
@Column(name = "trip_id")
private UUID tripId;  // ID du trip dans trajet-service

@Column(name = "ligne_id")
private UUID ligneId;  // ID de la ligne

@Column(name = "station_depart_id")
private UUID stationDepartId;

@Column(name = "station_arrivee_id")
private UUID stationArriveeId;
```

#### Logique lors de l'émission d'un ticket:
1. CLIENT choisit un trip via `GET /api/trajets/trips/search`
2. CLIENT émet le ticket avec `POST /tickets/emettre` en incluant `tripId`
3. Ticket-service vérifie que le trip existe (appel à trajet-service)
4. Ticket-service stocke `tripId`, `ligneId`, `stationDepartId`, `stationArriveeId`
5. CLIENT peut suivre le bus du trip via `GET /api/locations/{busId}`

#### Endpoint à ajouter dans ticket-service:
```java
@GetMapping("/{ticketId}/trip-info")
@PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
public ResponseEntity<TripInfoDTO> getTripInfo(@PathVariable UUID ticketId) {
    // Retourner les infos du trip associé au ticket
}
```

---

### 5. Liaison Abonnements avec Trajets

#### Modifications abonnement-service:

**Entité Abonnement** - Ajouter champs:
```java
@Column(name = "lignes_autorisees")
@Convert(converter = StringListConverter.class)
private List<UUID> lignesAutorisees;  // Liste des lignes autorisées

@Column(name = "zone_geographique")
private String zoneGeographique;  // Ex: "Zone A", "Zone B", "Toutes zones"
```

#### Logique d'utilisation:
1. CLIENT avec abonnement actif consulte les lignes disponibles
2. Abonnement-service vérifie si la ligne est autorisée
3. Si oui, CLIENT peut utiliser n'importe quel trip de cette ligne
4. Validation lors de l'entrée dans le bus (à implémenter avec geolocalisation)

#### Endpoint à ajouter dans abonnement-service:
```java
@GetMapping("/{abonnementId}/lignes-autorisees")
@PreAuthorize("hasAnyRole('CLIENT', 'ADMIN')")
public ResponseEntity<List<LigneSimpleDTO>> getLignesAutorisees(@PathVariable UUID abonnementId) {
    // Retourner les lignes autorisées pour cet abonnement
}
```

---

### 6. Communication Entre Services

#### trajet-service → geolocalisation-service:
**Quand**: Le conducteur démarre un trip
**Action**: Créer la position initiale du bus
**Méthode**: WebClient (déjà configuré dans trajet-service)

#### trajet-service → geolocalisation-service:
**Quand**: Le conducteur confirme un passage
**Action**: Mettre à jour la position du bus
**Méthode**: WebClient

#### ticket-service → trajet-service:
**Quand**: Émission d'un ticket
**Action**: Vérifier que le trip existe et récupérer ses infos
**Méthode**: RestTemplate ou WebClient (à ajouter)

#### client → geolocalisation-service:
**Quand**: Suivi du bus en temps réel
**Action**: Récupérer la position actuelle du bus
**Endpoint**: `GET /api/locations/{busId}`

---

### 7. Config Server

#### Fichiers de configuration à créer/vérifier:

**trajet-service.yml**:
```yaml
server:
  port: 8089

spring:
  datasource:
    url: jdbc:postgresql://postgres-trajet:5432/trajet_db
    username: ${TRAJET_DB_USER:wasalny_user}
    password: ${TRAJET_DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

geolocalisation:
  service:
    url: ${GEOLOCALISATION_SERVICE_URL:http://localhost:8090}

eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/

security:
  jwt:
    secret-key: ${JWT_SECRET}
    expiration-time: ${JWT_EXPIRATION:3600000}
```

**geolocalisation-service.yml**:
```yaml
server:
  port: 8090

spring:
  datasource:
    url: jdbc:postgresql://postgres-geolocalisation:5432/geolocalisation_db
    username: ${GEOLOCALISATION_DB_USER:wasalny_user}
    password: ${GEOLOCALISATION_DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

eureka:
  client:
    service-url:
      defaultZone: http://eureka-server:8761/eureka/

security:
  jwt:
    secret-key: ${JWT_SECRET}
    expiration-time: ${JWT_EXPIRATION:3600000}
```

---

## 🧪 Plan de Test

### Phase 1: Services de base
1. Démarrer tous les services
2. Vérifier l'enregistrement sur Eureka
3. Tester les endpoints publics

### Phase 2: Permissions ADMIN
1. Login ADMIN
2. Créer des stations
3. Créer une ligne avec stations
4. Créer des bus
5. Créer des horaires
6. Assigner un conducteur à un bus

### Phase 3: Permissions CONDUCTEUR
1. Login CONDUCTEUR
2. Consulter son trip du jour
3. Démarrer le trip
4. Confirmer des passages aux stations
5. Terminer le trip

### Phase 4: Permissions CLIENT
1. Login CLIENT
2. Consulter les lignes
3. Rechercher des trips
4. Émettre un ticket pour un trip
5. Suivre le bus en temps réel

### Phase 5: Intégration abonnements
1. CLIENT achète un abonnement
2. Consulter les lignes autorisées
3. Utiliser l'abonnement pour un trajet

---

## 📝 Ordre d'implémentation recommandé

1. ✅ **Fusionner les branches** (FAIT)
2. 🔄 **Ajouter docker-compose** (EN COURS)
3. 🔄 **Ajouter configurations JWT** aux nouveaux services
4. 🔄 **Tester démarrage** de tous les services
5. 🔄 **Implémenter permissions** dans trajet-service
6. 🔄 **Lier tickets** avec trips
7. 🔄 **Lier abonnements** avec lignes
8. 🔄 **Tester flux complet**

---

**Prochaine action**: Modifier docker-compose.yml pour ajouter trajet-service et geolocalisation-service

**Auteur**: Claude Code
**Date**: 2025-11-18 17:20 UTC
