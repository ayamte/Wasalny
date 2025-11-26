# 🧪 Guide de Test de l'Application Wasalny

## 📍 Informations d'Accès

### Application Frontend
- **URL**: http://localhost:3001
- **Services Backend**: http://localhost:8080/api

### Services Disponibles
- ✅ Frontend: Port 3001
- ✅ API Gateway: Port 8080
- ✅ Auth Service: Port 8081
- ✅ Trajet Service: Port 8083
- ✅ PostgreSQL (trajet_db, auth_db, user_db)

---

## 👤 Comptes de Test Disponibles

### 1. Admin
- **Email**: asmahm8888@gmail.com
- **Role**: ADMIN
- **Accès**: Gestion complète (buses, conducteurs, assignations, configurations)

### 2. Conducteur Nouveau (Créé pour test)
- **Email**: nouveau.conducteur@wasalny.com
- **Mot de passe**: <MOT_DE_PASSE_DE_TEST>
- **Role**: CONDUCTEUR
- **UUID**: 5905e351-9799-41a4-acb7-5e9c24e737f1
- **Nom**: Mohamed Alami
- **Téléphone**: +212600112233
- **Permis**: B123456
- **Bus Assigné**: TEST-777 (Mercedes Test Model, 50 places)
- **Période d'assignation**: 2025-11-27 → 2025-12-27

### 3. Autres Conducteurs
- test1@gmail.com (CONDUCTEUR)
- test12@gmail.com (CONDUCTEUR)
- asmahm8878@gmail.com (CONDUCTEUR)

---

## 🚌 Données de Test Créées

### Buses (3 au total)
1. **778594** - Bus existant
2. **55566** - Bus existant
3. **TEST-777** - Mercedes Test Model (50 places) - **NOUVEAU**

### Conducteurs (4 au total)
1. Mohamed Alami - nouveau.conducteur@wasalny.com - **NOUVEAU**
2. test1 - test1@gmail.com
3. test2 - test12@gmail.com
4. conducteur - asmahm8878@gmail.com

### Assignations Bus-Conducteur (4 au total)
1. TEST-777 → Mohamed Alami (2025-11-27 → 2025-12-27) - **NOUVEAU**
2. 778594 → Conducteur existant
3. 55566 → Conducteur existant

### Trips (161 au total)
- 160 trips générés automatiquement
- 1 trip test: TEST-TRIP-001 (2025-11-27, 08:00, Bus TEST-777) - **NOUVEAU**

### Configuration (1 active)
- **Ligne**: El irfane - hay karima
- **Horaires**: 07:00 - 22:00
- **Fréquence**: 30 minutes
- **Statut**: Active

### Stations (4 sur la ligne)
- Stations configurées pour la ligne El irfane - hay karima

---

## 🧪 Tests à Effectuer

### Test 1: Interface Conducteur - Dashboard
**Objectif**: Vérifier que l'interface conducteur affiche correctement les données

