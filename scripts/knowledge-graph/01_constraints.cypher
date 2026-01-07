CREATE CONSTRAINT user_uuid IF NOT EXISTS
FOR (u:User) REQUIRE u.uuid IS UNIQUE;

CREATE CONSTRAINT user_profile_uuid IF NOT EXISTS
FOR (p:UserProfile) REQUIRE p.uuid IS UNIQUE;

CREATE CONSTRAINT client_id IF NOT EXISTS
FOR (c:Client) REQUIRE c.client_id IS UNIQUE;

CREATE CONSTRAINT conducteur_id IF NOT EXISTS
FOR (d:Conducteur) REQUIRE d.conducteur_id IS UNIQUE;

CREATE CONSTRAINT admin_id IF NOT EXISTS
FOR (a:Admin) REQUIRE a.admin_id IS UNIQUE;

CREATE CONSTRAINT bus_id IF NOT EXISTS
FOR (b:Bus) REQUIRE b.bus_id IS UNIQUE;

CREATE CONSTRAINT ligne_id IF NOT EXISTS
FOR (l:Ligne) REQUIRE l.ligne_id IS UNIQUE;

CREATE CONSTRAINT station_id IF NOT EXISTS
FOR (s:Station) REQUIRE s.station_id IS UNIQUE;

CREATE CONSTRAINT trajet_id IF NOT EXISTS
FOR (t:Trajet) REQUIRE t.trajet_id IS UNIQUE;

CREATE CONSTRAINT config_id IF NOT EXISTS
FOR (c:ConfigurationHoraire) REQUIRE c.config_id IS UNIQUE;

CREATE CONSTRAINT ticket_id IF NOT EXISTS
FOR (t:Ticket) REQUIRE t.ticket_id IS UNIQUE;

CREATE CONSTRAINT abonnement_id IF NOT EXISTS
FOR (a:Abonnement) REQUIRE a.abonnement_id IS UNIQUE;

CREATE CONSTRAINT type_abonnement_id IF NOT EXISTS
FOR (t:TypeAbonnement) REQUIRE t.type_abonnement_id IS UNIQUE;

CREATE CONSTRAINT paiement_id IF NOT EXISTS
FOR (p:Paiement) REQUIRE p.transaction_id IS UNIQUE;

CREATE CONSTRAINT location_id IF NOT EXISTS
FOR (l:Location) REQUIRE l.location_id IS UNIQUE;

CREATE CONSTRAINT notification_id IF NOT EXISTS
FOR (n:Notification) REQUIRE n.notification_id IS UNIQUE;
