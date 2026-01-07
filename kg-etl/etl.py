import datetime as dt
import decimal
import os
import uuid

import psycopg2
from psycopg2.extras import RealDictCursor
from neo4j import GraphDatabase

BATCH_SIZE = int(os.getenv("KG_BATCH_SIZE", "1000"))


def normalize_value(value):
    if value is None:
        return None
    if isinstance(value, uuid.UUID):
        return str(value)
    if isinstance(value, (dt.datetime, dt.date, dt.time)):
        return value.isoformat()
    if isinstance(value, decimal.Decimal):
        return float(value)
    if isinstance(value, bytes):
        return value.decode("utf-8", "ignore")
    return value


def normalize_row(row):
    return {key: normalize_value(value) for key, value in row.items()}


def fetch_rows(conn, sql):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(sql)
        return [normalize_row(row) for row in cur.fetchall()]


def chunked(rows, size):
    for index in range(0, len(rows), size):
        yield rows[index : index + size]


def run_unwind(session, query, rows):
    if not rows:
        return
    for batch in chunked(rows, BATCH_SIZE):
        session.execute_write(lambda tx: tx.run(query, rows=batch).consume())


def get_pg_config(prefix, default_db, default_port):
    return {
        "host": os.getenv(f"{prefix}_DB_HOST", "localhost"),
        "port": int(os.getenv(f"{prefix}_DB_PORT", str(default_port))),
        "dbname": os.getenv(f"{prefix}_DB_NAME", default_db),
        "user": os.getenv(f"{prefix}_DB_USER", "wasalny_user"),
        "password": os.getenv(f"{prefix}_DB_PASSWORD", "wasalny_password"),
    }


def connect_pg(cfg):
    return psycopg2.connect(
        host=cfg["host"],
        port=cfg["port"],
        dbname=cfg["dbname"],
        user=cfg["user"],
        password=cfg["password"],
    )


def get_neo4j_auth():
    user = os.getenv("NEO4J_USER")
    password = os.getenv("NEO4J_PASSWORD")
    auth = os.getenv("NEO4J_AUTH")
    if (not user or not password) and auth and "/" in auth:
        user, password = auth.split("/", 1)
    return user or "neo4j", password or "neo4j_password"


def run_cypher_file(session, path):
    if not path or not os.path.exists(path):
        return
    with open(path, "r", encoding="utf-8") as handle:
        content = handle.read()
    statements = [stmt.strip() for stmt in content.split(";") if stmt.strip()]
    for stmt in statements:
        session.run(stmt).consume()


