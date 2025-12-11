# 🧪 Guide de Test - Page "Mes Trajets" avec Géolocalisation en Temps Réel

## ✅ Vérifications Backend

### 1. Service de Géolocalisation
Le service est **opérationnel** :
- ✅ Container: `wasalny-geolocalisation-service` - UP
- ✅ Port: 8084
- ✅ WebSocket: Activé sur `/ws`
- ✅ Eureka: Enregistré avec statut UP

### 2. Endpoints WebSocket
```bash
# Vérifier que WebSocket est accessible
curl http://localhost:8084/ws/info

# Réponse attendue :
# {"entropy":...,"origins":["*:*"],"cookie_needed":true,"websocket":true}
```

### 3. Topic STOMP
- **Topic de broadcast**: `/topic/bus/{busId}/location`
- **Endpoint de connexion**: `ws://localhost:8084/ws`
- **Protocol**: STOMP over SockJS

---

## 🚀 Test de l'Application Frontend

### Étape 1 : Démarrer le Frontend
```bash
cd frontend
npm run dev
```

L'application sera disponible sur : `http://localhost:3000`

### Étape 2 : Se Connecter
1. Ouvrir `http://localhost:3000`
2. Cliquer sur "Login"
3. Se connecter avec un compte CLIENT

### Étape 3 : Accéder à "Mes Trajets"
1. Dans la navbar, cliquer sur **"Mes Trajets"**
2. Vous devriez voir :
   - Liste de vos tickets actifs (gauche)
   - Zone de carte vide (droite)

### Étape 4 : Sélectionner un Trajet
1. Cliquer sur une carte de ticket dans la liste
2. La carte devrait afficher :
   - 🚏 **Marqueur vert** : Station de départ
   - 🏁 **Marqueur rouge** : Station d'arrivée
   - Badge **"EN DIRECT"** ou **"Hors ligne"**

---

## 🧪 Test de la Mise à Jour en Temps Réel

### Prérequis
Vous devez avoir :
- Un trip actif avec un bus assigné
- Le busId du trip
- Un token JWT de CONDUCTEUR

### Méthode 1 : Via Postman/Thunder Client

**Créer une position de bus :**
```http
POST http://localhost:8084/locations
Authorization: Bearer {TOKEN_CONDUCTEUR}
Content-Type: application/json

{
  "busId": "your-bus-id-here",
  "latitude": 33.5731,
  "longitude": -7.5898
}
```

**Mettre à jour la position :**
```http
POST http://localhost:8084/locations
Authorization: Bearer {TOKEN_CONDUCTEUR}
Content-Type: application/json

{
  "busId": "your-bus-id-here",
  "latitude": 33.5750,
  "longitude": -7.5920
}
```

### Méthode 2 : Via curl
```bash
# Remplacez {TOKEN} et {BUS_ID} par vos valeurs
curl -X POST http://localhost:8084/locations \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "busId": "{BUS_ID}",
    "latitude": 33.5731,
    "longitude": -7.5898
  }'
```

### Résultat Attendu
Après avoir envoyé une mise à jour de position :

1. **Sur la page "Mes Trajets"** :
   - Le marqueur 🚌 du bus devrait **apparaître** ou **se déplacer**
   - L'**ETA** (temps estimé d'arrivée) devrait **se recalculer**
   - La **distance** devrait être mise à jour
   - Le badge devrait afficher **"EN DIRECT"** (avec animation)

2. **Dans les logs du service** :
```bash
docker logs -f wasalny-geolocalisation-service

# Vous devriez voir :
# INFO ... Broadcasted location update for bus {busId} to /topic/bus/{busId}/location
```

3. **Dans la console du navigateur** (F12) :
```
Connected to WebSocket
Bus location updated: {latitude: 33.5731, longitude: -7.5898, ...}
```

---

## 🔍 Dépannage

### WebSocket ne se connecte pas

**Problème** : Badge "Hors ligne" affiché

