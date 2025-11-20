# 🧪 Guide de Test d'Authentification Complète

## ✅ Statut de Déploiement

**Frontend**: ✅ Accessible à `http://localhost:3000`  
**Auth Service**: ✅ Démarré sur le port `8086`  
**Base de Données**: ✅ PostgreSQL pour authentification  
**Redis**: ✅ Pour les sessions et cache  
**API Gateway**: ✅ Sur le port `8080`

---

## 🚀 Étapes de Test

### 1. Accéder au Frontend
```
🔗 http://localhost:3000
```
Vous devriez voir la page d'accueil avec un bouton "Sign up" et "Login" en haut à droite.

---

### 2. Test d'Inscription (Signup)

#### Étape 2.1: Cliquez sur "Sign up"
- Navigez vers http://localhost:3000
- Cliquez sur le bouton "Sign up" en haut à droite
- Ou accédez directement: http://localhost:3000/auth

#### Étape 2.2: Remplissez le Formulaire d'Inscription
Remplissez les champs suivants:
```
Nom d'Utilisateur:   testuser123
Email:               testuser@example.com
Mot de Passe:        <MOT_DE_PASSE_DE_TEST>
Prénom:              Test
Nom:                 User
Téléphone:           +212612345678
```

#### Étape 2.3: Soumettez le Formulaire
- Cliquez sur le bouton **"Sign Up"**
- Attendez quelques secondes (le backend traite la demande)
- Vous devez voir un **message de succès vert** : "Inscription réussie ! Vérifiez votre email pour confirmer votre compte."

#### Étape 2.4: Vérifiez l'Email
- Le backend envoie un **code de vérification par email**
- Consultez votre boîte email (testuser@example.com)
- Cherchez un email de la part de Wasalny avec le **code de vérification** (6 chiffres)
- ⚠️ **Si vous ne recevez pas d'email**: Consultez le dossier "Spam" ou vérifiez les logs du backend

---

### 3. Vérification de l'Email

#### Étape 3.1: Accéder à la Page de Vérification (À faire ultérieurement)
Une fois que le composant de vérification email est implémenté:
```
http://localhost:3000/email-verify
```

#### Étape 3.2: Entrez le Code
- Entrez le **code à 6 chiffres** reçu par email
- Cliquez sur **"Verify"**
- Le backend confirmera votre email

---

### 4. Test de Connexion (Login)

