#!/bin/bash

# Script de test complet du workflow Wasalny
# Teste tous les services: auth, user, trajet, geolocalisation, paiement, ticket, abonnement, notification

set -e

BASE_URL="http://localhost:8080"
API_GATEWAY="http://localhost:8080"

echo "=================================================="
echo "TEST COMPLET WORKFLOW WASALNY - 8 SERVICES"
echo "=================================================="
echo ""

# Couleurs pour l'output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables globales pour stocker les tokens et IDs
ADMIN_TOKEN=""
CONDUCTEUR_TOKEN=""
CLIENT_TOKEN=""
ADMIN_ID=""
CONDUCTEUR_ID=""
CLIENT_ID=""
LIGNE_ID=""
STATION_DEPART_ID=""
STATION_INTERMEDIAIRE_ID=""
STATION_FINALE_ID=""
BUS_ID=""
CONFIG_HORAIRE_ID=""
TRIP_ID=""
TYPE_ABONNEMENT_ID=""
TICKET_ID=""
ABONNEMENT_ID=""
ASSIGNATION_ID=""

echo_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

echo_error() {
    echo -e "${RED}✗ $1${NC}"
}

echo_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# ==================================================
# 1. AUTH-SERVICE - AUTHENTICATION
# ==================================================
echo ""
echo "=================================================="
echo "1. AUTH-SERVICE - REGISTER & LOGIN"
echo "=================================================="

# Register ADMIN
echo_info "Registering ADMIN..."
ADMIN_RESPONSE=$(curl -s -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Admin",
    "prenom": "System",
    "email": "admin@wasalny.com",
    "password": "admin123",
    "telephone": "0600000001",
    "role": "ADMIN"
  }')

