#!/bin/bash

# Script de test pour créer des notifications de test
# Assurez-vous d'avoir un token JWT valide

# Remplacez ces valeurs
TOKEN="votre_token_jwt_ici"
USER_ID="1"
API_URL="http://localhost:8088"

echo "========================================="
echo "Script de test des notifications"
echo "========================================="
echo ""

# Test 1: Créer une notification PAYMENT
echo "1. Création d'une notification PAYMENT..."
curl -X POST "${API_URL}/api/notifications/test/payment" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"${USER_ID}\",
    \"paymentId\": \"PAY-12345\",
    \"amount\": 50.00
  }"
echo ""
echo ""

# Test 2: Créer une notification TICKET
echo "2. Création d'une notification TICKET..."
curl -X POST "${API_URL}/api/notifications/test/ticket" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"${USER_ID}\",
    \"ticketId\": \"TICKET-67890\"
  }"
echo ""
echo ""

# Test 3: Créer une notification SUBSCRIPTION
echo "3. Création d'une notification SUBSCRIPTION..."
curl -X POST "${API_URL}/api/notifications/test/subscription" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"${USER_ID}\",
    \"subscriptionId\": \"SUB-54321\"
  }"
echo ""
echo ""

# Test 4: Récupérer toutes les notifications
echo "4. Récupération de toutes les notifications..."
curl -X GET "${API_URL}/notifications?userId=${USER_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
echo ""
echo ""

# Test 5: Récupérer les notifications non lues
echo "5. Récupération des notifications non lues..."
curl -X GET "${API_URL}/notifications/unread?userId=${USER_ID}" \
  -H "Authorization: Bearer ${TOKEN}"
echo ""
echo ""

echo "========================================="
echo "Tests terminés!"
echo "========================================="
