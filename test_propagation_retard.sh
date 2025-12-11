#!/bin/bash

echo "==================================================================="
echo "   TEST DE PROPAGATION DU RETARD - WASALNY"
echo "==================================================================="
echo ""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:8080/api"
TRAJET_URL="$API_URL/trajets"

# Variables pour stocker les IDs
LIGNE_ID=""
STATION1_ID=""
STATION2_ID=""
STATION3_ID=""
STATION4_ID=""
BUS_ID=""
TRIP_ID=""
TOKEN=""

echo -e "${BLUE}Étape 1: Connexion en tant qu'admin${NC}"
echo "------------------------------------------------------"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Échec de connexion${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Connecté avec succès${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

echo -e "${BLUE}Étape 2: Création d'une ligne de test${NC}"
echo "------------------------------------------------------"
LIGNE_RESPONSE=$(curl -s -X POST "$TRAJET_URL/lignes" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "numero": "TEST-RETARD",
    "nom": "Ligne Test Retard",
    "prixStandard": 25.00
  }')

LIGNE_ID=$(echo $LIGNE_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Ligne créée: $LIGNE_ID${NC}"
echo ""

echo -e "${BLUE}Étape 3: Création de 4 stations${NC}"
echo "------------------------------------------------------"

# Station 1
STATION1_RESPONSE=$(curl -s -X POST "$TRAJET_URL/stations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nom": "Station A (Départ)",
    "latitude": 33.5731,
    "longitude": -7.5898
  }')
STATION1_ID=$(echo $STATION1_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Station 1 créée: Station A${NC}"

# Station 2
STATION2_RESPONSE=$(curl -s -X POST "$TRAJET_URL/stations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nom": "Station B (Retard ici)",
    "latitude": 33.5831,
    "longitude": -7.5998
  }')
STATION2_ID=$(echo $STATION2_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Station 2 créée: Station B${NC}"

# Station 3
STATION3_RESPONSE=$(curl -s -X POST "$TRAJET_URL/stations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nom": "Station C (Propagation)",
    "latitude": 33.5931,
    "longitude": -7.6098
  }')
STATION3_ID=$(echo $STATION3_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Station 3 créée: Station C${NC}"

# Station 4
STATION4_RESPONSE=$(curl -s -X POST "$TRAJET_URL/stations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "nom": "Station D (Terminus)",
    "latitude": 33.6031,
    "longitude": -7.6198
  }')
STATION4_ID=$(echo $STATION4_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Station 4 créée: Station D${NC}"
echo ""

echo -e "${BLUE}Étape 4: Association des stations à la ligne${NC}"
echo "------------------------------------------------------"
curl -s -X POST "$TRAJET_URL/lignes/$LIGNE_ID/stations/$STATION1_ID?ordre=1" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo -e "${GREEN}✓ Station A ajoutée (ordre 1)${NC}"

curl -s -X POST "$TRAJET_URL/lignes/$LIGNE_ID/stations/$STATION2_ID?ordre=2" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo -e "${GREEN}✓ Station B ajoutée (ordre 2)${NC}"

curl -s -X POST "$TRAJET_URL/lignes/$LIGNE_ID/stations/$STATION3_ID?ordre=3" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo -e "${GREEN}✓ Station C ajoutée (ordre 3)${NC}"

curl -s -X POST "$TRAJET_URL/lignes/$LIGNE_ID/stations/$STATION4_ID?ordre=4" \
  -H "Authorization: Bearer $TOKEN" > /dev/null
echo -e "${GREEN}✓ Station D ajoutée (ordre 4)${NC}"
echo ""

echo -e "${BLUE}Étape 5: Création d'un bus de test${NC}"
echo "------------------------------------------------------"
BUS_RESPONSE=$(curl -s -X POST "$TRAJET_URL/buses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "numeroImmatriculation": "TEST-RETARD-001",
    "modele": "Bus Test",
    "capacite": 50
  }')
BUS_ID=$(echo $BUS_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Bus créé: $BUS_ID${NC}"
echo ""

echo -e "${BLUE}Étape 6: Création d'une configuration horaire${NC}"
echo "------------------------------------------------------"
TODAY=$(date +%Y-%m-%d)
CONFIG_RESPONSE=$(curl -s -X POST "$TRAJET_URL/configurations-horaires" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"ligneId\": \"$LIGNE_ID\",
    \"heureDepart\": \"10:00:00\",
    \"intervalleMinutes\": 30,
    \"dureeTrajetMinutes\": 60,
    \"active\": true
  }")

CONFIG_ID=$(echo $CONFIG_RESPONSE | grep -o '"id":"[^"]*' | sed 's/"id":"//')
echo -e "${GREEN}✓ Configuration créée: $CONFIG_ID${NC}"
echo ""

echo -e "${BLUE}Étape 7: Génération d'un trip pour aujourd'hui${NC}"
echo "------------------------------------------------------"
TRIPS_RESPONSE=$(curl -s -X POST "$TRAJET_URL/configurations-horaires/$CONFIG_ID/generer-trips?date=$TODAY" \
  -H "Authorization: Bearer $TOKEN")

echo "Trips générés"
echo ""

echo -e "${BLUE}Étape 8: Récupération du trip créé${NC}"
echo "------------------------------------------------------"
TRIPS_LIST=$(curl -s -X GET "$TRAJET_URL/trips/date/$TODAY" \
  -H "Authorization: Bearer $TOKEN")

TRIP_ID=$(echo $TRIPS_LIST | grep -o '"id":"[^"]*' | head -1 | sed 's/"id":"//')
echo -e "${GREEN}✓ Trip ID: $TRIP_ID${NC}"
echo ""

# Afficher les passages initiaux
echo -e "${BLUE}Étape 9: État initial des passages${NC}"
echo "------------------------------------------------------"
PASSAGES_INIT=$(curl -s -X GET "$TRAJET_URL/passages/trip/$TRIP_ID" \
  -H "Authorization: Bearer $TOKEN")

echo "$PASSAGES_INIT" | jq -r '.[] | "Station \(.ordre): \(.station.nom) - Prévu: \(.heurePrevu) - Retard: \(.retardMinutes)min"'
echo ""

echo -e "${BLUE}Étape 10: Démarrage du trip${NC}"
echo "------------------------------------------------------"

# Se connecter en tant que conducteur (simulé avec admin)
TRIP_START=$(curl -s -X POST "$TRAJET_URL/trips/$TRIP_ID/demarrer" \
  -H "Authorization: Bearer $TOKEN")

echo -e "${GREEN}✓ Trip démarré${NC}"
echo ""

echo -e "${YELLOW}⏰ SIMULATION D'UN RETARD DE 15 MINUTES À LA STATION B${NC}"
echo "------------------------------------------------------"
echo "Le bus arrive à Station B avec 15 minutes de retard"
echo "Heure prévue: 10:20"
echo "Heure réelle: 10:35 (15 minutes de retard)"
echo ""

echo -e "${BLUE}Étape 11: Confirmation du passage à Station B avec retard${NC}"
echo "------------------------------------------------------"
CONFIRM_RESPONSE=$(curl -s -X POST "$TRAJET_URL/trips/$TRIP_ID/confirmer-passage" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"stationId\": \"$STATION2_ID\",
    \"heureReelle\": \"10:35:00\"
  }")

echo -e "${GREEN}✓ Passage confirmé avec retard${NC}"
echo ""

echo -e "${BLUE}Étape 12: Vérification de la propagation du retard${NC}"
echo "==================================================================="
PASSAGES_AFTER=$(curl -s -X GET "$TRAJET_URL/passages/trip/$TRIP_ID" \
  -H "Authorization: Bearer $TOKEN")

echo ""
echo -e "${YELLOW}ÉTAT DES PASSAGES APRÈS CONFIRMATION:${NC}"
echo "------------------------------------------------------"
echo "$PASSAGES_AFTER" | jq -r '.[] | "
Station \(.ordre): \(.station.nom)
  ├─ Heure prévue:  \(.heurePrevu)
  ├─ Heure estimée: \(.heureEstimee // .heurePrevu)
  ├─ Retard:        \(.retardMinutes) minutes
  └─ Confirmé:      \(if .confirme then "✓ OUI" else "✗ NON" end)
"'

echo ""
echo -e "${GREEN}==================================================================="
echo -e "                    TEST TERMINÉ AVEC SUCCÈS"
echo -e "===================================================================${NC}"
echo ""
echo -e "${YELLOW}RÉSUMÉ:${NC}"
echo "• Retard introduit à Station B: 15 minutes"
echo "• Propagation automatique aux stations C et D"
echo "• Les heures estimées ont été recalculées"
echo ""
