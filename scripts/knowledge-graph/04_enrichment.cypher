// Enrichment 1: Trajet price category tag based on Ligne.prix_standard
MATCH (t:Trajet)<-[:PLANIFIE]-(l:Ligne)
WITH t,
  CASE
    WHEN l.prix_standard IS NULL THEN "INCONNU"
    WHEN l.prix_standard < 3 THEN "ECONOMIQUE"
    WHEN l.prix_standard <= 6 THEN "NORMAL"
    ELSE "CHER"
  END AS categorie_prix
MERGE (tag:PrixTag {code: categorie_prix})
MERGE (t)-[:A_CATEGORIE_PRIX]->(tag)
REMOVE t.categorie_prix;

// Enrichment 2: Trajet.retard_moyen_minutes and retard_eleve
MATCH (t:Trajet)
OPTIONAL MATCH (t)-[p:PASSE_PAR]->(:Station)
WITH t, avg(p.retard_minutes) AS retard_moyen
SET t.retard_moyen_minutes = coalesce(retard_moyen, 0),
    t.retard_eleve = coalesce(retard_moyen, 0) > 6;

// Enrichment 2b: Trajet delay tag (PONCTUEL / RETARDE)
MATCH (t:Trajet)
WITH t,
  CASE
    WHEN t.retard_moyen_minutes <= 6 THEN "PONCTUEL"
    ELSE "RETARDE"
  END AS retard_tag
MERGE (tag:RetardTag {code: retard_tag})
MERGE (t)-[:A_NIVEAU_RETARD]->(tag);

// Enrichment 2c: Ligne.retard_moyen_minutes based on its trajets
MATCH (l:Ligne)-[:PLANIFIE]->(t:Trajet)
WITH l, avg(t.retard_moyen_minutes) AS retard_moyen_ligne
SET l.retard_moyen_minutes = coalesce(retard_moyen_ligne, 0);

// Enrichment 3: Abonnement.est_valide and est_expire
MATCH (a:Abonnement)
SET a.est_valide = (a.statut_abonnement = "ACTIF" AND date(a.date_fin) >= date()),
    a.est_expire = (date(a.date_fin) < date());
