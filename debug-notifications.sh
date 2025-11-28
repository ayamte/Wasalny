#!/bin/bash
# Script de débogage pour les notifications

echo "========================================="
echo "DÉBOGAGE NOTIFICATIONS"
echo "========================================="
echo ""

echo "1. Vérification des services..."
echo "--------------------------------"
docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "frontend|notification|gateway|auth"
echo ""

echo "2. Logs du notification-service (dernières 20 lignes)..."
echo "--------------------------------"
docker logs wasalny3-notification-service-1 --tail 20 2>&1
echo ""

echo "3. Logs du frontend (dernières 20 lignes)..."
echo "--------------------------------"
docker logs wasalny-frontend --tail 20 2>&1
echo ""

echo "4. Vérification des notifications en base..."
echo "--------------------------------"
docker exec -i postgres-notification psql -U wasalny_user -d notification_db -c "SELECT id, user_id, type, title, is_read FROM notifications ORDER BY created_at DESC LIMIT 10;"
echo ""

echo "5. Test de l'API Gateway..."
echo "--------------------------------"
echo "GET http://localhost:8080/api/notifications (nécessite authentification)"
echo ""

echo "========================================="
echo "FIN DU DÉBOGAGE"
echo "========================================="
