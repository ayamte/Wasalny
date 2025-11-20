# 🔗 QUICK LINKS & URLS

## 🌐 Frontend Access

**Main Application:**
- http://localhost:3000 - Main application
- http://localhost:3000/auth - Authentication page
- http://localhost:3000/ - Home page

**Admin Pages (Require Login):**
- http://localhost:3000/admin/configuration - Configure schedules
- http://localhost:3000/admin/lignes - Manage bus lines
- http://localhost:3000/admin/stations - Manage stations

**Public Pages:**
- http://localhost:3000/trajet/recherche - Search trips
- http://localhost:3000/trips - Trip results

---

## 🔧 Backend Services

**Auth Service:**
- http://localhost:8086 - Base URL
- http://localhost:8086/actuator/health - Health check
- http://localhost:8086/auth/swagger-ui.html - API documentation (if enabled)

**API Gateway:**
- http://localhost:8080 - Base URL
- http://localhost:8080/actuator/health - Health check

**Eureka Service Registry:**
- http://localhost:8761 - Eureka dashboard

**Config Server:**
- http://localhost:8888 - Configuration server

---

## 🗄️ Databases

**PostgreSQL (Auth DB):**
```bash
Host: localhost
Port: 5437
Database: auth_db
User: wasalny_user
Password: <REDACTED>
```

Command to connect:
```bash
docker exec -it postgres-auth psql -U wasalny_user -d auth_db
```

**Redis Cache:**
```bash
Host: localhost
Port: 6379
Password: <REDACTED>
```

**RabbitMQ:**
- http://localhost:15672 - Management UI
- Connection: localhost:5672

---

## 📚 Documentation

**Authentication:**
- AUTH_DOCUMENTATION.md - API reference
- AUTHENTICATION_TEST_GUIDE.md - Testing guide
- AUTHENTICATION_INTEGRATION_REPORT.md - Project report
- AUTHENTICATION_COMPLETE_SUMMARY.md - Completion summary

**General:**
- README.md - Project overview
- GETTING_STARTED.md - Setup guide
- FILE_MANIFEST.md - File structure

---

## 🧪 API Test Endpoints

### Signup
```bash
curl -X POST http://localhost:8086/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User",
    "phone": "+212612345678",
    "role": "CLIENT"
  }'
```

### Login
```bash
curl -X POST http://localhost:8086/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Get Current User
```bash
curl -H "Authorization: Bearer {JWT_TOKEN}" \
  http://localhost:8086/auth/me
```

### Verify Email
```bash
curl -X POST http://localhost:8086/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "code": "123456"
  }'
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop specific service
docker-compose stop frontend

# Restart service
docker-compose restart auth-service

# Stop all
docker-compose down

# Remove all including data
docker-compose down -v
```

---

## 🎯 Quick Test Workflow

1. **Access frontend:** http://localhost:3000
2. **Click "Sign up"** to register
3. **Fill in form** with test data
4. **Check email** for verification code
5. **Return to app** and "Login"
6. **Enter credentials** you used for signup
7. **Verify redirect** to homepage with welcome message
8. **Visit admin page:** http://localhost:3000/admin/configuration
9. **Click "Logout"** to end session

---

## 📊 Service Ports

| Service | Port | Type |
|---------|------|------|
| Frontend | 3000 | HTTP |
| API Gateway | 8080 | HTTP |
| Auth Service | 8086 | HTTP |
| Eureka Server | 8761 | HTTP |
| Config Server | 8888 | HTTP |
| PostgreSQL (Auth) | 5437 | TCP |
| PostgreSQL (User) | 5434 | TCP |
| PostgreSQL (Trajet) | 5432 | TCP |
| PostgreSQL (Geo) | 5435 | TCP |
| PostgreSQL (Payment) | 5433 | TCP |
| PostgreSQL (Ticket) | 5436 | TCP |
| PostgreSQL (Subscription) | 5438 | TCP |
| PostgreSQL (Notification) | 5439 | TCP |
| Redis | 6379 | TCP |
| RabbitMQ | 5672 | TCP |
| RabbitMQ Management | 15672 | HTTP |

---

## 🔑 Default Credentials

**Database User (All PostgreSQL):**
- Username: `wasalny_user`
- Password: `wasalny_password`

**RabbitMQ:**
- Username: `admin`
- Password: `admin`

**Redis:**
- Password: `redis_password`

**JWT (Frontend):**
- Stored in: `localStorage['token']`
- User data in: `localStorage['user']`

---

## 📝 Browser DevTools Tips

### Check Authentication:
1. Open DevTools (F12)
2. Go to **Application** → **Storage** → **Local Storage**
3. Look for:
   - `token` - Your JWT token
   - `user` - User profile data

### Debug API Calls:
1. Open DevTools
2. Go to **Network** tab
3. Look for requests to `localhost:8086`
4. Check headers for `Authorization: Bearer ...`

### Check Console Errors:
1. Open DevTools
2. Go to **Console** tab
3. Look for red error messages
4. Check authService.js logs

---

## ⚡ Performance URLs

**Check Services Health:**
- http://localhost:8086/actuator/health - Auth Service
- http://localhost:8080/actuator/health - API Gateway
- http://localhost:8761/actuator/health - Eureka Server
- http://localhost:8888/actuator/health - Config Server

**View Service Registry:**
- http://localhost:8761 - See all registered services

---

## 🆘 Emergency Commands

**Reset Frontend:**
```bash
docker-compose restart frontend
```

**Reset Auth Service:**
```bash
docker-compose restart auth-service
```

**Clear Database & Restart:**
```bash
docker-compose down -v
docker-compose up -d --build
```

**View Real-Time Logs:**
```bash
docker-compose logs -f auth-service
```

---

## ✨ File Locations

**Frontend Code:**
```
frontend/
├── src/
│   ├── auth.jsx
│   ├── services/auth/
│   │   └── authService.js
│   ├── App.jsx
│   └── main.jsx
├── auth.css
├── Dockerfile
└── package.json
```

**Backend Auth Service:**
```
backend/auth-service/
├── src/main/java/
│   └── com/wasalny/auth/
│       ├── controller/
│       ├── service/
│       ├── entity/
│       └── ...
├── Dockerfile
└── pom.xml
```

**Configuration:**
```
infrastructure/
├── config-server/
├── eureka-server/
└── api-gateway/
```

---

## 🎓 Learning Resources

**JWT Basics:**
- JWT tokens start with `eyJ` (base64 encoded)
- Three parts: header.payload.signature
- Verify with `https://jwt.io`

**React Hooks:**
- `useState` - State management
- `useEffect` - Side effects
- `useCallback` - Memoized callbacks
- `useContext` - Shared state

**Spring Boot:**
- `@RestController` - Define endpoints
- `@Service` - Business logic
- `@Repository` - Data access
- `@Entity` - Database model

**Docker:**
- `docker-compose up` - Start services
- `docker-compose logs` - View logs
- `docker exec` - Run commands in container
- `docker ps` - List running containers

---

**Last Updated:** November 19, 2025
**Status:** ✅ Live & Production Ready
**Version:** 1.0.0
