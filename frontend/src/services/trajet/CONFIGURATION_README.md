# Configuration Horaire - Documentation d'Intégration

## 📋 Vue d'Ensemble

Le module de **Configuration Horaire** est une interface d'administration pour gérer les horaires et les trajets des bus. Il permet aux administrateurs de :

- ✅ Créer et modifier des configurations horaires
- ✅ Simuler et prévisualiser les horaires générés
- ✅ Gérer les pauses et les intervalles entre bus
- ✅ Configurer les temps d'arrêt à chaque station
- ✅ Générer automatiquement les trajets

## 🏗️ Architecture

```
frontend/
└── src/
    └── services/
        └── trajet/
            ├── pages/
            │   └── configuration/
            │       ├── configuration.jsx      # Composant principal
            │       └── configuration.css      # Styles
            ├── configurationService.js        # Services API
            └── index.js                       # Point d'entrée
```

## 📦 Fichiers Créés

### 1. **configuration.jsx**
Composant React principal avec :
- Gestion de l'état des configurations
- Formulaires d'entrée utilisateur
- Aperçu et simulation des horaires
- Gestion des notifications (Toast)
- Intégration API

### 2. **configuration.css**
Styles personnalisés incluant :
- Design responsive (mobile, tablet, desktop)
- Palette de couleurs Wasalny (Orange #FF6B35)
- Animations fluides
- Support du mode sombre
- Styles d'impression

### 3. **configurationService.js**
Services API pour communiquer avec le backend :
- Configuration horaire
- Gestion des lignes
- Gestion des stations
- Gestion des bus
- Gestion des trajets
- Gestion des erreurs

## 🚀 Utilisation

### Importer le composant

```javascript
import ConfigurationPage from '@/services/trajet/pages/configuration/configuration';

export default function App() {
  return <ConfigurationPage />;
}
```

### Structure des données

#### ScheduleData
```javascript
{
  numberOfBuses: 4,              // Nombre de bus par sens
  firstDepartureA: '07:00',      // Premier départ Station A
  firstDepartureB: '07:00',      // Premier départ Station B
  intervalMinutes: 30,            // Intervalle entre bus (minutes)
  durationAB: 60,                 // Durée trajet A→B (minutes)
  durationBA: 60,                 // Durée trajet B→A (minutes)
  pauseStationA: 30,              // Pause Station A (minutes)
  pauseStationB: 30,              // Pause Station B (minutes)
  stations: [                     // Stations et temps d'arrêt
    { name: 'Casa', stopTime: 5 },
    { name: 'Ain Sebaa', stopTime: 5 },
    // ...
  ],
}
```

#### CalculatedSchedule (Résultat)
```javascript
{
  totalBuses: 8,                  // Total de bus (sens A→B + sens B→A)
  totalTrips: 8,                  // Total de trajets générés
  coverageStart: '07:00',         // Début de couverture horaire
  coverageEnd: '18:30',           // Fin de couverture horaire
  averageFrequency: 30,           // Fréquence moyenne (minutes)
  departuresA: ['07:00', '07:30', ...],  // Départs sens A→B
  departuresB: ['07:00', '07:30', ...],  // Départs sens B→A
}
```

## 🔌 Intégration API

### Configuration créée

```http
POST /api/trajets/config-horaire
Content-Type: application/json
Authorization: Bearer {token}

{
  "lineId": "1",
  "numberOfBuses": 4,
  "firstDepartureA": "07:00",
  "firstDepartureB": "07:00",
  "intervalMinutes": 30,
  "durationAB": 60,
  "durationBA": 60,
  "pauseStationA": 30,
  "pauseStationB": 30,
  "stations": [
    { "name": "Casa", "stopTime": 5 },
    { "name": "Ain Sebaa", "stopTime": 5 },
    { "name": "Témara", "stopTime": 5 },
    { "name": "Agdal", "stopTime": 5 },
    { "name": "Rabat", "stopTime": 5 }
  ]
}
```

### Configuration récupérée

```http
GET /api/trajets/config-horaire/ligne/{lineId}
Authorization: Bearer {token}
```

### Simuler une configuration

```http
POST /api/trajets/config-horaire/simuler
Content-Type: application/json
Authorization: Bearer {token}

{
  "numberOfBuses": 4,
  "firstDepartureA": "07:00",
  "firstDepartureB": "07:00",
  "intervalMinutes": 30,
  "durationAB": 60,
  "durationBA": 60,
  "pauseStationA": 30,
  "pauseStationB": 30
}
```

### Générer les trajets

```http
POST /api/trajets/config-horaire/{configId}/generer-trips
Authorization: Bearer {token}
```

## 📱 Fonctionnalités Principales

### 1. Configuration Générale
- Nombre de bus par sens
- Premiers départs (Station A et B)

### 2. Intervalles et Durées
- Intervalle entre bus
- Durée trajet A→B et B→A
- Pauses aux stations

### 3. Stations et Temps d'Arrêt
- Liste éditable des stations
- Configuration du temps d'arrêt à chaque station

### 4. Aperçu Planning
- Timeline visuelle des premiers départs
- Toggle entre sens A→B et B→A
- Représentation graphique avec icônes bus

### 5. Simulation
- Affichage détaillé de tous les départs
- Comparaison entre deux directions
- Récapitulatif des statistiques

### 6. Récapitulatif
- Total de bus
- Nombre de trajets générés
- Couverture horaire (début - fin)
- Fréquence moyenne

## 🎨 Customisation

### Couleurs
Modifiez les variables CSS dans `configuration.css` :

```css
:root {
  --color-primary: #FF6B35;              /* Orange Wasalny */
  --color-primary-hover: #FF5520;        /* Orange foncé */
  --color-black: #000000;                /* Noir */
  --color-white: #FFFFFF;                /* Blanc */
  --color-gray-light: #F5F5F5;           /* Gris clair */
  /* ... autres variables ... */
}
```

### Mise en page
- Responsive design (mobile-first)
- Grid layouts adaptatifs
- Breakpoints: 640px, 768px, 1024px, 1280px

### Animations
- Transitions fluides (0.3s)
- Animations d'entrée (slideIn)
- Support du mode "prefers-reduced-motion"

## 🔐 Sécurité

### Authentification
Le composant utilise les tokens JWT stockés en localStorage :

```javascript
const token = localStorage.getItem('token');
```

### Autorisation
- Seul les ADMIN peuvent accéder à cette page
- Les requêtes incluent automatiquement le header `Authorization: Bearer {token}`
- Redirection vers login en cas d'erreur 401

## ⚡ Performance

### Optimisations
- `useMemo` pour calculs de schedule
- `useCallback` pour handlers
- Pagination des simulations (affichage limité)
- CSS efficace sans dépendances externes

### Bundle
- **Configuration.jsx**: ~8KB
- **Configuration.css**: ~25KB
- **Service.js**: ~5KB
- Total: ~38KB (non compressé)

## 🧪 Tests

### Cas d'Usage

```javascript
// Test 1: Modifier nombre de bus
setSchedule({ ...schedule, numberOfBuses: 6 });

// Test 2: Changer intervalle
setSchedule({ ...schedule, intervalMinutes: 20 });

// Test 3: Ajouter station
const newStations = [...schedule.stations, { name: 'Fès', stopTime: 5 }];
setSchedule({ ...schedule, stations: newStations });

// Test 4: Sauvegarder configuration
handleSave(); // POST /api/trajets/config-horaire
```

## 📚 Exemple Complet

```javascript
import React from 'react';
import ConfigurationPage from '@/services/trajet/pages/configuration/configuration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/configuration" element={<ConfigurationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
```

## 🐛 Dépannage

### Le formulaire ne se soumet pas
- Vérifier que le token est présent dans localStorage
- Vérifier que l'utilisateur a le rôle ADMIN

### Les requêtes échouent
- Vérifier que le backend Trajet Service est démarré (port 8081)
- Vérifier l'URL de l'API dans configurationService.js
- Consulter les logs du navigateur (F12 → Console)

### Les styles ne s'appliquent pas
- Vérifier que configuration.css est importé dans configuration.jsx
- Vérifier que les chemins des fichiers sont corrects
- Vider le cache du navigateur (Ctrl+Shift+Delete)

## 📞 Support

Pour toute question ou problème, consultez :
1. Documentation du backend: `/backend/trajet-service/README.md`
2. Logs du navigateur: F12 → Console
3. Logs du serveur: `docker logs wasalny-trajet-service`

## 🔄 Mise à Jour

Pour intégrer avec une vraie base de données :

1. Remplacer les données mock dans `configuration.jsx` :
```javascript
// Avant (mock)
const LINES = [
  { id: 1, name: 'Ligne 1', route: 'Casablanca - Rabat' },
];

// Après (API réelle)
useEffect(() => {
  ligneService.getAllLines().then(setLines);
}, []);
```

2. Activer l'appel API réelle dans `handleSave()` :
```javascript
const response = await configurationService.createConfiguration(
  selectedLine,
  configData
);
```

---

**Version**: 1.0.0  
**Créé**: 2025-11-19  
**Framework**: React + Vite  
**Style**: CSS3 + CSS Variables
