# Guide de Migration UUID - Architecture Microservices Wasalny

**Date**: 2025-11-17
**Status**: ✅ Migration Complétée

## 🎯 Objectif

Corriger l'incohérence architecturale entre les services qui utilisaient des IDs numériques (BIGINT) et ceux qui attendaient des UUIDs.

## ❌ Problème Initial

### Incohérence d'Architecture

| Service | Type d'ID Avant | Problème |
|---------|-----------------|----------|
| **auth-service** | `BIGINT` (1, 2, 5...) | ❌ Incompatible avec ticket/paiement |
| **user-service** | `BIGINT` (1, 2, 5...) | ❌ Incompatible avec ticket/paiement |
| **ticket-service** | `UUID` | ✅ Format moderne |
| **paiement-service** | `UUID` | ✅ Format moderne |

### Conséquence

Impossible d'utiliser les endpoints comme:
```
GET /ticket-service/tickets/client/2
```
Car le service ticket attend un UUID comme `57af273f-2bb7-4813-88f7-a120c4f30b0d` et non `2`.

---

## ✅ Solution Appliquée

### Étape 1: Modification de la Base de Données

#### 1.1 Ajout de la colonne UUID dans `auth_db.users`

```sql
ALTER TABLE users
ADD COLUMN uuid UUID
DEFAULT gen_random_uuid()
UNIQUE NOT NULL;
```

**Résultat**: Tous les utilisateurs existants ont reçu automatiquement un UUID unique.

#### 1.2 Ajout de la colonne UUID dans `user_db.user_profiles`

```sql
ALTER TABLE user_profiles
ADD COLUMN uuid UUID
UNIQUE;
```

#### 1.3 Synchronisation des UUIDs

Les UUIDs ont été copiés de `auth_db.users` vers `user_db.user_profiles` en matchant par email:

```sql
UPDATE user_profiles up
SET uuid = u.uuid
FROM (VALUES
  ('ayakim127@gmail.com', 'c1f22693-7e22-45ec-ac2d-c4ffd919996d'::uuid),
  ('ayamtejjal123@gmail.com', '57af273f-2bb7-4813-88f7-a120c4f30b0d'::uuid),
  ...
) AS u(email, uuid)
WHERE up.email = u.email;
```

---

### Étape 2: Modifications du Code

#### 2.1 Auth-Service

**Fichiers modifiés**:

1. **`User.java`** (Entity)
```java
import java.util.UUID;

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private UUID uuid;  // ← NOUVEAU

    // Getters/Setters
    public UUID getUuid() { return uuid; }
    public void setUuid(UUID uuid) { this.uuid = uuid; }
}
```

2. **`LoginResponse.java`** (DTO)
```java
import java.util.UUID;

public class LoginResponse {
    private String token;
    private long expiresIn;
    private UUID userId;      // ← NOUVEAU
    private String email;      // ← NOUVEAU
    private String username;   // ← NOUVEAU
    private String role;       // ← NOUVEAU
}
```

3. **`AuthenticationController.java`**
```java
@PostMapping("/login")
public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto){
    User authenticatedUser = authenticationService.authenticate(loginUserDto);
    String jwtToken = jwtService.generateToken(authenticatedUser);

    LoginResponse loginResponse = new LoginResponse(
            jwtToken,
            jwtService.getExpirationTime(),
            authenticatedUser.getUuid(),      // ← NOUVEAU
            authenticatedUser.getEmail(),      // ← NOUVEAU
            authenticatedUser.getUsername(),   // ← NOUVEAU
            authenticatedUser.getRole().name() // ← NOUVEAU
    );
    return ResponseEntity.ok(loginResponse);
}
```

#### 2.2 User-Service

**Fichiers modifiés**:

1. **`UserProfile.java`** (Entity)
```java
import java.util.UUID;

public class UserProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private UUID uuid;  // ← NOUVEAU

    // Getters/Setters
    public UUID getUuid() { return uuid; }
    public void setUuid(UUID uuid) { this.uuid = uuid; }
}
```

2. **`UserInfoDto.java`** (DTO pour les réponses)
```java
import java.util.UUID;

public class UserInfoDto {
    private Long id;
    private UUID uuid;  // ← NOUVEAU
    private String email;
    private String username;
    private RoleUtilisateur role;

    // Getters/Setters
    public UUID getUuid() { return uuid; }
    public void setUuid(UUID uuid) { this.uuid = uuid; }
}
```