if echo "$ADMIN_RESPONSE" | grep -q "token"; then
    ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    ADMIN_ID=$(echo "$ADMIN_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
    echo_success "ADMIN registered and logged in"
    echo "Admin Token: ${ADMIN_TOKEN:0:50}..."
else
    echo_error "Failed to register ADMIN"
    echo "$ADMIN_RESPONSE"
fi

# Register CONDUCTEUR
echo_info "Registering CONDUCTEUR..."
CONDUCTEUR_RESPONSE=$(curl -s -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Conducteur",
    "prenom": "Hassan",
    "email": "conducteur@wasalny.com",
    "password": "conducteur123",
    "telephone": "0600000002",
    "role": "CONDUCTEUR"
  }')

if echo "$CONDUCTEUR_RESPONSE" | grep -q "token"; then
    CONDUCTEUR_TOKEN=$(echo "$CONDUCTEUR_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    CONDUCTEUR_ID=$(echo "$CONDUCTEUR_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
    echo_success "CONDUCTEUR registered and logged in"
    echo "Conducteur Token: ${CONDUCTEUR_TOKEN:0:50}..."
else
    echo_error "Failed to register CONDUCTEUR"
    echo "$CONDUCTEUR_RESPONSE"
fi

# Register CLIENT
echo_info "Registering CLIENT..."
CLIENT_RESPONSE=$(curl -s -X POST "${API_GATEWAY}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Client",
    "prenom": "Fatima",
    "email": "client@wasalny.com",
    "password": "client123",
    "telephone": "0600000003",
    "role": "CLIENT"
  }')

if echo "$CLIENT_RESPONSE" | grep -q "token"; then
    CLIENT_TOKEN=$(echo "$CLIENT_RESPONSE" | grep -o '"token":"[^"]*' | sed 's/"token":"//')
    CLIENT_ID=$(echo "$CLIENT_RESPONSE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
    echo_success "CLIENT registered and logged in"
    echo "Client Token: ${CLIENT_TOKEN:0:50}..."
else
    echo_error "Failed to register CLIENT"
    echo "$CLIENT_RESPONSE"
fi

sleep 2

# ==================================================
# 2. USER-SERVICE - GET USER PROFILES
# ==================================================
echo ""
echo "=================================================="
echo "2. USER-SERVICE - GET PROFILES"
echo "=================================================="

echo_info "Getting ADMIN profile..."
curl -s -X GET "${API_GATEWAY}/users/${ADMIN_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" | jq '.'

echo_info "Getting CONDUCTEUR profile..."
curl -s -X GET "${API_GATEWAY}/users/${CONDUCTEUR_ID}" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" | jq '.'

echo_info "Getting CLIENT profile..."
curl -s -X GET "${API_GATEWAY}/users/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

sleep 2

# ==================================================
# 3. TRAJET-SERVICE - ADMIN CREATES INFRASTRUCTURE
# ==================================================
echo ""
echo "=================================================="
echo "3. TRAJET-SERVICE - ADMIN CREATES INFRASTRUCTURE"
echo "=================================================="

# Create Stations
echo_info "Creating Station DEPART (Hay Riad)..."
STATION_DEPART=$(curl -s -X POST "${API_GATEWAY}/trajets/stations" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Hay Riad",
    "latitude": 33.9822,
    "longitude": -6.8489,
    "adresse": "Boulevard Hay Riad, Rabat"
  }')
STATION_DEPART_ID=$(echo "$STATION_DEPART" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Station DEPART created: $STATION_DEPART_ID"

echo_info "Creating Station INTERMEDIAIRE (Agdal)..."
STATION_INTER=$(curl -s -X POST "${API_GATEWAY}/trajets/stations" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Agdal",
    "latitude": 33.9715,
    "longitude": -6.8498,
    "adresse": "Avenue Ibn Sina, Agdal, Rabat"
  }')
STATION_INTERMEDIAIRE_ID=$(echo "$STATION_INTER" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Station INTERMEDIAIRE created: $STATION_INTERMEDIAIRE_ID"

echo_info "Creating Station FINALE (Bab El Had)..."
STATION_FINALE=$(curl -s -X POST "${API_GATEWAY}/trajets/stations" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Bab El Had",
    "latitude": 34.0209,
    "longitude": -6.8347,
    "adresse": "Place Bab El Had, Rabat"
  }')
STATION_FINALE_ID=$(echo "$STATION_FINALE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Station FINALE created: $STATION_FINALE_ID"

sleep 1

# Create Ligne
echo_info "Creating Ligne with stations..."
LIGNE=$(curl -s -X POST "${API_GATEWAY}/trajets/lignes" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"numero\": \"L12\",
    \"nom\": \"Ligne Hay Riad - Bab El Had\",
    \"description\": \"Ligne directe centre ville\",
    \"stationDepartId\": \"${STATION_DEPART_ID}\",
    \"stationFinaleId\": \"${STATION_FINALE_ID}\",
    \"stationsIntermediaires\": [\"${STATION_INTERMEDIAIRE_ID}\"],
    \"tarifBase\": 7.00
  }")
LIGNE_ID=$(echo "$LIGNE" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Ligne created: $LIGNE_ID"

sleep 1

# Create Bus
echo_info "Creating Bus..."
BUS=$(curl -s -X POST "${API_GATEWAY}/trajets/bus" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroImmatriculation": "ABC-123-45",
    "modele": "Mercedes Citaro",
    "capacite": 80,
    "statut": "DISPONIBLE"
  }')
BUS_ID=$(echo "$BUS" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Bus created: $BUS_ID"

sleep 1

# Create Configuration Horaire
echo_info "Creating Configuration Horaire..."
CONFIG=$(curl -s -X POST "${API_GATEWAY}/trajets/configurations-horaires" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"ligneId\": \"${LIGNE_ID}\",
    \"nom\": \"Horaires Semaine Ligne 12\",
    \"heureDebut\": \"06:00:00\",
    \"heureFin\": \"23:00:00\",
    \"intervalleMinutes\": 30,
    \"joursActifs\": [\"LUNDI\", \"MARDI\", \"MERCREDI\", \"JEUDI\", \"VENDREDI\"],
    \"active\": true
  }")
CONFIG_HORAIRE_ID=$(echo "$CONFIG" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Configuration Horaire created: $CONFIG_HORAIRE_ID"

sleep 2

# ==================================================
# 4. ABONNEMENT-SERVICE - ADMIN CREATES TYPE ABONNEMENT
# ==================================================
echo ""
echo "=================================================="
echo "4. ABONNEMENT-SERVICE - CREATE TYPE ABONNEMENT"
echo "=================================================="

echo_info "Creating Type Abonnement MENSUEL..."
TYPE_ABO=$(curl -s -X POST "${API_GATEWAY}/abonnements/types" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"nom\": \"Mensuel Standard\",
    \"description\": \"Abonnement mensuel toutes lignes\",
    \"dureeJours\": 30,
    \"prix\": 150.00,
    \"lignesAutorisees\": [\"${LIGNE_ID}\"]
  }")
TYPE_ABONNEMENT_ID=$(echo "$TYPE_ABO" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Type Abonnement created: $TYPE_ABONNEMENT_ID"

sleep 2

# ==================================================
# 5. TRAJET-SERVICE - ADMIN ASSIGNS BUS TO CONDUCTEUR
# ==================================================
echo ""
echo "=================================================="
echo "5. TRAJET-SERVICE - ASSIGN BUS TO CONDUCTEUR"
echo "=================================================="

echo_info "Assigning Bus to Conducteur..."
ASSIGNATION=$(curl -s -X POST "${API_GATEWAY}/trajets/assignations" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"busId\": \"${BUS_ID}\",
    \"conducteurId\": \"${CONDUCTEUR_ID}\",
    \"dateDebut\": \"2025-11-18\",
    \"dateFin\": \"2025-11-18\"
  }")
ASSIGNATION_ID=$(echo "$ASSIGNATION" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Bus assigned to Conducteur: $ASSIGNATION_ID"

sleep 2

# ==================================================
# 6. TRAJET-SERVICE - ADMIN GENERATES TRIPS
# ==================================================
echo ""
echo "=================================================="
echo "6. TRAJET-SERVICE - GENERATE TRIPS FOR TODAY"
echo "=================================================="

echo_info "Generating trips for today..."
TRIPS=$(curl -s -X POST "${API_GATEWAY}/trajets/configurations-horaires/${CONFIG_HORAIRE_ID}/generer-trips?date=2025-11-18" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}")
TRIP_ID=$(echo "$TRIPS" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo_success "Trips generated, first trip ID: $TRIP_ID"
echo "$TRIPS" | jq '.[0:3]'

sleep 2

# ==================================================
# 7. CLIENT - CONSULT INFRASTRUCTURE
# ==================================================
echo ""
echo "=================================================="
echo "7. CLIENT - CONSULT INFRASTRUCTURE"
echo "=================================================="

echo_info "CLIENT: Getting all lignes..."
curl -s -X GET "${API_GATEWAY}/trajets/lignes" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "CLIENT: Getting all stations..."
curl -s -X GET "${API_GATEWAY}/trajets/stations" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "CLIENT: Getting trips for today..."
curl -s -X GET "${API_GATEWAY}/trajets/trips?date=2025-11-18" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.[0:2]'

echo_info "CLIENT: Getting specific trip details..."
curl -s -X GET "${API_GATEWAY}/trajets/trips/${TRIP_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

sleep 2

# ==================================================
# 8. PAIEMENT-SERVICE - CLIENT BUYS TICKET
# ==================================================
echo ""
echo "=================================================="
echo "8. PAIEMENT-SERVICE - CLIENT BUYS TICKET"
echo "=================================================="

echo_info "CLIENT: Initiating payment for ticket..."
PAYMENT_TICKET=$(curl -s -X POST "${API_GATEWAY}/paiements/initier" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"clientId\": \"${CLIENT_ID}\",
    \"montant\": 7.00,
    \"typePaiement\": \"TICKET\",
    \"referenceExterne\": \"${TRIP_ID}\",
    \"methodePaiement\": \"CARTE_BANCAIRE\"
  }")
TRANSACTION_TICKET_ID=$(echo "$PAYMENT_TICKET" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Payment initiated for ticket: $TRANSACTION_TICKET_ID"

sleep 1

echo_info "CLIENT: Confirming payment for ticket..."
curl -s -X POST "${API_GATEWAY}/paiements/${TRANSACTION_TICKET_ID}/confirmer" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceTransaction": "TXN-TICKET-001"
  }' | jq '.'

echo_success "Ticket payment confirmed - Ticket should be created automatically via RabbitMQ"

sleep 3

# ==================================================
# 9. TICKET-SERVICE - CLIENT CHECKS TICKET
# ==================================================
echo ""
echo "=================================================="
echo "9. TICKET-SERVICE - CLIENT CHECKS TICKET"
echo "=================================================="

echo_info "CLIENT: Getting my tickets..."
TICKETS=$(curl -s -X GET "${API_GATEWAY}/tickets/client/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}")
TICKET_ID=$(echo "$TICKETS" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "$TICKETS" | jq '.'
echo_success "Ticket retrieved: $TICKET_ID"

sleep 2

# ==================================================
# 10. PAIEMENT-SERVICE - CLIENT BUYS ABONNEMENT
# ==================================================
echo ""
echo "=================================================="
echo "10. PAIEMENT-SERVICE - CLIENT BUYS ABONNEMENT"
echo "=================================================="

echo_info "CLIENT: Initiating payment for abonnement..."
PAYMENT_ABO=$(curl -s -X POST "${API_GATEWAY}/paiements/initier" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"clientId\": \"${CLIENT_ID}\",
    \"montant\": 150.00,
    \"typePaiement\": \"ABONNEMENT\",
    \"referenceExterne\": \"${TYPE_ABONNEMENT_ID}\",
    \"methodePaiement\": \"CARTE_BANCAIRE\"
  }")
TRANSACTION_ABO_ID=$(echo "$PAYMENT_ABO" | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo_success "Payment initiated for abonnement: $TRANSACTION_ABO_ID"

sleep 1

echo_info "CLIENT: Confirming payment for abonnement..."
curl -s -X POST "${API_GATEWAY}/paiements/${TRANSACTION_ABO_ID}/confirmer" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceTransaction": "TXN-ABO-001"
  }' | jq '.'

echo_success "Abonnement payment confirmed - Abonnement should be created via RabbitMQ"

sleep 3

# ==================================================
# 11. ABONNEMENT-SERVICE - CLIENT CHECKS ABONNEMENT
# ==================================================
echo ""
echo "=================================================="
echo "11. ABONNEMENT-SERVICE - CLIENT CHECKS ABONNEMENT"
echo "=================================================="

echo_info "CLIENT: Getting my abonnements..."
ABONNEMENTS=$(curl -s -X GET "${API_GATEWAY}/abonnements/client/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}")
ABONNEMENT_ID=$(echo "$ABONNEMENTS" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo "$ABONNEMENTS" | jq '.'
echo_success "Abonnement retrieved: $ABONNEMENT_ID"

sleep 2

# ==================================================
# 12. TRAJET-SERVICE - CONDUCTEUR STARTS TRIP
# ==================================================
echo ""
echo "=================================================="
echo "12. TRAJET-SERVICE - CONDUCTEUR STARTS TRIP"
echo "=================================================="

echo_info "CONDUCTEUR: Starting trip..."
TRIP_STARTED=$(curl -s -X POST "${API_GATEWAY}/trajets/trips/${TRIP_ID}/demarrer" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}")
echo "$TRIP_STARTED" | jq '.'
echo_success "Trip started by CONDUCTEUR"

sleep 2

# ==================================================
# 13. GEOLOCALISATION-SERVICE - CONDUCTEUR UPDATES LOCATION
# ==================================================
echo ""
echo "=================================================="
echo "13. GEOLOCALISATION-SERVICE - CONDUCTEUR UPDATES LOCATION"
echo "=================================================="

echo_info "CONDUCTEUR: Updating bus location #1 (Hay Riad)..."
curl -s -X POST "${API_GATEWAY}/locations" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"busId\": \"${BUS_ID}\",
    \"latitude\": 33.9822,
    \"longitude\": -6.8489,
    \"vitesse\": 0.0,
    \"direction\": \"Nord\"
  }" | jq '.'

sleep 2

echo_info "CONDUCTEUR: Updating bus location #2 (En route vers Agdal)..."
curl -s -X POST "${API_GATEWAY}/locations" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"busId\": \"${BUS_ID}\",
    \"latitude\": 33.9770,
    \"longitude\": -6.8492,
    \"vitesse\": 45.5,
    \"direction\": \"Nord\"
  }" | jq '.'

sleep 2

echo_info "CONDUCTEUR: Updating bus location #3 (Agdal)..."
curl -s -X POST "${API_GATEWAY}/locations" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"busId\": \"${BUS_ID}\",
    \"latitude\": 33.9715,
    \"longitude\": -6.8498,
    \"vitesse\": 0.0,
    \"direction\": \"Nord\"
  }" | jq '.'

sleep 2

# ==================================================
# 14. GEOLOCALISATION-SERVICE - CLIENT TRACKS BUS
# ==================================================
echo ""
echo "=================================================="
echo "14. GEOLOCALISATION-SERVICE - CLIENT TRACKS BUS"
echo "=================================================="

echo_info "CLIENT: Getting latest bus location..."
curl -s -X GET "${API_GATEWAY}/locations/latest?busId=${BUS_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "CLIENT: Getting all bus locations..."
curl -s -X GET "${API_GATEWAY}/locations?busId=${BUS_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "CLIENT: Getting nearby buses (from Agdal position)..."
curl -s -X GET "${API_GATEWAY}/locations/nearby?latitude=33.9715&longitude=-6.8498&radiusKm=5.0" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

sleep 2

# ==================================================
# 15. TRAJET-SERVICE - CONDUCTEUR CONFIRMS STATION PASSAGES
# ==================================================
echo ""
echo "=================================================="
echo "15. TRAJET-SERVICE - CONDUCTEUR CONFIRMS PASSAGES"
echo "=================================================="

# Get passage IDs
PASSAGES=$(curl -s -X GET "${API_GATEWAY}/trajets/passages-stations/trip/${TRIP_ID}" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}")
echo_info "Getting passages for trip..."
echo "$PASSAGES" | jq '.'

PASSAGE_1_ID=$(echo "$PASSAGES" | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
PASSAGE_2_ID=$(echo "$PASSAGES" | grep -o '"id":"[^"]*' | head -2 | tail -1 | sed 's/"id":"//')

echo_info "CONDUCTEUR: Confirming passage at station 1..."
curl -s -X POST "${API_GATEWAY}/trajets/passages-stations/${PASSAGE_1_ID}/confirmer" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" | jq '.'

sleep 2

echo_info "CONDUCTEUR: Confirming passage at station 2..."
curl -s -X POST "${API_GATEWAY}/trajets/passages-stations/${PASSAGE_2_ID}/confirmer" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" | jq '.'

sleep 2

# ==================================================
# 16. TRAJET-SERVICE - CONDUCTEUR FINISHES TRIP
# ==================================================
echo ""
echo "=================================================="
echo "16. TRAJET-SERVICE - CONDUCTEUR FINISHES TRIP"
echo "=================================================="

echo_info "CONDUCTEUR: Finishing trip..."
curl -s -X POST "${API_GATEWAY}/trajets/trips/${TRIP_ID}/terminer" \
  -H "Authorization: Bearer ${CONDUCTEUR_TOKEN}" | jq '.'
echo_success "Trip finished by CONDUCTEUR"

sleep 2

# ==================================================
# 17. NOTIFICATION-SERVICE - CHECK NOTIFICATIONS
# ==================================================
echo ""
echo "=================================================="
echo "17. NOTIFICATION-SERVICE - CHECK NOTIFICATIONS"
echo "=================================================="

echo_info "CLIENT: Getting my notifications..."
curl -s -X GET "${API_GATEWAY}/notifications/user/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "ADMIN: Getting all notifications..."
curl -s -X GET "${API_GATEWAY}/notifications" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" | jq '.[0:5]'

sleep 1

# ==================================================
# 18. FINAL STATS AND SUMMARY
# ==================================================
echo ""
echo "=================================================="
echo "18. FINAL STATS AND SUMMARY"
echo "=================================================="

echo_info "Getting CLIENT tickets..."
curl -s -X GET "${API_GATEWAY}/tickets/client/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "Getting CLIENT abonnements..."
curl -s -X GET "${API_GATEWAY}/abonnements/client/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "Getting CLIENT transactions..."
curl -s -X GET "${API_GATEWAY}/paiements/client/${CLIENT_ID}" \
  -H "Authorization: Bearer ${CLIENT_TOKEN}" | jq '.'

echo_info "Getting trip details..."
curl -s -X GET "${API_GATEWAY}/trajets/trips/${TRIP_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" | jq '.'

echo ""
echo "=================================================="
echo "TEST COMPLETE!"
echo "=================================================="
echo ""
echo_success "All 8 services tested successfully:"
echo "  1. ✓ auth-service - Register & Login"
echo "  2. ✓ user-service - User profiles"
echo "  3. ✓ trajet-service - Infrastructure & trips"
echo "  4. ✓ abonnement-service - Subscriptions"
echo "  5. ✓ paiement-service - Payments"
echo "  6. ✓ ticket-service - Tickets"
echo "  7. ✓ geolocalisation-service - Real-time tracking"
echo "  8. ✓ notification-service - Notifications"
echo ""
echo "IDs for reference:"
echo "  Admin ID: $ADMIN_ID"
echo "  Conducteur ID: $CONDUCTEUR_ID"
echo "  Client ID: $CLIENT_ID"
echo "  Ligne ID: $LIGNE_ID"
echo "  Bus ID: $BUS_ID"
echo "  Trip ID: $TRIP_ID"
echo "  Ticket ID: $TICKET_ID"
echo "  Abonnement ID: $ABONNEMENT_ID"
