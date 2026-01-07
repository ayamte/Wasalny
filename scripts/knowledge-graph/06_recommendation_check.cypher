// Auto-check: pick any valid station pair from the graph, then run the recommendation query
MATCH (t:Trajet)-[p1:PASSE_PAR]->(s1:Station),
      (t)-[p2:PASSE_PAR]->(s2:Station)
WHERE p1.ordre < p2.ordre
WITH s1, s2 LIMIT 1
MATCH (s1)<-[p1:PASSE_PAR]-(t:Trajet)-[p2:PASSE_PAR]->(s2)
WHERE p1.ordre < p2.ordre
MATCH (l:Ligne)-[:PLANIFIE]->(t)
RETURN s1.station_id AS depart_id,
       s1.nom AS depart_nom,
       s2.station_id AS arrivee_id,
       s2.nom AS arrivee_nom,
       t.trajet_id,
       t.numero_trip,
       l.nom AS nom_ligne,
       l.prix_standard AS prix
ORDER BY prix ASC;