#### Étape 4.1: Cliquez sur "Login"
- Retournez à http://localhost:3000
- Cliquez sur **"Login"** (ou basculez l'onglet si vous êtes encore sur /auth)

#### Étape 4.2: Entrez vos Identifiants
```
Email:       testuser@example.com
Mot de Passe: <MOT_DE_PASSE_DE_TEST>
```

#### Étape 4.3: Connectez-vous
- Cliquez sur le bouton **"Login"**
- Attendez quelques secondes pour que le backend valide vos identifiants
- ✅ **Succès**: La page devrait rediriger vers `http://localhost:3000/` et afficher un message "Bienvenue, testuser!"
- ❌ **Erreur**: Voir section "Dépannage" ci-dessous

---

### 5. Vérification de la Session

#### Étape 5.1: Vérifiez les Données Locales
1. Ouvrez **DevTools** (F12)
2. Allez à **Application** → **Storage** → **Local Storage**
3. Vous devez voir:
   ```
   token: <REDACTED>
   user: {
     "id": "...",
     "email": "testuser@example.com",
     "username": "testuser123",
     "role": "CLIENT"
   }
   ```

#### Étape 5.2: Accédez aux Pages Protégées
Testez les routes protégées:
- http://localhost:3000/admin/configuration
- http://localhost:3000/admin/lignes
- http://localhost:3000/admin/stations

**✅ Résultat attendu**: Les pages se chargent et affichent le contenu  
**❌ Résultat attendu**: Vous êtes redirigé vers /auth (token invalide)

---

### 6. Test de Déconnexion

#### Étape 6.1: Déconnexion
- Sur la page d'accueil, cliquez sur **"Logout"** (bouton à droite de "Bienvenue")
- La page devrait rediriger vers `/auth`
- **localStorage** devrait être vide

#### Étape 6.2: Vérifiez que localStorage est Vide
1. DevTools → Application → Local Storage
2. Les clés `token` et `user` doivent être **supprimées**

#### Étape 6.3: Essayez d'Accéder à une Page Protégée
- Allez à http://localhost:3000/admin/configuration
- ❌ Vous devez être redirigé vers /auth

---

## 🔍 Vérification Backend

### Vérifiez les Logs de l'Auth Service
```bash
docker-compose logs auth-service --tail 50
```

**Cherchez:**
- ✅ `User registered successfully`
- ✅ `Verification code sent to email`
- ✅ `User logged in successfully`
- ❌ `ERROR` ou `Exception`

### Vérifiez la Base de Données
```bash
# Connectez-vous à PostgreSQL
docker exec -it postgres-auth psql -U wasalny_user -d auth_db

# Vérifiez les utilisateurs
SELECT id, email, username, verified FROM users;

# Vérifiez les codes de vérification
SELECT email, code, created_at FROM verification_codes ORDER BY created_at DESC;
```

---

## 🐛 Dépannage

### Problème 1: "Email ou mot de passe invalide"
**Causes possibles:**
- L'utilisateur n'existe pas (vérifiez la base de données)
- Le mot de passe est incorrect
- L'email n'a pas été vérifié (si requis par le backend)

**Solutions:**
1. Vérifiez le log du backend: `docker-compose logs auth-service`
2. Vérifiez la base de données: `SELECT * FROM users WHERE email = 'testuser@example.com';`
3. Vérifiez que l'email est correct (sensible à la casse)

---

### Problème 2: "Erreur de serveur interne (500)"
**Causes possibles:**
- L'Auth Service n'est pas disponible
- Erreur dans le backend (bug de code)
- Base de données indisponible

**Solutions:**
1. Vérifiez que tous les containers sont running: `docker-compose ps`
2. Vérifiez les logs: `docker-compose logs auth-service`
3. Redémarrez le service: `docker-compose restart auth-service`

---

### Problème 3: Les Pages Protégées Redirigent toujours vers /auth
**Causes possibles:**
- Le token n'est pas stocké en localStorage
- Le token est expiré
- Problème d'intercepteur axios

**Solutions:**
1. Vérifiez localStorage (DevTools → Application)
2. Vérifiez que le token commence par `eyJ` (JWT valide)
3. Vérifiez la console pour les erreurs (DevTools → Console)
4. Vérifiez que l'auth-service répond: `curl http://localhost:8086/actuator/health`

---

### Problème 4: "Email déjà utilisé"
**Solutions:**
1. Choisissez un nouveau email (ex: `testuser2@example.com`)
2. Ou supprimez l'utilisateur: 
   ```bash
   docker exec -it postgres-auth psql -U wasalny_user -d auth_db
   DELETE FROM users WHERE email = 'testuser@example.com';
   ```

---

### Problème 5: Je n'ai pas reçu d'email de vérification
**Vérifications:**
1. Dossier **Spam** - l'email a peut-être été filtré
2. Vérifiez les logs du backend: 
   ```bash
   docker-compose logs auth-service | grep -i "email\|mail"
   ```
3. Vérifiez que les variables d'environnement SMTP sont configurées:
   ```bash
   docker-compose config | grep -A5 "SUPPORT_EMAIL\|APP_PASSWORD"
   ```

---

## 📊 Flux de Test Complet

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Accédez à http://localhost:3000                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Cliquez sur "Sign up"                                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Remplissez le formulaire (nom d'utilisateur, email, etc) │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Recevez un email avec le code de vérification            │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Vérifiez votre email (une fois le composant implémenté)  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Connectez-vous avec email + mot de passe                 │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. ✅ Vous êtes maintenant connecté!                         │
│    - HomePage affiche: "Bienvenue, testuser!"               │
│    - localStorage contient le token et les données utilisateur│
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Accédez aux pages protégées (/admin/*)                   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Cliquez sur "Logout"                                     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. ✅ localStorage vidé, redirigé vers /auth               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔗 URLs Importantes

| Service | URL | Port | Statut |
|---------|-----|------|--------|
| Frontend | http://localhost:3000 | 3000 | ✅ Live |
| Auth Service | http://localhost:8086 | 8086 | ✅ Live |
| API Gateway | http://localhost:8080 | 8080 | ✅ Live |
| Eureka Server | http://localhost:8761 | 8761 | ✅ Live |
| Config Server | http://localhost:8888 | 8888 | ✅ Live |
| RabbitMQ | http://localhost:15672 | 15672 | ✅ Live |
| Redis | redis://localhost:6379 | 6379 | ✅ Live |

---

## 📝 Notes

- **JWT Expiration**: Par défaut 24 heures (86400000 ms)
- **Verification Code Expiration**: À définir dans le backend
- **Redis Cache**: Utilisé pour les sessions et l'optimisation
- **Database**: PostgreSQL avec migration Flyway/Liquibase

---

## ✨ Prochaines Étapes

Une fois le test d'authentification réussi:

1. [ ] Implémenter la page de vérification d'email (email-verify.jsx)
2. [ ] Ajouter la fonctionnalité "Forgot Password"
3. [ ] Implémenter les connexions sociales (Google, Apple, Meta)
4. [ ] Créer la page de profil utilisateur
5. [ ] Implémenter la modification du profil
6. [ ] Ajouter la validation à deux facteurs (2FA)
7. [ ] Implémenter les rôles et permissions (ROLE_ADMIN, ROLE_USER, etc.)

---

**Dernière mise à jour**: 19 Novembre 2025  
**Version**: 1.0.0  
**Statut**: ✅ Ready for Testing
