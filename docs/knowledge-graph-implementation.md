# Knowledge Graph Implementation Guide


## Stack and approach
- Graph DB: Neo4j (Docker)
- ETL: Python script reading Postgres databases from each microservice
- Scripts: Cypher files for constraints, derived relations, enrichment, checks, and recommendation

## What was added

### 1) Neo4j service
Added Neo4j to `docker-compose.yml` with ports:
- Browser: `http://localhost:7474`
- Bolt: `bolt://localhost:7687`

Env vars (see `.env.example`):
- `NEO4J_AUTH=neo4j/neo4j_password`
- `NEO4J_URI=bolt://localhost:7687`

### 2) ETL container
Folder: `kg-etl/`
- `etl.py`: extracts from Postgres, transforms, and loads into Neo4j
- `Dockerfile`, `requirements.txt`
- `README.md`: run instructions

The ETL reads from these Postgres containers:
- auth, user, trajet, geolocalisation, paiement, ticket, abonnement, notification

### 3) Cypher scripts
Folder: `scripts/knowledge-graph/`
- `01_constraints.cypher`: uniqueness constraints
- `02_derived_relations.cypher`: PART_DE, ARRIVE_A, PAYE_TRIP, PAYE_ABONNEMENT, etc.
- `03_checks.cypher`: validation queries
- `04_enrichment.cypher`: enrichment rules (price tag, delay tag, validity)
- `05_recommendation.cypher`: recommendation query (depart + arrivee)
- `06_recommendation_check.cypher`: auto-check for recommendation

## Enrichment rules implemented

1) Price category tag (based on `Ligne.prix_standard`)
- Categories: `ECONOMIQUE` (< 3), `NORMAL` (3 to 6), `CHER` (> 6)
- Creates `(:PrixTag {code})` and relation `(:Trajet)-[:A_CATEGORIE_PRIX]->(:PrixTag)`

2) Delay metrics per trip
- `Trajet.retard_moyen_minutes` = average of `PassageStation.retard_minutes`
- `Trajet.retard_eleve = true` if delay > 6
- Tag: `(:RetardTag {code})` with `PONCTUEL` or `RETARDE`

3) Delay metric per line
- `Ligne.retard_moyen_minutes` = average of its trajets

4) Abonnement validity
- `Abonnement.est_valide` and `Abonnement.est_expire` based on date + status

## How to run

### Start Neo4j
```
docker compose up -d neo4j
```

### Run ETL
```
docker-compose --profile etl up --build kg-etl
```

## Validation and checks

### Global checks
Run in Neo4j Browser (http://localhost:7474):
```
MATCH (n) RETURN labels(n) AS label, count(*) AS count ORDER BY count DESC;
MATCH ()-[r]->() RETURN type(r) AS rel, count(*) AS count ORDER BY count DESC;
```

### Enrichment checks
```
MATCH (t:Trajet)-[:A_CATEGORIE_PRIX]->(tag:PrixTag)
RETURN t.trajet_id, tag.code LIMIT 20;

MATCH (t:Trajet)-[:A_NIVEAU_RETARD]->(tag:RetardTag)
RETURN t.trajet_id, t.retard_moyen_minutes, tag.code LIMIT 20;

MATCH (a:Abonnement)
RETURN a.abonnement_id, a.est_valide, a.est_expire, a.date_fin LIMIT 20;
```

## Recommendation use case

### Manual query (with params)
```
:param stationDepartId => "UUID_DEPART";
:param stationArriveeId => "UUID_ARRIVEE";

MATCH (s1:Station {station_id: $stationDepartId})<- [p1:PASSE_PAR]-(t:Trajet)-[p2:PASSE_PAR]->(s2:Station {station_id: $stationArriveeId})
WHERE p1.ordre < p2.ordre
MATCH (l:Ligne)-[:PLANIFIE]->(t)
RETURN t.trajet_id, t.numero_trip, l.ligne_id, l.nom AS nom_ligne, l.prix_standard AS prix
ORDER BY prix ASC;
```

### Auto-check
```
// scripts/knowledge-graph/06_recommendation_check.cypher
```

## Note about AUTORISE_LIGNE
The relation `TypeAbonnement -> Ligne` depends on the `ligne_autorisee` table in `abonnement_db`.
If it is empty, no `AUTORISE_LIGNE` relations will be created.