**Solutions** :
1. Vérifier que le service est UP :
   ```bash
   docker ps | grep geolocalisation
   ```

2. Vérifier les logs :
   ```bash
   docker logs wasalny-geolocalisation-service --tail 50
   ```

3. Tester le endpoint WebSocket :
   ```bash
   curl http://localhost:8084/ws/info
   ```

4. Vérifier la console du navigateur (F12) pour les erreurs

### La carte ne s'affiche pas

**Solutions** :
1. Vérifier que vous avez des tickets actifs
2. Vérifier que le trip a un bus assigné
3. Vérifier les données du ticket dans la BDD

### Le bus ne s'affiche pas sur la carte

**Solutions** :
1. Vérifier que le busId correspond à celui du trip
2. Créer une position pour ce bus via l'API
3. Vérifier que la position a bien `latitude` et `longitude`

### L'ETA ne s'affiche pas

**Solutions** :
1. Vérifier que le bus a une position
2. Vérifier que la station d'arrivée a des coordonnées
3. Ouvrir la console pour voir les erreurs de calcul

---

## 📊 Données de Test

### Positions de Test (Casablanca)
```json
// Position 1 - Centre-ville
{
  "busId": "your-bus-id",
  "latitude": 33.5731,
  "longitude": -7.5898
}

// Position 2 - Marina
{
  "busId": "your-bus-id",
  "latitude": 33.6100,
  "longitude": -7.6300
}

// Position 3 - Aéroport
{
  "busId": "your-bus-id",
  "latitude": 33.3675,
  "longitude": -7.5898
}
```

### Simuler un Déplacement
Envoyez plusieurs requêtes avec des positions légèrement différentes :

```bash
# Position 1
curl -X POST http://localhost:8084/locations \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"busId": "{BUS_ID}", "latitude": 33.5731, "longitude": -7.5898}'

# Attendre 5 secondes

# Position 2
curl -X POST http://localhost:8084/locations \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"busId": "{BUS_ID}", "latitude": 33.5740, "longitude": -7.5910}'

# Attendre 5 secondes

# Position 3
curl -X POST http://localhost:8084/locations \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"busId": "{BUS_ID}", "latitude": 33.5750, "longitude": -7.5920}'
```

Vous devriez voir le bus **se déplacer en temps réel** sur la carte ! 🚌✨

---

## ✅ Checklist de Validation

- [ ] Frontend démarre sans erreur
- [ ] Page "Mes Trajets" accessible
- [ ] Liste des tickets s'affiche
- [ ] Carte Leaflet s'affiche
- [ ] Marqueurs de départ/arrivée visibles
- [ ] WebSocket se connecte (badge "EN DIRECT")
- [ ] Position du bus mise à jour en temps réel
- [ ] ETA calculé et affiché
- [ ] Badge animé quand connecté
- [ ] Pas d'erreurs dans la console

---

## 🎯 Fonctionnalités Vérifiées

✅ **Backend**
- WebSocket STOMP configuré
- Endpoint `/ws` accessible
- Broadcast des positions via `/topic/bus/{busId}/location`
- Sécurité : Endpoint `/ws/**` autorisé

✅ **Frontend**
- Service WebSocket avec auto-reconnexion
- Composant carte Leaflet avec 3 types de marqueurs
- Calcul ETA avec formule Haversine
- Interface responsive et moderne
- Gestion des états (loading, error, empty)

---

## 📝 Notes Importantes

1. **WebSocket fonctionne uniquement en développement** sur `localhost:8084`
   - En production, il faudra passer par l'API Gateway

2. **Redis warnings** : Normaux, Redis n'est pas critique pour cette fonctionnalité

3. **ETA** : Calculé avec une vitesse moyenne de 30 km/h (modifiable dans `mestrajetsService.js`)

4. **Permissions** :
   - Seuls les CONDUCTEURS peuvent créer/modifier des positions
   - Tous les rôles peuvent consulter les positions

---

**Bon test ! 🚀**