def main():
    neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user, neo4j_password = get_neo4j_auth()
    apply_constraints = os.getenv("KG_APPLY_CONSTRAINTS", "false").lower() == "true"
    apply_rules = os.getenv("KG_APPLY_RULES", "false").lower() == "true"
    apply_enrichment = os.getenv("KG_APPLY_ENRICHMENT", "false").lower() == "true"
    constraints_path = os.getenv("KG_CONSTRAINTS_PATH")
    rules_path = os.getenv("KG_RULES_PATH")
    enrichment_path = os.getenv("KG_ENRICHMENT_PATH")

    pg_auth = get_pg_config("AUTH", "auth_db", 5437)
    pg_user = get_pg_config("USER", "user_db", 5434)
    pg_trajet = get_pg_config("TRAJET", "trajet_db", 5432)
    pg_geo = get_pg_config("GEO", "geolocalisation_db", 5435)
    pg_payment = get_pg_config("PAYMENT", "paiement_db", 5433)
    pg_ticket = get_pg_config("TICKET", "ticket_db", 5436)
    pg_abonnement = get_pg_config("ABONNEMENT", "abonnement_db", 5438)
    pg_notification = get_pg_config("NOTIFICATION", "notification_db", 5439)

    driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

    with connect_pg(pg_auth) as auth_conn, \
        connect_pg(pg_user) as user_conn, \
        connect_pg(pg_trajet) as trajet_conn, \
        connect_pg(pg_geo) as geo_conn, \
        connect_pg(pg_payment) as payment_conn, \
        connect_pg(pg_ticket) as ticket_conn, \
        connect_pg(pg_abonnement) as abonnement_conn, \
        connect_pg(pg_notification) as notification_conn, \
        driver.session() as session:

        if apply_constraints:
            run_cypher_file(session, constraints_path)

        print("Loading users...")
        users = fetch_rows(
            auth_conn,
            """
            SELECT id AS user_id, uuid, username, email, role, enabled, date_creation
            FROM users
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (u:User {uuid: row.uuid})
            SET u.user_id = row.user_id,
                u.username = row.username,
                u.email = row.email,
                u.role = row.role,
                u.enabled = row.enabled,
                u.date_creation = row.date_creation
            """,
            users,
        )

        print("Loading user profiles...")
        user_profiles = fetch_rows(
            user_conn,
            """
            SELECT id AS profile_id, uuid, email, username, role, date_creation
            FROM user_profiles
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (p:UserProfile {uuid: row.uuid})
            SET p.profile_id = row.profile_id,
                p.email = row.email,
                p.username = row.username,
                p.role = row.role,
                p.date_creation = row.date_creation
            """,
            user_profiles,
        )

        print("Loading client profiles...")
        clients = fetch_rows(
            user_conn,
            """
            SELECT cp.id AS profile_id,
                   up.uuid AS client_id,
                   up.email,
                   up.username,
                   up.role,
                   up.date_creation,
                   cp.nom,
                   cp.prenom,
                   cp.telephone,
                   cp.statut AS statut_client,
                   cp.date_inscription
            FROM client_profiles cp
            JOIN user_profiles up ON cp.id = up.id
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (c:Client {client_id: row.client_id})
            SET c.profile_id = row.profile_id,
                c.email = row.email,
                c.username = row.username,
                c.role = row.role,
                c.date_creation = row.date_creation,
                c.nom = row.nom,
                c.prenom = row.prenom,
                c.telephone = row.telephone,
                c.statut_client = row.statut_client,
                c.date_inscription = row.date_inscription
            """,
            clients,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (p:UserProfile {uuid: row.client_id})
            MATCH (c:Client {client_id: row.client_id})
            MERGE (p)-[:IS_A]->(c)
            """,
            clients,
        )

        print("Loading conducteur profiles...")
        conducteurs = fetch_rows(
            user_conn,
            """
            SELECT cp.id AS profile_id,
                   up.uuid AS conducteur_id,
                   up.email,
                   up.username,
                   up.role,
                   up.date_creation,
                   cp.nom,
                   cp.prenom,
                   cp.telephone,
                   cp.numero_permis,
                   cp.statut AS statut_conducteur,
                   cp.date_embauche
            FROM conducteur_profiles cp
            JOIN user_profiles up ON cp.id = up.id
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (d:Conducteur {conducteur_id: row.conducteur_id})
            SET d.profile_id = row.profile_id,
                d.email = row.email,
                d.username = row.username,
                d.role = row.role,
                d.date_creation = row.date_creation,
                d.nom = row.nom,
                d.prenom = row.prenom,
                d.telephone = row.telephone,
                d.numero_permis = row.numero_permis,
                d.statut_conducteur = row.statut_conducteur,
                d.date_embauche = row.date_embauche
            """,
            conducteurs,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (p:UserProfile {uuid: row.conducteur_id})
            MATCH (d:Conducteur {conducteur_id: row.conducteur_id})
            MERGE (p)-[:IS_A]->(d)
            """,
            conducteurs,
        )

        print("Loading admin profiles...")
        admins = fetch_rows(
            user_conn,
            """
            SELECT ap.id AS profile_id,
                   up.uuid AS admin_id,
                   up.email,
                   up.username,
                   up.role,
                   up.date_creation
            FROM admin_profiles ap
            JOIN user_profiles up ON ap.id = up.id
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (a:Admin {admin_id: row.admin_id})
            SET a.profile_id = row.profile_id,
                a.email = row.email,
                a.username = row.username,
                a.role = row.role,
                a.date_creation = row.date_creation
            """,
            admins,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (p:UserProfile {uuid: row.admin_id})
            MATCH (a:Admin {admin_id: row.admin_id})
            MERGE (p)-[:IS_A]->(a)
            """,
            admins,
        )

        print("Loading trajet service nodes...")
        bus_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id AS bus_id,
                   numero_immatriculation,
                   capacite,
                   modele,
                   active,
                   latitude_actuelle,
                   longitude_actuelle,
                   metre_avant_arret
            FROM bus
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (b:Bus {bus_id: row.bus_id})
            SET b.numero_immatriculation = row.numero_immatriculation,
                b.capacite = row.capacite,
                b.modele = row.modele,
                b.active = row.active,
                b.latitude_actuelle = row.latitude_actuelle,
                b.longitude_actuelle = row.longitude_actuelle,
                b.metre_avant_arret = row.metre_avant_arret
            """,
            bus_rows,
        )

        ligne_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id AS ligne_id,
                   numero,
                   nom,
                   prix_standard,
                   vitesse_standard_kmh,
                   distance_totale_km,
                   active
            FROM ligne
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (l:Ligne {ligne_id: row.ligne_id})
            SET l.numero = row.numero,
                l.nom = row.nom,
                l.prix_standard = row.prix_standard,
                l.vitesse_standard_kmh = row.vitesse_standard_kmh,
                l.distance_totale_km = row.distance_totale_km,
                l.active = row.active
            """,
            ligne_rows,
        )

        station_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id AS station_id,
                   nom,
                   latitude,
                   longitude,
                   capacite,
                   active
            FROM station
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (s:Station {station_id: row.station_id})
            SET s.nom = row.nom,
                s.latitude = row.latitude,
                s.longitude = row.longitude,
                s.capacite = row.capacite,
                s.active = row.active
            """,
            station_rows,
        )

        trip_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id AS trajet_id,
                   numero_trip,
                   date_trip,
                   heure_depart,
                   est_aller,
                   statut,
                   tickets_vendus,
                   ligne_id,
                   bus_id
            FROM trip
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (t:Trajet {trajet_id: row.trajet_id})
            SET t.numero_trip = row.numero_trip,
                t.date_trip = row.date_trip,
                t.heure_depart = row.heure_depart,
                t.est_aller = row.est_aller,
                t.statut = row.statut,
                t.tickets_vendus = row.tickets_vendus,
                t.ligne_id = row.ligne_id,
                t.bus_id = row.bus_id
            """,
            trip_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (b:Bus {bus_id: row.bus_id})
            MATCH (t:Trajet {trajet_id: row.trajet_id})
            MERGE (b)-[:AFFECTE_A]->(t)
            """,
            trip_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (l:Ligne {ligne_id: row.ligne_id})
            MATCH (t:Trajet {trajet_id: row.trajet_id})
            MERGE (l)-[:PLANIFIE]->(t)
            """,
            trip_rows,
        )

        config_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id AS config_id,
                   ligne_id,
                   heure_debut,
                   heure_fin,
                   frequence_minutes,
                   duree_aller_minutes,
                   duree_retour_minutes,
                   temps_pause_minutes,
                   temps_arret_minutes,
                   nombre_bus,
                   nombre_bus_depart,
                   nombre_bus_destination,
                   active
            FROM configuration_horaire
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (c:ConfigurationHoraire {config_id: row.config_id})
            SET c.ligne_id = row.ligne_id,
                c.heure_debut = row.heure_debut,
                c.heure_fin = row.heure_fin,
                c.frequence_minutes = row.frequence_minutes,
                c.duree_aller_minutes = row.duree_aller_minutes,
                c.duree_retour_minutes = row.duree_retour_minutes,
                c.temps_pause_minutes = row.temps_pause_minutes,
                c.temps_arret_minutes = row.temps_arret_minutes,
                c.nombre_bus = row.nombre_bus,
                c.nombre_bus_depart = row.nombre_bus_depart,
                c.nombre_bus_destination = row.nombre_bus_destination,
                c.active = row.active
            """,
            config_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (l:Ligne {ligne_id: row.ligne_id})
            MATCH (c:ConfigurationHoraire {config_id: row.config_id})
            MERGE (l)-[:A_CONFIG]->(c)
            """,
            config_rows,
        )

        ligne_station_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id,
                   ligne_id,
                   station_id,
                   ordre,
                   distance_cumulee_km
            FROM ligne_station
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (l:Ligne {ligne_id: row.ligne_id})
            MATCH (s:Station {station_id: row.station_id})
            MERGE (l)-[r:PASSE_PAR_LIGNE]->(s)
            SET r.ordre = row.ordre,
                r.distance_cumulee_km = row.distance_cumulee_km
            """,
            ligne_station_rows,
        )

        passage_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id,
                   trip_id AS trajet_id,
                   station_id,
                   ordre,
                   heure_prevu,
                   heure_reelle,
                   heure_estimee,
                   retard_minutes,
                   confirme
            FROM passage_station
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (t:Trajet {trajet_id: row.trajet_id})
            MATCH (s:Station {station_id: row.station_id})
            MERGE (t)-[r:PASSE_PAR]->(s)
            SET r.ordre = row.ordre,
                r.heure_prevu = row.heure_prevu,
                r.heure_reelle = row.heure_reelle,
                r.heure_estimee = row.heure_estimee,
                r.retard_minutes = row.retard_minutes,
                r.confirme = row.confirme
            """,
            passage_rows,
        )

        assignment_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id,
                   bus_id,
                   ligne_id,
                   station_depart_id,
                   station_arrivee_id,
                   heure_depart_aller,
                   heure_depart_retour,
                   active,
                   commence_a_station_depart
            FROM bus_assignment
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (b:Bus {bus_id: row.bus_id})
            MATCH (l:Ligne {ligne_id: row.ligne_id})
            MERGE (b)-[r:ASSIGNE_LIGNE]->(l)
            SET r.heure_depart_aller = row.heure_depart_aller,
                r.heure_depart_retour = row.heure_depart_retour,
                r.active = row.active,
                r.commence_a_station_depart = row.commence_a_station_depart
            """,
            assignment_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (b:Bus {bus_id: row.bus_id})
            MATCH (s:Station {station_id: row.station_depart_id})
            MERGE (b)-[:COMMENCE_A]->(s)
            """,
            assignment_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (b:Bus {bus_id: row.bus_id})
            MATCH (s:Station {station_id: row.station_arrivee_id})
            MERGE (b)-[:TERMINE_A]->(s)
            """,
            assignment_rows,
        )

        assign_conducteur_rows = fetch_rows(
            trajet_conn,
            """
            SELECT id,
                   bus_id,
                   conducteur_id,
                   date_debut,
                   date_fin,
                   active
            FROM assignation_bus_conducteur
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (d:Conducteur {conducteur_id: row.conducteur_id})
            MATCH (b:Bus {bus_id: row.bus_id})
            MERGE (d)-[r:CONDUIT]->(b)
            SET r.date_debut = row.date_debut,
                r.date_fin = row.date_fin,
                r.active = row.active
            """,
            assign_conducteur_rows,
        )

        print("Loading tickets...")
        ticket_rows = fetch_rows(
            ticket_conn,
            """
            SELECT id AS ticket_id,
                   numero_ticket,
                   client_id,
                   trip_id,
                   numero_trip,
                   ligne_id,
                   nom_ligne,
                   station_depart_id,
                   nom_station_depart,
                   station_finale_id,
                   nom_station_finale,
                   date_achat,
                   prix,
                   statut AS statut_ticket,
                   transaction_id
            FROM tickets
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (t:Ticket {ticket_id: row.ticket_id})
            SET t.numero_ticket = row.numero_ticket,
                t.client_id = row.client_id,
                t.trip_id = row.trip_id,
                t.numero_trip = row.numero_trip,
                t.ligne_id = row.ligne_id,
                t.nom_ligne = row.nom_ligne,
                t.station_depart_id = row.station_depart_id,
                t.nom_station_depart = row.nom_station_depart,
                t.station_finale_id = row.station_finale_id,
                t.nom_station_finale = row.nom_station_finale,
                t.date_achat = row.date_achat,
                t.prix = row.prix,
                t.statut_ticket = row.statut_ticket,
                t.transaction_id = row.transaction_id
            """,
            ticket_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (c:Client {client_id: row.client_id})
            MATCH (t:Ticket {ticket_id: row.ticket_id})
            MERGE (c)-[:ACHETE]->(t)
            """,
            ticket_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (t:Ticket {ticket_id: row.ticket_id})
            MATCH (tr:Trajet {trajet_id: row.trip_id})
            MERGE (t)-[:VALIDE_POUR]->(tr)
            """,
            ticket_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (t:Ticket {ticket_id: row.ticket_id})
            MATCH (s:Station {station_id: row.station_depart_id})
            MERGE (t)-[:DEPART_DE]->(s)
            """,
            ticket_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (t:Ticket {ticket_id: row.ticket_id})
            MATCH (s:Station {station_id: row.station_finale_id})
            MERGE (t)-[:ARRIVE_A]->(s)
            """,
            ticket_rows,
        )

        print("Loading abonnements...")
        type_ab_rows = fetch_rows(
            abonnement_conn,
            """
            SELECT id AS type_abonnement_id,
                   code,
                   nom,
                   description,
                   prix,
                   duree_jours,
                   actif
            FROM type_abonnement
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (t:TypeAbonnement {type_abonnement_id: row.type_abonnement_id})
            SET t.code = row.code,
                t.nom = row.nom,
                t.description = row.description,
                t.prix = row.prix,
                t.duree_jours = row.duree_jours,
                t.actif = row.actif
            """,
            type_ab_rows,
        )

        abonnement_rows = fetch_rows(
            abonnement_conn,
            """
            SELECT id AS abonnement_id,
                   numero_abonnement,
                   client_id,
                   type_abonnement_id,
                   date_debut,
                   date_fin,
                   date_achat,
                   statut AS statut_abonnement,
                   montant_paye,
                   transaction_id,
                   lignes_autorisees,
                   zone_geographique
            FROM abonnement
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (a:Abonnement {abonnement_id: row.abonnement_id})
            SET a.numero_abonnement = row.numero_abonnement,
                a.client_id = row.client_id,
                a.type_abonnement_id = row.type_abonnement_id,
                a.date_debut = row.date_debut,
                a.date_fin = row.date_fin,
                a.date_achat = row.date_achat,
                a.statut_abonnement = row.statut_abonnement,
                a.montant_paye = row.montant_paye,
                a.transaction_id = row.transaction_id,
                a.lignes_autorisees = row.lignes_autorisees,
                a.zone_geographique = row.zone_geographique
            """,
            abonnement_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (c:Client {client_id: row.client_id})
            MATCH (a:Abonnement {abonnement_id: row.abonnement_id})
            MERGE (c)-[:SOUSCRIT]->(a)
            """,
            abonnement_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (a:Abonnement {abonnement_id: row.abonnement_id})
            MATCH (t:TypeAbonnement {type_abonnement_id: row.type_abonnement_id})
            MERGE (a)-[:DE_TYPE]->(t)
            """,
            abonnement_rows,
        )

        ligne_aut_rows = fetch_rows(
            abonnement_conn,
            """
            SELECT id,
                   type_abonnement_id,
                   ligne_id,
                   nom_ligne
            FROM ligne_autorisee
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (t:TypeAbonnement {type_abonnement_id: row.type_abonnement_id})
            MATCH (l:Ligne {ligne_id: row.ligne_id})
            MERGE (t)-[r:AUTORISE_LIGNE]->(l)
            SET r.nom_ligne = row.nom_ligne
            """,
            ligne_aut_rows,
        )

        print("Loading paiements...")
        paiement_rows = fetch_rows(
            payment_conn,
            """
            SELECT id AS transaction_id,
                   reference,
                   client_id,
                   montant,
                   devise,
                   type_paiement,
                   statut AS statut_transaction,
                   date_transaction,
                   type_service,
                   reference_service,
                   description,
                   motif_echec
            FROM transactions
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (p:Paiement {transaction_id: row.transaction_id})
            SET p.reference = row.reference,
                p.client_id = row.client_id,
                p.montant = row.montant,
                p.devise = row.devise,
                p.type_paiement = row.type_paiement,
                p.statut_transaction = row.statut_transaction,
                p.date_transaction = row.date_transaction,
                p.type_service = row.type_service,
                p.reference_service = row.reference_service,
                p.description = row.description,
                p.motif_echec = row.motif_echec
            """,
            paiement_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (c:Client {client_id: row.client_id})
            MATCH (p:Paiement {transaction_id: row.transaction_id})
            MERGE (c)-[:EFFECTUE]->(p)
            """,
            paiement_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (t:Ticket {ticket_id: row.ticket_id})
            MATCH (p:Paiement {transaction_id: row.transaction_id})
            MERGE (t)-[:PAYE_PAR]->(p)
            """,
            ticket_rows,
        )

        print("Loading geolocalisation...")
        location_rows = fetch_rows(
            geo_conn,
            """
            SELECT id AS location_id,
                   bus_id,
                   latitude,
                   longitude,
                   created_at
            FROM locations
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (l:Location {location_id: row.location_id})
            SET l.bus_id = row.bus_id,
                l.latitude = row.latitude,
                l.longitude = row.longitude,
                l.created_at = row.created_at
            """,
            location_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MATCH (b:Bus {bus_id: row.bus_id})
            MATCH (l:Location {location_id: row.location_id})
            MERGE (b)-[:A_POSITION]->(l)
            """,
            location_rows,
        )

        print("Loading notifications...")
        notification_rows = fetch_rows(
            notification_conn,
            """
            SELECT id AS notification_id,
                   user_id,
                   type,
                   title,
                   message,
                   is_read,
                   created_at,
                   payment_id,
                   amount,
                   ticket_id,
                   subscription_id
            FROM notifications
            """,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            MERGE (n:Notification {notification_id: row.notification_id})
            SET n.user_id = row.user_id,
                n.type = row.type,
                n.title = row.title,
                n.message = row.message,
                n.is_read = row.is_read,
                n.created_at = row.created_at,
                n.payment_id = row.payment_id,
                n.amount = row.amount,
                n.ticket_id = row.ticket_id,
                n.subscription_id = row.subscription_id
            """,
            notification_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            WITH row WHERE row.user_id IS NOT NULL
            MATCH (u:User {uuid: row.user_id})
            MATCH (n:Notification {notification_id: row.notification_id})
            MERGE (u)-[:RECOIT]->(n)
            """,
            notification_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            WITH row WHERE row.ticket_id IS NOT NULL
            MATCH (t:Ticket {ticket_id: row.ticket_id})
            MATCH (n:Notification {notification_id: row.notification_id})
            MERGE (n)-[:CONCERNE_TICKET]->(t)
            """,
            notification_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            WITH row WHERE row.payment_id IS NOT NULL
            MATCH (p:Paiement {transaction_id: row.payment_id})
            MATCH (n:Notification {notification_id: row.notification_id})
            MERGE (n)-[:CONCERNE_PAIEMENT]->(p)
            """,
            notification_rows,
        )
        run_unwind(
            session,
            """
            UNWIND $rows AS row
            WITH row WHERE row.subscription_id IS NOT NULL
            MATCH (a:Abonnement {abonnement_id: row.subscription_id})
            MATCH (n:Notification {notification_id: row.notification_id})
            MERGE (n)-[:CONCERNE_ABONNEMENT]->(a)
            """,
            notification_rows,
        )

        if apply_rules:
            run_cypher_file(session, rules_path)

        if apply_enrichment:
            run_cypher_file(session, enrichment_path)

    driver.close()
    print("Knowledge graph load complete.")


if __name__ == "__main__":
    main()
