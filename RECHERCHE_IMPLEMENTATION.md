# Implémentation de la Page Recherche des Trajets

## 📋 Vue d'ensemble

Deux nouveaux fichiers ont été créés pour implémenter le système de recherche des trajets :

### 1. **recherche.jsx** (380 lignes)
Fichier contenant les deux composants React principaux :
- **SearchTripsPage** : Page de formulaire pour chercher des trajets
- **TripsPage** : Page d'affichage des résultats

**Localisation** : `frontend/src/services/trajet/pages/recherche/recherche.jsx`

### 2. **recherche.css** (800 lignes)
Fichier de stylisation complet avec :
- Variables de couleurs (Wasalny branding)
- Grilles responsives
- Animations et transitions
- Support du mode sombre
- Accessibilité

**Localisation** : `frontend/src/services/trajet/pages/recherche/recherche.css`

---

## 🛣️ Routes Intégrées

Les routes suivantes ont été ajoutées à `App.jsx` :

### Route 1 : Formulaire de Recherche
```
Path: /trajet/recherche
Component: SearchTripsPage
Fonction: Permet aux utilisateurs de chercher des trajets
```

### Route 2 : Résultats de Recherche
```
Path: /trips
Component: TripsPage
Fonction: Affiche les résultats de la recherche
```

---

## 📱 Fonctionnalités de SearchTripsPage

### Éléments du Formulaire
1. **Station de Départ** - Sélecteur avec stations disponibles
2. **Station d'Arrivée** - Sélecteur avec stations disponibles
3. **Bouton d'Inversion** - Échange rapidement départ et arrivée
4. **Date de Voyage** - Sélecteur de date
5. **Bouton Rechercher** - Lance la recherche et navigation

### Gestion d'État
```javascript
const [departureStation, setDepartureStation] = useState('')
const [arrivalStation, setArrivalStation] = useState('')
const [searchDate, setSearchDate] = useState('')
```

### Fonctionnalités
- **Validation** : Vérifies que tous les champs sont remplis
- **Swap Stations** : Inverse départ et arrivée
- **Navigation** : Navigue vers `/trips` avec paramètres de recherche

---

## 📊 Fonctionnalités de TripsPage

### Affichage des Résultats
Chaque trajet affiche :
- **Numéro de ligne** - Badge couleur primaire
- **Heure de départ** - En gros caractères
- **Heure d'arrivée** - Alignée à droite
- **Durée du trajet** - Calculée automatiquement
- **Prix** - En couleur primaire
- **Disponibilité** - Nombre de places avec coloration dynamique
- **Bouton Réserver** - Pour effectuer la réservation

### Récupération des Paramètres
```javascript
const [searchParams] = useSearchParams()
const departure = searchParams.get('departure')
const arrival = searchParams.get('arrival')
const date = searchParams.get('date')
```

### Génération de Données de Test
La fonction `generateTrips()` crée 3-8 trajets fictifs pour démonstration.

---

## 🎨 Système de Design

### Couleurs
```css
--color-primary: #FF6B35      /* Orange Wasalny */
--color-black: #000000        /* Noir */
--color-white: #FFFFFF       /* Blanc */
--color-gray-light: #F5F5F5
--color-gray-medium: #E0E0E0
--color-gray-dark: #333333
```

### Espacement
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
```

### Rayon des Bordures
```css
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
```

---

## 🌙 Mode Sombre

Le CSS inclut le support du mode sombre via `@media (prefers-color-scheme: dark)` :
- Arrière-plans adaptés
- Textes contrastants
- Bordures visibles

---

## ♿ Accessibilité

### Implémentations
- **Focus visible** : Style focus pour tous les boutons interactifs
- **Réduction du mouvement** : Respecte `prefers-reduced-motion`
- **Contraste suffisant** : Ratios WCAG AA
- **Sémantique HTML** : Labels associés aux inputs
- **Navigation au clavier** : Tous les éléments sont accessible au clavier

---

## 📱 Responsive Design

### Points de Rupture
- **Mobile** : jusqu'à 640px
- **Tablette** : 641px - 1024px
- **Desktop** : 1025px+

### Ajustements
- Grilles passent de 4 colonnes à 2 à 1
- Espacing adapté
- Tailles de police réduites sur mobile

---

## 🔄 Intégration avec React Router

### Navigation depuis SearchTripsPage
```javascript
const navigate = useNavigate()
navigate(`/trips?departure=${departure}&arrival=${arrival}&date=${date}`)
```

### Retour aux Résultats
Bouton retour dans TripsPage qui revient à SearchTripsPage

---

## 🚀 Accès via Docker

### URLs d'Accès
```
Recherche: http://localhost:3000/trajet/recherche
Résultats: http://localhost:3000/trips (après recherche)
Accueil:   http://localhost:3000/
```

### Commande Docker
```bash
docker-compose up -d --build frontend
```

---

## 📝 Structure des Fichiers

```
frontend/
└── src/
    ├── App.jsx (MODIFIÉ - ajout des routes)
    └── services/
        └── trajet/
            └── pages/
                └── recherche/
                    ├── recherche.jsx (NOUVEAU)
                    └── recherche.css (NOUVEAU)
```

---

## ✅ Checklist d'Intégration

- [x] recherche.jsx créé avec SearchTripsPage
- [x] recherche.jsx créé avec TripsPage
- [x] recherche.css créé avec tous les styles
- [x] Routes ajoutées à App.jsx
- [x] Navigation header mise à jour
- [x] Imports correctement ajoutés
- [x] Données de test génération fonctionnelle
- [x] Support du mode sombre implémenté
- [x] Accessibilité traitée
- [x] Design responsive validé

---

## 🔄 Prochaines Étapes

### À faire :
1. **Backend API** : Implémenter les endpoints de recherche
   - POST /trips/search
   - GET /trips/{id}
   - POST /bookings

2. **Intégration API** : Remplacer les données de test par les appels API
   ```javascript
   const trips = await tripService.searchTrips({
     departure, 
     arrival, 
     date
   })
   ```

3. **Authentification** : Ajouter la vérification JWT
4. **Tests** : Unit tests et E2E tests
5. **Optimisation** : Pagination, filtres avancés

---

## 📞 Support

### Fichiers de Référence
- Configuration horaire : `frontend/src/services/trajet/pages/configuration/configuration.jsx`
- Configuration CSS : `frontend/src/services/trajet/pages/configuration/configuration.css`
- Service API : `frontend/src/services/configurationService.js`

### Documentation
- API Endpoints : `API_ENDPOINTS_CORRECTED.md`
- Guide de démarrage : `GETTING_STARTED.md`
