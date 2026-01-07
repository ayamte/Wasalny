// Recommendation query: trips between two stations, sorted by price
// Params:
// :param stationDepartId => "UUID"
// :param stationArriveeId => "UUID"
MATCH (s1:Station {station_id: $stationDepartId})<- [p1:PASSE_PAR]-(t:Trajet)-[p2:PASSE_PAR]->(s2:Station {station_id: $stationArriveeId})
WHERE p1.ordre < p2.ordre
MATCH (l:Ligne)-[:PLANIFIE]->(t)
RETURN t.trajet_id,
       t.numero_trip,
       l.ligne_id,
       l.nom AS nom_ligne,
       l.prix_standard AS prix
ORDER BY prix ASC;
