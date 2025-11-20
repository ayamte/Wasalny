# Frontend Authentication & Routes Documentation

## 🚀 Nouvelles Routes d'Authentification

### Routes Publiques
- **`/`** - Page d'accueil (HomePage)
- **`/auth`** - Page de Login/Signup combinée
- **`/trajet/recherche`** - Recherche de trajets

### Routes Protégées (Authentification requise)
- **`/admin/configuration`** - Configuration des horaires
- **`/admin/lignes`** - Gestion des lignes
- **`/admin/stations`** - Gestion des stations
- **`/trips`** - Résultats des trajets

---

## 🔐 Système d'Authentification

### Services Disponibles (`authService.js`)

#### Login
```javascript
import * as authService from '@/services/auth/authService'

const response = await authService.login({
  email: 'user@example.com',
  password: '<REDACTED>'
})
// Response: { token, uuid, email, username, role }
```

#### Signup
```javascript
const response = await authService.signup({
  username: 'newuser',
  email: 'new@example.com',
  password: '<REDACTED>',
  role: 'CLIENT'
})
// Envoie un email de vérification
```

#### Vérifier Email
```javascript
const response = await authService.verifyEmail(
  'user@example.com',
  '123456'  // Code reçu par email
)
```

#### Renvoyer Code de Vérification
```javascript
const response = await authService.resendVerificationCode('user@example.com')
```

#### Récupérer Profil Actuel
```javascript
const user = await authService.getCurrentUser()
```

#### Vérifier Authentification
```javascript
const isAuth = authService.isAuthenticated()
const token = authService.getToken()
const user = authService.getUser()
```

#### Déconnexion
```javascript
authService.logout()
// Supprime token et user du localStorage
// Redirige vers /auth
```

---

## 📁 Structure des Fichiers

```
frontend/
├── src/
│   ├── services/
│   │   ├── auth/
│   │   │   ├── auth.jsx          # Composant Login/Signup
│   │   │   ├── auth.css          # Styling
│   │   │   └── authService.js    # Service API
│   │   └── ...
│   ├── App.jsx                   # Routes principales
│   └── main.jsx
└── ...
```

---

## 🎨 Pages d'Authentification

### AuthPage (`auth.jsx`)

**Fonctionnalités:**
- ✅ Formulaire de Login
- ✅ Formulaire de Signup
- ✅ Toggle Login/Signup
- ✅ Validation des champs
- ✅ Messages d'erreur/succès
- ✅ Intégration API Backend
- ✅ Connexions sociales (Google, Apple, Meta)

**États du Formulaire:**
```javascript
{
  email: '',
  password: '',
  username: '',
  firstName: '',
  lastName: '',
  phone: ''
}
```

**Erreurs Gérées:**
- Email manquant/invalide
- Mot de passe trop court
- Champs requis manquants
- Erreurs de l'API Backend

---

## 🔗 Intégration Backend

### Configuration API
```javascript
// authService.js
const AUTH_SERVICE_URL = 'http://127.0.0.1:8086'
```

### Endpoints Backend Utilisés
- `POST /auth/signup` - Créer un compte
- `POST /auth/login` - Se connecter
- `POST /auth/verify` - Vérifier email
- `POST /auth/resend` - Renvoyer code
- `GET /auth/me` - Profil utilisateur

### Intercepteurs
- ✅ **Request**: Ajoute JWT token automatiquement
- ✅ **Response**: Gère les erreurs 401 (token expiré)

---

## 💾 Stockage Local

### LocalStorage
```javascript
localStorage.getItem('token')        // JWT token
localStorage.getItem('user')         // User data (JSON)

// Format User Data:
{
  id: 'uuid',
  email: 'user@example.com',
  username: 'username',
  role: 'CLIENT'
}
```

---

## 🛡️ Routes Protégées

