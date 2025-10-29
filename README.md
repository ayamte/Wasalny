#  Wasalny - Plateforme de Gestion de Transport

## Structure du Projet

\\\
wasalny/
 backend/              # 8 Microservices
 infrastructure/       # Eureka, Gateway, Config
 frontend/            # Application React
 database/            # Scripts SQL
\\\

## Démarrage Rapide

### 1. Lancer les bases de données
\\\ash
docker-compose up -d
\\\

### 2. Lancer Eureka Server
\\\ash
cd infrastructure/eureka-server
mvn spring-boot:run
\\\

### 3. Lancer les microservices
\\\ash
cd backend/auth-service
mvn spring-boot:run
\\\

### 4. Lancer le frontend
\\\ash
cd frontend
npm install
npm run dev
\\\

## Accès

- Frontend: http://localhost:3000
- Eureka: http://localhost:8761
- RabbitMQ: http://localhost:15672 (admin/admin)

## Ports

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Auth | 8086 |
| User | 8083 |
| Trajet | 8081 |
| Géolocalisation | 8084 |
| Paiement | 8082 |
| Ticket | 8085 |
| Abonnement | 8087 |
| Notification | 8088 |
| Eureka | 8761 |
