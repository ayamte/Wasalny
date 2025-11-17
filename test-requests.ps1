# Script de test pour l'architecture Microservices Wasalny avec UUIDs
# Date: 2025-11-17

Write-Host "=== Tests des Microservices Wasalny avec UUIDs ===" -ForegroundColor Cyan

# 1. Test Login CLIENT
Write-Host "`n1. Login CLIENT (ayamtejjal123@gmail.com)" -ForegroundColor Yellow
$loginClient = Invoke-RestMethod -Uri "http://localhost:8080/auth-service/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"ayamtejjal123@gmail.com","password":"password123"}'

Write-Host "Token: $($loginClient.token.Substring(0,50))..." -ForegroundColor Green
Write-Host "UUID Client: $($loginClient.userId)" -ForegroundColor Green
Write-Host "Email: $($loginClient.email)" -ForegroundColor Green
Write-Host "Username: $($loginClient.username)" -ForegroundColor Green
Write-Host "Role: $($loginClient.role)" -ForegroundColor Green

$tokenClient = $loginClient.token
$uuidClient = $loginClient.userId

# 2. Test Login ADMIN
Write-Host "`n2. Login ADMIN (ayakim127@gmail.com)" -ForegroundColor Yellow
$loginAdmin = Invoke-RestMethod -Uri "http://localhost:8080/auth-service/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body '{"email":"ayakim127@gmail.com","password":"password123"}'

Write-Host "UUID Admin: $($loginAdmin.userId)" -ForegroundColor Green
Write-Host "Email: $($loginAdmin.email)" -ForegroundColor Green
Write-Host "Role: $($loginAdmin.role)" -ForegroundColor Green

$tokenAdmin = $loginAdmin.token
$uuidAdmin = $loginAdmin.userId

# 3. Test Ticket Service avec UUID
Write-Host "`n3. Test GET /ticket-service/tickets/client/{uuid}" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $tokenClient"
    }
    $tickets = Invoke-RestMethod -Uri "http://localhost:8080/ticket-service/tickets/client/$uuidClient" `
        -Method GET `
        -Headers $headers

    if ($tickets.Count -eq 0) {
        Write-Host "Aucun ticket trouvé pour ce client (normal si aucun ticket n'a été créé)" -ForegroundColor Cyan
    } else {
        Write-Host "Tickets trouvés:" -ForegroundColor Green
        $tickets | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test User Service (si disponible)
Write-Host "`n4. Test GET /user-service/admin/users/role/CLIENT" -ForegroundColor Yellow
Write-Host "Note: User-service peut avoir des problèmes de timeout (voir SOLUTION_USER_SERVICE.md)" -ForegroundColor DarkYellow
try {
    $headers = @{
        "Authorization" = "Bearer $tokenAdmin"
    }
    $users = Invoke-RestMethod -Uri "http://localhost:8080/user-service/admin/users/role/CLIENT" `
        -Method GET `
        -Headers $headers `
        -TimeoutSec 5

    Write-Host "Utilisateurs trouvés avec UUID:" -ForegroundColor Green
    foreach ($user in $users) {
        Write-Host "  - Email: $($user.email), UUID: $($user.uuid), ID: $($user.id)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Timeout ou erreur (comportement connu): $($_.Exception.Message)" -ForegroundColor DarkYellow
}

# 5. Résumé des UUIDs
Write-Host "`n=== Résumé des UUIDs ===" -ForegroundColor Cyan
Write-Host "CLIENT (ayamtejjal123@gmail.com): $uuidClient" -ForegroundColor Green
Write-Host "ADMIN  (ayakim127@gmail.com):     $uuidAdmin" -ForegroundColor Green

Write-Host "`n=== Tests terminés ===" -ForegroundColor Cyan
Write-Host "Pour plus de détails, consultez UUID_MIGRATION_GUIDE.md" -ForegroundColor Yellow