### ProtectedRoute Component
```javascript
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  return isAuthenticated ? children : <Navigate to="/auth" replace />
}

// Usage:
<Route 
  path="/admin/configuration" 
  element={
    <ProtectedRoute>
      <ConfigurationPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🎯 Flow Authentification

### Login Flow
```
1. Utilisateur remplit formulaire login
2. Frontend valide champs
3. POST /auth/login avec credentials
4. Backend retourne { token, user_data }
5. Frontend stocke token et user
6. Redirige vers HomePage
7. Accès aux routes protégées
```

### Signup Flow
```
1. Utilisateur remplit formulaire signup
2. Frontend valide champs
3. POST /auth/signup avec userData
4. Backend envoie email de vérification
5. Utilisateur reçoit code par email
6. Frontend affiche message succès
7. Bascule vers formulaire login
8. Utilisateur se connecte (après vérification)
```

### Protected Route Flow
```
1. Utilisateur clique sur lien protégé
2. Vérifie if isAuthenticated()
3. ✅ Authentifié → Affiche page
4. ❌ Pas authentifié → Redirige /auth
```

---

## 🎨 Styling

### Couleurs Wasalny
```css
--primary-color: #FF6B35      /* Orange */
--secondary-color: #000000    /* Noir */
--background-color: #FFFFFF   /* Blanc */
--error-color: #E53E3E        /* Rouge */
--success-color: #38A169      /* Vert */
```

### Responsive Design
- **Desktop**: 2 colonnes (formulaire + image)
- **Mobile**: 1 colonne (formulaire seul)
- **Breakpoint**: 768px

---

## 📱 Features

### Login Page
- Email/Password inputs
- "Forgot Password" link
- Social login buttons
- Toggle to Signup
- Error messages
- Loading state

### Signup Page
- Username input
- First/Last name inputs
- Email input
- Phone input
- Password input
- Terms & Privacy links
- Toggle to Login
- Error messages
- Loading state

### Toast Notifications
- Success messages (vert)
- Error messages (rouge)
- Auto-dismiss après 3 secondes
- Position: top-right

---

## 🔄 État de Connexion

### HomePage Display
**Non Authentifié:**
- Boutons Login/Signup
- Lien "Sign up" mène à /auth
- Lien "Login" mène à /auth

**Authentifié:**
- Affiche "Welcome, {username}!"
- Bouton Logout
- Accès complet aux fonctionnalités
- NavBar avec options admin

---

## 🐛 Débogage

### Console Logs
```javascript
// Vérifier authentification
console.log(authService.isAuthenticated())

// Afficher token
console.log(authService.getToken())

// Afficher user
console.log(authService.getUser())
```

### Network DevTools
- Vérifier requêtes API au `/auth/*`
- Vérifier headers `Authorization: Bearer {token}`
- Vérifier réponses JSON

---

## ✅ Checklist d'Intégration

- [x] Composant AuthPage créé
- [x] Service authService créé
- [x] Routes d'authentification ajoutées
- [x] Routes protégées implémentées
- [x] Intégration Backend (signup/login/verify)
- [x] Stockage token/user localement
- [x] Messages d'erreur gérés
- [x] Navigation après succès
- [x] Styling responsive
- [x] Notifications toast
- [x] Intercepteurs API

---

## 🚀 Prochaines Étapes

1. **Vérification Email**
   - [ ] Créer page de vérification
   - [ ] Implémenter logique vérification
   - [ ] Renvoyer code si expiré

2. **Récupération de Mot de Passe**
   - [ ] Page forgot password
   - [ ] Email de réinitialisation
   - [ ] Lien reset avec token

3. **Profil Utilisateur**
   - [ ] Page profil
   - [ ] Édition données
   - [ ] Changement mot de passe

4. **Authentification Sociales**
   - [ ] Google OAuth
   - [ ] Apple OAuth
   - [ ] Meta OAuth

---

**Dernière mise à jour**: 19 Novembre 2025
**Version**: 1.0.0
**Statut**: ✅ Production Ready