1. Ouvrez http://localhost:3001
2. Connectez-vous avec: **nouveau.conducteur@wasalny.com** / **test**
3. Vous devriez être redirigé vers `/conducteur/dashboard`
4. **Vérifications**:
   - ✅ Le bus TEST-777 est affiché dans "My Bus"
   - ✅ Les informations du bus sont correctes (immatriculation, modèle, capacité)
   - ✅ Le trip assigné est visible (si un trip est planifié pour aujourd'hui)
   - ✅ Les stations de la ligne sont listées
   - ✅ Les boutons de contrôle sont affichés

**Résultat attendu**:
```
My Bus:
- Bus Number: [ID du bus]
- License Plate: TEST-777
- Model: Mercedes Test Model
- Capacity: 0/50 (0% capacity)

Trip Information:
- Ligne: El irfane - hay karima
- Stations: Liste des 4 stations
```

### Test 2: API Endpoints - Bus Assigné

**Test via curl**:
```bash
# 1. Connexion pour obtenir le token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"nouveau.conducteur@wasalny.com","motDePasse":"test"}'

# 2. Récupérer le bus assigné (remplacer <TOKEN> par le token reçu)
curl -X GET http://localhost:8080/api/trajets/buses/assigned \
  -H "Authorization: Bearer <TOKEN>"
```

**Résultat attendu**:
```json
{
  "id": "c0551344-b49f-42f6-97e3-7170e240aa0e",
  "numeroImmatriculation": "TEST-777",
  "capacite": 50,
  "modele": "Mercedes Test Model",
  "active": true
}
```

### Test 3: API Endpoints - Trip Assigné

**Test via curl**:
```bash
# Récupérer le trip assigné
curl -X GET http://localhost:8080/api/trajets/trips/assigned \
  -H "Authorization: Bearer <TOKEN>"
```

**Résultat attendu** (si un trip est assigné pour aujourd'hui):
```json
{
  "id": "...",
  "numeroTrip": "...",
  "ligneId": "...",
  "busId": "c0551344-b49f-42f6-97e3-7170e240aa0e",
  "dateTrip": "2025-11-27",
  "heureDepart": "08:00:00",
  "statut": "PLANIFIE"
}
```

OU 404 si aucun trip assigné pour aujourd'hui.

### Test 4: Démarrer un Trip (Interface)

1. Connecté en tant que conducteur
2. Cliquez sur le bouton "Start Trip"
3. **Vérifications**:
   - ✅ Le statut passe à "Trip in Progress"
   - ✅ La première station devient la "current station"
   - ✅ Le bouton "Confirm Arrival" devient actif
   - ✅ Le bouton "Start Trip" devient désactivé

### Test 5: Confirmer les Passages (Interface)

1. Après avoir démarré le trip
2. Cliquez sur "Confirm Arrival" pour chaque station
3. **Vérifications**:
   - ✅ La station actuelle devient "completed" (vert)
   - ✅ La prochaine station devient "current" (orange)
   - ✅ "Last confirmed" affiche le nom de la dernière station
   - ✅ À la dernière station, le bouton devient "Complete Route"

### Test 6: Gestion des Bus (Admin)

**Note**: Nécessite un compte admin avec mot de passe connu

1. Connectez-vous en tant qu'admin
2. Allez dans "Gestion des bus"
3. Cliquez sur "Ajouter un bus"
4. Remplissez:
   - Immatriculation: NEW-BUS-123
   - Capacité: 55
   - Modèle: Volvo 7900
5. Validez
6. **Vérifications**:
   - ✅ Le bus apparaît dans la liste
   - ✅ Le bus est enregistré dans la base de données

**Vérification DB**:
```sql
SELECT * FROM bus WHERE numero_immatriculation = 'NEW-BUS-123';
```

### Test 7: Créer une Assignation (Admin)

1. Connecté en tant qu'admin
2. Allez dans "Assignations"
3. Créez une nouvelle assignation:
   - Bus: TEST-777
   - Conducteur: Mohamed Alami
   - Date début: 2025-12-01
   - Date fin: 2025-12-31
4. **Vérifications**:
   - ✅ L'assignation apparaît dans la liste
   - ✅ Le conducteur peut voir le bus assigné

---

## 🔍 Vérifications Base de Données

### Vérifier les Bus
```bash
docker exec postgres-trajet psql -U wasalny_user -d trajet_db -c "SELECT id, numero_immatriculation, capacite, modele, active FROM bus ORDER BY numero_immatriculation;"
```

### Vérifier les Conducteurs
```bash
docker exec postgres-user psql -U wasalny_user -d user_db -c "SELECT u.id, u.email, c.nom, c.prenom, c.telephone, c.statut FROM user_profiles u JOIN conducteur_profiles c ON u.id = c.id WHERE u.role = 'CONDUCTEUR';"
```

### Vérifier les Assignations
```bash
docker exec postgres-trajet psql -U wasalny_user -d trajet_db -c "SELECT a.id, b.numero_immatriculation, a.conducteur_id, a.date_debut, a.date_fin, a.active FROM assignation_bus_conducteur a JOIN bus b ON a.bus_id = b.id;"
```

### Vérifier les Trips
```bash
docker exec postgres-trajet psql -U wasalny_user -d trajet_db -c "SELECT COUNT(*) as total_trips, statut, COUNT(*) as count FROM trip GROUP BY statut;"
```

---

## ⚠️ Problèmes Connus et Solutions

### Problème 1: 404 sur /buses/assigned
**Symptôme**: Le dashboard conducteur affiche "No bus assigned"

**Cause**: Aucune assignation active pour aujourd'hui

**Solution**:
1. Vérifier la date d'aujourd'hui
2. Vérifier les assignations dans la DB:
   ```sql
   SELECT * FROM assignation_bus_conducteur
   WHERE conducteur_id = '5905e351-9799-41a4-acb7-5e9c24e737f1'
   AND active = true
   AND CURRENT_DATE BETWEEN date_debut AND date_fin;
   ```
3. Si aucune assignation, en créer une qui couvre aujourd'hui

### Problème 2: 404 sur /trips/assigned
**Symptôme**: Pas de trip assigné affiché

**Cause**: Aucun trip planifié pour aujourd'hui sur le bus du conducteur

**Solution**:
1. Vérifier les trips planifiés:
   ```sql
   SELECT * FROM trip
   WHERE bus_id = 'c0551344-b49f-42f6-97e3-7170e240aa0e'
   AND date_trip = CURRENT_DATE
   AND statut = 'PLANIFIE';
   ```
2. Si aucun trip, en créer un ou utiliser la configuration pour générer des trips

### Problème 3: Erreur d'authentification
**Symptôme**: "Email ou mot de passe incorrect"

**Cause**: Mot de passe hashé différent ou compte non synchronisé

**Solution**:
1. Réinitialiser le mot de passe dans auth_db:
   ```sql
   UPDATE users SET password = '<HASH_BCRYPT_DU_COMPTE_DE_TEST>'
   WHERE email = 'nouveau.conducteur@wasalny.com';
   ```
   (Ce hash correspond au mot de passe "test")

---

## 📊 Résumé de l'État du Système

### ✅ Fonctionnalités Implémentées
1. **Backend Endpoints**:
   - ✅ GET /trajets/buses/assigned - Récupérer le bus du conducteur
   - ✅ GET /trajets/trips/assigned - Récupérer le trip assigné
   - ✅ GET /trajets/trips/active - Récupérer le trip actif
   - ✅ POST /trajets/trips/{tripId}/demarrer - Démarrer un trip
   - ✅ POST /trajets/trips/{tripId}/confirmer-passage - Confirmer un passage
   - ✅ POST /trajets/trips/{tripId}/terminer - Terminer un trip

2. **Frontend Components**:
   - ✅ BusDriverDashboard - Dashboard conducteur avec affichage du bus et du trip
   - ✅ DriverLayout - Layout avec sidebar pour les conducteurs
   - ✅ trajetService - Services API pour les appels backend
   - ✅ conducteurService - Services spécifiques aux conducteurs

3. **Base de Données**:
   - ✅ 3 buses enregistrés
   - ✅ 4 conducteurs avec profils complets
   - ✅ 4 assignations bus-conducteur
   - ✅ 161 trips générés
   - ✅ 1 configuration horaire active
   - ✅ 4 stations configurées

### 🔄 Tests en Attente
- [ ] Test de connexion conducteur avec interface
- [ ] Test de démarrage de trip
- [ ] Test de confirmation des passages
- [ ] Test de fin de trip
- [ ] Test de création de bus (admin)
- [ ] Test de création d'assignation (admin)

---

## 🎯 Prochaines Étapes

1. **Ouvrir l'application** sur http://localhost:3001
2. **Se connecter** avec nouveau.conducteur@wasalny.com / test
3. **Vérifier l'affichage** du dashboard conducteur
4. **Tester les fonctionnalités** de démarrage et gestion de trip
5. **Créer de nouvelles données** via l'interface admin si disponible

---

**Date de création**: 2025-11-26
**Version**: 1.0
**Statut**: ✅ Prêt pour les tests
