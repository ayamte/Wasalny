# Script de test pour l'endpoint de paiement
Write-Host "=== Test de l'endpoint POST /paiements/initier ===" -ForegroundColor Cyan

# Etape 1: Login pour obtenir le token
Write-Host "`n1. Login pour obtenir le token CLIENT..." -ForegroundColor Yellow
$loginBody = @{
    email = "ahmed@gmail.com"
    password = "<REDACTED>"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/auth-service/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop

    $token = $loginResponse.token
    $clientId = $loginResponse.userId

    Write-Host "[OK] Login reussi!" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host "  Client ID: $clientId" -ForegroundColor Gray
} catch {
    Write-Host "[ERREUR] Erreur lors du login: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

# Etape 2: Obtenir un trip ID (pour tester)
Write-Host "`n2. Recuperation d'un trip pour le test..." -ForegroundColor Yellow
try {
    $tripsResponse = Invoke-RestMethod -Uri "http://localhost:8080/trajet-service/trajets/trips?date=2025-11-21" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $token"
        } `
        -ErrorAction Stop

    if ($tripsResponse -and $tripsResponse.Count -gt 0) {
        $tripId = $tripsResponse[0].id
        Write-Host "[OK] Trip trouve: $tripId" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Aucun trip trouve, utilisation d'un UUID fictif" -ForegroundColor Yellow
        $tripId = "00000000-0000-0000-0000-000000000000"
    }
} catch {
    Write-Host "[WARN] Erreur lors de la recuperation des trips, utilisation d'un UUID fictif" -ForegroundColor Yellow
    $tripId = "00000000-0000-0000-0000-000000000000"
}

# Etape 3: Test de l'endpoint de paiement
Write-Host "`n3. Test de l'endpoint POST /paiements/initier..." -ForegroundColor Yellow

$paiementBody = @{
    clientId = $clientId
    montant = 7.00
    typePaiement = "CARTE_BANCAIRE"
    typeService = "ACHAT_TICKET"
    referenceService = $tripId
    description = "Achat ticket de bus - Test"
    infoCarte = @{
        numeroCarte = "4532123456789012"
        nomTitulaire = "AHMED AHMED"
        dateExpiration = "12/26"
        cvv = "123"
    }
} | ConvertTo-Json -Depth 10

Write-Host "`nCorps de la requête:" -ForegroundColor Gray
Write-Host $paiementBody -ForegroundColor Gray

try {
    $paiementResponse = Invoke-RestMethod -Uri "http://localhost:8082/paiements/initier" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{
            "Authorization" = "Bearer $token"
        } `
        -Body $paiementBody `
        -ErrorAction Stop

    Write-Host "`n[OK] Paiement initie avec succes!" -ForegroundColor Green
    Write-Host "`nReponse:" -ForegroundColor Cyan
    $paiementResponse | ConvertTo-Json -Depth 10 | Write-Host -ForegroundColor White

} catch {
    Write-Host "`n[ERREUR] Erreur lors de l'initiation du paiement" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "  Message: $($_.Exception.Message)" -ForegroundColor Red

    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }

    exit 1
}

Write-Host "`n=== Test termine ===" -ForegroundColor Cyan

