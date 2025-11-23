# Script de test pour l'endpoint de paiement (direct sans API Gateway)
Write-Host "=== Test de l'endpoint POST /paiements/initier (direct) ===" -ForegroundColor Cyan

# Etape 1: Login pour obtenir le token (direct sur auth-service)
Write-Host "`n1. Login pour obtenir le token CLIENT..." -ForegroundColor Yellow
$loginBody = @{
    email = "ahmed@gmail.com"
    password = "<REDACTED>"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8086/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody `
        -ErrorAction Stop
    
    $token = $loginResponse.token
    $clientId = $loginResponse.userId
    
    Write-Host "[OK] Login reussi!" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 30))..." -ForegroundColor Gray
    Write-Host "  Client ID: $clientId" -ForegroundColor Gray
    Write-Host "  Nom: $($loginResponse.nom)" -ForegroundColor Gray
    Write-Host "  Prenom: $($loginResponse.prenom)" -ForegroundColor Gray
    Write-Host "  Telephone: $($loginResponse.telephone)" -ForegroundColor Gray
} catch {
    Write-Host "[ERREUR] Erreur lors du login: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

# Etape 2: Utiliser un UUID fictif pour le trip
Write-Host "`n2. Utilisation d'un UUID fictif pour le trip..." -ForegroundColor Yellow
$tripId = "123e4567-e89b-12d3-a456-426614174000"
Write-Host "  Trip ID: $tripId" -ForegroundColor Gray

# Etape 3: Test de l'endpoint de paiement (direct sur paiement-service)
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

Write-Host "`nCorps de la requete:" -ForegroundColor Gray
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

