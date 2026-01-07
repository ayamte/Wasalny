// 1) Node counts by label
MATCH (n)
RETURN labels(n) AS label, count(*) AS count
ORDER BY count DESC;

// 2) Relation counts by type
MATCH ()-[r]->()
RETURN type(r) AS rel, count(*) AS count
ORDER BY count DESC;

// 3) Trips with station order
MATCH (s1:Station)<-[p1:PASSE_PAR]-(t:Trajet)-[p2:PASSE_PAR]->(s2:Station)
WHERE p1.ordre < p2.ordre
RETURN t.trajet_id, s1.nom AS depart, s2.nom AS arrivee
LIMIT 50;

// 4) Derived start/end stations
MATCH (t:Trajet)-[:PART_DE]->(s1:Station),
      (t)-[:ARRIVE_A]->(s2:Station)
RETURN t.trajet_id, s1.nom AS depart, s2.nom AS arrivee
LIMIT 20;

// 5) Client -> Ticket -> Trajet
MATCH (c:Client)-[:ACHETE]->(tk:Ticket)-[:VALIDE_POUR]->(t:Trajet)
RETURN c.client_id, tk.numero_ticket, t.numero_trip
LIMIT 20;

// 6) Abonnement -> TypeAbonnement -> Ligne
MATCH (t:TypeAbonnement)-[:AUTORISE_LIGNE]->(l:Ligne)
RETURN t.code, l.nom
LIMIT 20;

// 7) Paiement -> Trip / Abonnement
MATCH (p:Paiement)-[:PAYE_TRIP|PAYE_ABONNEMENT]->(x)
RETURN p.reference, labels(x) AS cible
LIMIT 20;