3. **`UserProfileService.java`** (Service - méthode convertToDto)
```java
private UserInfoDto convertToDto(UserProfile profile) {
    UserInfoDto dto = new UserInfoDto();
    dto.setId(profile.getId());
    dto.setUuid(profile.getUuid());  // ← NOUVEAU
    dto.setEmail(profile.getEmail());
    dto.setUsername(profile.getUsername());
    dto.setRole(profile.getRole());
    dto.setDateCreation(profile.getDateCreation());
    // ... rest of the mapping
    return dto;
}
```

---

### Étape 3: Rebuild et Redémarrage

```bash
# Auth-Service
cd backend/auth-service
mvn clean package -DskipTests
docker-compose build auth-service
docker-compose up -d --force-recreate auth-service

# User-Service
cd backend/user-service
mvn clean package -DskipTests
docker-compose build user-service
docker-compose up -d --force-recreate user-service
```

---

## 📊 Mapping des UUIDs Générés

| Email | ID (BIGINT) | UUID |
|-------|-------------|------|
| `ayakim127@gmail.com` | 1 | `c1f22693-7e22-45ec-ac2d-c4ffd919996d` |
| `testclient3@example.com` | 3 | `8118da2a-168b-48ac-b926-aea0525d3005` |
| `conducteurtest@example.com` | 4 | `178c5cdb-2459-4f7f-b3cb-658b39c08884` |
| `ayamtejjal123@gmail.com` | **5** | **`57af273f-2bb7-4813-88f7-a120c4f30b0d`** |
| `aya66v@gmail.com` | 7 | `5c746014-ac66-4ffa-aa95-cdc141da6385` |
| `ayamte127@gmail.com` | 8 | `581aa532-e2a2-452d-b089-45d02b44243d` |
| `testclient@wasalny.com` | 9 | `cc423251-4182-49c1-a20b-3f5be8f3408c` |

---

## 🧪 Tests

### Ancien Problème (❌ Ne fonctionnait PAS)

```bash
GET http://localhost:8080/ticket-service/tickets/client/2
# Erreur 400: Bad Request
```

### Nouvelle Solution (✅ Fonctionne)

```bash
GET http://localhost:8080/ticket-service/tickets/client/57af273f-2bb7-4813-88f7-a120c4f30b0d
Authorization: Bearer {token}
```

### Test de Login avec UUID

```bash
POST http://localhost:8080/auth-service/auth/login
Content-Type: application/json

{
  "email": "ayamtejjal123@gmail.com",
  "password": "<REDACTED>"
}
```

**Réponse attendue**:
```json
{
  "token": "<REDACTED>",
  "expiresIn": 3600000,
  "userId": "57af273f-2bb7-4813-88f7-a120c4f30b0d",
  "email": "ayamtejjal123@gmail.com",
  "username": "client1",
  "role": "CLIENT"
}
```

### Test User-Service avec UUID

```bash
GET http://localhost:8080/user-service/admin/users/role/CLIENT
Authorization: Bearer {token_admin}
```

**Réponse attendue** (avec UUIDs):
```json
[
  {
    "id": 2,
    "uuid": "57af273f-2bb7-4813-88f7-a120c4f30b0d",
    "email": "ayamtejjal123@gmail.com",
    "username": "client1",
    "role": "CLIENT",
    ...
  }
]
```

---

## ✅ Avantages de la Migration

1. **Cohérence Architecturale**: Tous les services utilisent maintenant des UUIDs
2. **Compatibilité**: Les endpoints ticket/paiement fonctionnent avec les clients
3. **Meilleure Pratique**: Les UUIDs sont préférables pour les systèmes distribués
4. **Rétrocompatibilité**: L'ID BIGINT est conservé pour la compatibilité interne

---

## 📝 Notes Importantes

- Les **IDs numériques (BIGINT) sont conservés** pour maintenir la compatibilité avec le code existant
- Les **UUIDs sont ajoutés en parallèle** sans supprimer l'ancien système
- **Double clé**: Vous pouvez utiliser soit `id` (BIGINT) soit `uuid` (UUID) selon le contexte
- **Migration future**: Recommandé de migrer progressivement vers l'utilisation exclusive d'UUIDs

---

## 🎯 Prochaines Étapes Recommandées

1. ✅ Tester tous les endpoints avec les nouveaux UUIDs
2. ⚠️ Mettre à jour la documentation API (Swagger/OpenAPI)
3. ⚠️ Informer l'équipe frontend des nouveaux champs `userId` (UUID)
4. ⚠️ Créer des tests d'intégration pour valider la migration
5. ⚠️ Considérer la migration complète vers UUIDs comme clé primaire (long terme)

---

**✅ Migration UUID terminée avec succès!**
