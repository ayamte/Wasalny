# Solution au problème du User-Service

## ✅ PROBLÈME RÉSOLU !

Le user-service fonctionne maintenant correctement après avoir appliqué la solution ci-dessous.

## 🔴 Problème Identifié

Le user-service **ne répondait à aucune requête HTTP** - même `/actuator/health` timeout après 30 secondes avec `ECONNRESET`.

### Symptômes :
1. Le service se connecte (TCP) mais ne répond jamais
2. Timeout après 30 secondes
3. Logs montrent que Tomcat a démarré sur le port 8083
4. Pas d'erreurs dans les logs

### Cause racine :
Le `PasswordService` (FeignClient vers auth-service) était injecté de manière **eager** dans le `ClientController`. À chaque requête HTTP, Spring essayait d'initialiser le FeignClient de façon synchrone, causant un blocage.

## ✅ Solution Appliquée

### Injection Lazy du FeignClient

La solution a consisté à injecter le `PasswordService` avec l'annotation `@Lazy` dans le `ClientController`.

**Fichier modifié** : `backend/user-service/src/main/java/com/wasalny/user/controller/ClientController.java`

```java
import org.springframework.context.annotation.Lazy;

@RestController
@RequestMapping("/client")
public class ClientController {
    private final UserProfileService userProfileService;
    private final PasswordService passwordService;

    public ClientController(UserProfileService userProfileService, @Lazy PasswordService passwordService) {
        this.userProfileService = userProfileService;
        this.passwordService = passwordService;
    }
    // ...
}
```

### Étapes de la correction :

1. Ajout de `@Lazy` sur le paramètre `PasswordService` du constructeur
2. Rebuild du service : `mvn clean package -DskipTests`
3. Rebuild de l'image Docker : `docker-compose build user-service`
4. Redémarrage du conteneur : `docker-compose up -d --force-recreate user-service`

### Résultat :

✅ Le service répond maintenant correctement à toutes les requêtes HTTP
✅ `/actuator/health` retourne HTTP 200
✅ Les endpoints admin fonctionnent (ex: `/admin/users/role/CLIENT`)
✅ Tous les 4 services (auth, user, ticket, paiement) sont maintenant opérationnels

## 🔍 Solutions Possibles (Archivées)

### Solution 1 : Tester avec l'API Gateway en attendant (obsolète)

~~Puisque le user-service a un problème, **utilisez auth-service pour les tests d'authentification** en attendant :~~

```http
# Créer un admin via auth-service
POST http://localhost:8080/auth-service/auth/signup
Content-Type: application/json

{
  "username": "admin2",
  "email": "admin2@wasalny.com",
  "password": "Admin123!@#",
  "role": "ADMIN",
  "nom": "Admin",
  "prenom": "Test"
}
```

### Solution 2 : Diagnostic approfondi du user-service

Le problème peut venir de :

1. **Un Filter/Interceptor qui bloque** (mais il n'y a pas de Spring Security)
2. **Une dépendance qui cause un deadlock**
3. **Un problème de configuration réseau interne au conteneur**
4. **Un problème avec OpenFeign** qui essaie d'appeler auth-service et crée un timeout

#### Action recommandée :

**Vérifier les appels OpenFeign dans le user-service** :

Le user-service a cette configuration Feign :
```
o.s.c.openfeign.FeignClientFactoryBean : For 'auth-service' URL not provided
```

Il est possible qu'il essaie d'appeler l'auth-service à chaque requête, créant un timeout.

### Solution 3 : Workaround temporaire - Accès direct aux routes

En attendant de corriger user-service, vous pouvez :

#### Pour tester les routes ADMIN, utilisez :
1. **Créer un compte admin via auth-service**
2. **Vous connecter pour obtenir un token**
3. **Tester les autres services** (ticket, paiement) qui fonctionnent

#### Routes qui fonctionnent actuellement :

✅ **AUTH-SERVICE** (http://localhost:8080/auth-service/)
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/verify`
- `POST /auth/resend`

✅ **TICKET-SERVICE** (http://localhost:8080/ticket-service/)
- `GET /tickets/{id}`
- `GET /tickets/client/{clientId}`
- `PUT /tickets/{id}/annuler` (CLIENT)
- `PUT /tickets/{id}/valider` (ADMIN)
- `PUT /tickets/{id}/rembourser` (ADMIN)

✅ **PAIEMENT-SERVICE** (http://localhost:8080/paiement-service/)
- `POST /paiements/initier` (CLIENT)
- `POST /paiements/{id}/traiter` (ADMIN)
- `GET /paiements/{id}`
- `GET /paiements/client/{clientId}`

❌ **USER-SERVICE** - NE FONCTIONNE PAS ACTUELLEMENT

### Solution 4 : Correction technique (si vous voulez corriger)

Il faudrait :

1. Vérifier si user-service appelle auth-service via Feign à chaque requête
2. Désactiver temporairement cette dépendance
3. Ajouter des logs de debug pour identifier où le service bloque
4. Potentiellement ajouter un timeout sur les appels Feign

## 📋 Scénario de test alternatif

### Test ADMIN (sans user-service) :

1. **Créer un compte admin**
   ```http
   POST http://localhost:8080/auth-service/auth/signup
   ```

2. **Se connecter**
   ```http
   POST http://localhost:8080/auth-service/auth/login
   ```

3. **Tester les routes ADMIN sur ticket-service**
   ```http
   GET http://localhost:8080/ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0
   Authorization: Bearer {token_admin}
   ```

4. **Valider un ticket (ADMIN)**
   ```http
   PUT http://localhost:8080/ticket-service/tickets/4ae6e073-f0c0-4195-80f7-1d7aa366d5c0/valider
   Authorization: Bearer {token_admin}
   ```

5. **Traiter un paiement (ADMIN)**
   ```http
   POST http://localhost:8080/paiement-service/paiements/b564bd98-2400-4961-b42e-60205e9b0092/traiter
   Authorization: Bearer {token_admin}
   ```

### Test CLIENT :

1. **Créer un compte client**
2. **Se connecter**
3. **Initier un paiement**
4. **Voir ses tickets**
5. **Annuler un ticket**

## ✅ Recommandation

**Pour vos tests actuels** :
- Concentrez-vous sur **auth-service, ticket-service et paiement-service** qui fonctionnent parfaitement
- Ignorez temporairement user-service
- Vous pouvez tester toutes les fonctionnalités ADMIN et CLIENT via les autres services

**Pour corriger user-service** :
- Il faudrait investiguer plus en profondeur le code Feign
- Vérifier s'il y a des appels circulaires entre auth-service et user-service
- Ajouter des timeouts sur les appels Feign

---

**Les 3 services fonctionnels vous permettent de faire tous vos tests !** 🚀
