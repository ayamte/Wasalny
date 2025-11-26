# Test d'Assignation Bus-Conducteur

## État Actuel du Système

### ✅ Ce qui fonctionne
- Les endpoints backend sont correctement configurés
- La structure de la base de données est correcte
- Le code frontend utilise les bons champs (UUID)

### ⚠️ Données actuelles
- **Bus créés** : 2 bus de test (TEST-001, TEST-002)
- **Conducteurs** : 2 conducteurs disponibles (test, test1)
- **Assignations** : Aucune assignation existante

## Procédure de Test Complète

### 1. Accéder à l'application
```
URL: http://localhost:3000
Connexion: asmahm8888@gmail.com (ADMIN)
```

### 2. Aller dans "Gestion des Bus"
- Menu > Services > Trajet > Gestion des Bus

### 3. Vérifier la liste des bus
Vous devriez voir :
- TEST-001 (Mercedes Citaro, 50 places)
- TEST-002 (Volvo 7900, 45 places)

### 4. Tester l'Assignation

#### Option A : Assignation Bus + Ligne + Conducteur
1. Cliquer sur "Assigner" pour TEST-001
2. Remplir **toutes** les sections :
   - **Ligne** : Sélectionner "L1"
   - **Station de départ** : "el irfan"
   - **Station d'arrivée** : "Agdal"
   - **Conducteur** : "test test"
   - **Date début** : Aujourd'hui
   - **Date fin** : Dans 30 jours
3. Cliquer sur "Assigner"

**Résultat attendu** : Message "Bus assigné à la ligne et au conducteur avec succès"

#### Option B : Assignation Conducteur uniquement
1. Cliquer sur "Assigner" pour TEST-002
2. **NE PAS remplir** la section Ligne/Stations
3. Remplir **seulement** :
   - **Conducteur** : "test1 test1"
   - **Date début** : Aujourd'hui
   - **Date fin** : Dans 30 jours
4. Cliquer sur "Assigner"

**Résultat attendu** : Message "Conducteur assigné avec succès"

### 5. Vérification dans la Base de Données

Pour vérifier que ça a bien fonctionné :

```sql
-- Vérifier les assignations bus-ligne
SELECT ba.id, b.numero_immatriculation, l.numero,
       sd.nom as station_depart, sa.nom as station_arrivee
FROM bus_assignment ba
JOIN bus b ON ba.bus_id = b.id
JOIN ligne l ON ba.ligne_id = l.id
JOIN station sd ON ba.station_depart_id = sd.id
JOIN station sa ON ba.station_arrivee_id = sa.id
WHERE ba.active = true;

-- Vérifier les assignations bus-conducteur
SELECT abc.id, b.numero_immatriculation, abc.conducteur_id,
       abc.date_debut, abc.date_fin, abc.active
FROM assignation_bus_conducteur abc
JOIN bus b ON abc.bus_id = b.id
WHERE abc.active = true;
```

## Problèmes Potentiels et Solutions

### Erreur : "Aucun bus trouvé"
**Cause** : Les bus ont été supprimés
**Solution** : Recréer les bus via l'interface ou la base de données

### Erreur : "Veuillez remplir..."
**Cause** : Validation frontend
**Solution** : Remplir au moins UNE des deux sections (Ligne OU Conducteur)

### Erreur : "Bus non trouvé avec l'ID"
**Cause** : UUID invalide
**Solution** : Vérifier que les UUIDs sont corrects dans la base

### Erreur : "Le bus a déjà une assignation active"
**Cause** : Chevauchement de dates
**Solution** : Désactiver l'assignation existante ou utiliser des dates différentes

## Informations Techniques

### IDs actuels dans la base

**Bus:**
- TEST-001: 7f322b16-f5ff-4b0f-ae69-53167fef89d8
- TEST-002: ebebae99-7111-4409-89da-6ff14f36947b

**Ligne:**
- L1: ffa735b4-03b7-4e36-bb0e-968d3eb96828

**Stations:**
- el irfan: db22bca2-5b56-4683-9baa-09313ba2ae36
- Agdal: 39a0b314-ef29-4a6f-84fe-a8a936e540c1

**Conducteurs (UUID):**
- test: d7170390-75e2-42e0-8872-ea294bba2ed7
- test1: b5f2e872-1857-4bd6-9dc7-a52f620fddf6

### Endpoints Backend

**Assignation Bus-Ligne:**
```
POST /api/trajets/bus-assignments
Body: {
  "busId": "uuid",
  "ligneId": "uuid",
  "stationDepartId": "uuid",
  "stationArriveeId": "uuid",
  "heureDepartAller": "09:00:00",
  "commenceAStationDepart": true
}
```

**Assignation Bus-Conducteur:**
```
POST /api/trajets/assignations
Body: {
  "busId": "uuid",
  "conducteurId": "uuid",
  "dateDebut": "2025-11-26",
  "dateFin": "2025-12-26"
}
```

## Notes Importantes

1. **Authentification requise** : Vous DEVEZ être connecté comme ADMIN
2. **Les deux types d'assignation sont indépendants** :
   - Bus-Ligne : Pour la planification des trajets
   - Bus-Conducteur : Pour affecter un conducteur à un bus
3. **Vous pouvez faire les deux en même temps** dans l'interface
4. **La validation vérifie** qu'au moins UNE section est remplie

## Rapport de Test

Après avoir testé, noter :
- ✅ ou ❌ Assignation Bus + Ligne fonctionne
- ✅ ou ❌ Assignation Conducteur fonctionne
- ✅ ou ❌ Assignation combinée fonctionne
- ✅ ou ❌ Les données apparaissent correctement dans la liste
- Message d'erreur exact si échec :
  ```
  [Coller le message d'erreur ici]
  ```
