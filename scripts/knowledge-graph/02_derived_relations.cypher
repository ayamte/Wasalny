// PART_DE and ARRIVE_A based on PASSE_PAR ordering
MATCH (t:Trajet)-[p:PASSE_PAR]->(s:Station)
WITH t, p, s ORDER BY p.ordre ASC
WITH t, collect({s:s, p:p})[0] AS first
WITH t, first.s AS first_station, first.p AS first_passage
MERGE (t)-[r:PART_DE]->(first_station)
SET r.ordre = first_passage.ordre,
    r.heure_prevu = first_passage.heure_prevu;

MATCH (t:Trajet)-[p:PASSE_PAR]->(s:Station)
WITH t, p, s ORDER BY p.ordre DESC
WITH t, collect({s:s, p:p})[0] AS last
WITH t, last.s AS last_station, last.p AS last_passage
MERGE (t)-[r:ARRIVE_A]->(last_station)
SET r.ordre = last_passage.ordre,
    r.heure_estimee = last_passage.heure_estimee;

// Paiement to Trajet or TypeAbonnement from reference_service
MATCH (p:Paiement)
WHERE p.type_service = "ACHAT_TICKET"
MATCH (t:Trajet {trajet_id: p.reference_service})
MERGE (p)-[:PAYE_TRIP]->(t);

MATCH (p:Paiement)
WHERE p.type_service = "ABONNEMENT"
MATCH (ta:TypeAbonnement {type_abonnement_id: p.reference_service})
MERGE (p)-[:PAYE_ABONNEMENT]->(ta);

// Abonnement validation to Trajet for allowed lines (active only)
MATCH (a:Abonnement)-[:DE_TYPE]->(ta:TypeAbonnement)-[:AUTORISE_LIGNE]->(l:Ligne)<-[:PLANIFIE]-(t:Trajet)
WHERE a.statut_abonnement = "ACTIF" AND date(a.date_fin) >= date()
MERGE (a)-[r:VALIDE_POUR]->(t)
SET r.ligne_id = l.ligne_id,
    r.zone_geographique = a.zone_geographique;
