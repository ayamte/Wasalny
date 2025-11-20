# 🚀 QUICK START GUIDE - Configuration Horaire Wasalny (Windows PowerShell)
# ===========================================================================
#
# Ce guide vous aidera à intégrer et tester rapidement
# la page de Configuration Horaire dans votre projet.
#

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "🚀 Configuration Horaire - Quick Start Guide" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# 1. VÉRIFICATION DE L'ENVIRONNEMENT
# ============================================

Write-Host "🔍 Vérification de l'environnement..." -ForegroundColor Yellow
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green
}
catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez installer Node.js v16+" -ForegroundColor Red
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm v$npmVersion détecté" -ForegroundColor Green
}
catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ $dockerVersion détecté" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Docker n'est pas installé (optionnel mais recommandé)" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# 2. NAVIGATION ET INSTALLATION
# ============================================

Write-Host "📂 Navigation vers le dossier frontend..." -ForegroundColor Yellow

$frontendPath = Join-Path (Get-Location) "frontend"

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Le dossier 'frontend' n'a pas été trouvé!" -ForegroundColor Red
    Write-Host "   Assurez-vous de lancer ce script depuis la racine du projet (wasalny/)" -ForegroundColor Red
    exit 1
}

Set-Location $frontendPath
Write-Host "✅ Localisation: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# ============================================
# 3. INSTALLATION DES DÉPENDANCES
# ============================================

Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow

if (-not (Test-Path "node_modules")) {
    Write-Host "   Exécution de 'npm install'..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ Dépendances déjà présentes" -ForegroundColor Green
}

Write-Host ""

# ============================================
# 4. VÉRIFICATION DES FICHIERS CRÉÉS
# ============================================

Write-Host "📂 Vérification des fichiers créés..." -ForegroundColor Yellow
Write-Host ""

$filesToCheck = @(
    "src/services/trajet/pages/configuration/configuration.jsx",
    "src/services/trajet/pages/configuration/configuration.css",
    "src/services/trajet/configurationService.js",
    "src/services/trajet/API_ENDPOINTS.js",
    "src/services/trajet/index.js",
    "src/services/trajet/CONFIGURATION_README.md",
    "src/services/trajet/INTEGRATION_SUMMARY.md"
)

$allFilesExist = $true

foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $file MANQUANT" -ForegroundColor Red
        $allFilesExist = $false
    }
}

Write-Host ""

if (-not $allFilesExist) {
    Write-Host "⚠️  Certains fichiers sont manquants. Vérifiez la création des fichiers." -ForegroundColor Yellow
}

# ============================================
# 5. LANCEMENT DU SERVEUR DE DÉVELOPPEMENT
# ============================================

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "🚀 LANCEMENT DU SERVEUR" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Configuration: http://localhost:5173/admin/configuration" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pour arrêter le serveur, appuyez sur Ctrl+C" -ForegroundColor Yellow
Write-Host ""

Write-Host "Lancement du serveur Vite..." -ForegroundColor Cyan
npm run dev

# ============================================
# 6. APRÈS LE LANCEMENT
# ============================================

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host "📋 CHECKLIST APRÈS LE DÉMARRAGE" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Backend (Trajet Service):" -ForegroundColor Cyan
Write-Host "  ☐ Trajet Service en cours d'exécution (port 8081)" -ForegroundColor White
Write-Host "  ☐ Base de données PostgreSQL connectée" -ForegroundColor White
Write-Host "  ☐ Eureka Server actif (port 8761)" -ForegroundColor White
Write-Host ""

Write-Host "Frontend:" -ForegroundColor Cyan
Write-Host "  ☐ Page accessible à http://localhost:5173/admin/configuration" -ForegroundColor White
Write-Host "  ☐ Pas d'erreurs dans la console (F12)" -ForegroundColor White
Write-Host "  ☐ Les styles CSS s'appliquent correctement" -ForegroundColor White
Write-Host ""

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "  ☐ Token JWT stocké dans localStorage" -ForegroundColor White
Write-Host "  ☐ Utilisateur connecté avec rôle ADMIN" -ForegroundColor White
Write-Host "  ☐ API_BASE_URL correctement configurée" -ForegroundColor White
Write-Host ""

# ============================================
# 7. DÉPANNAGE
# ============================================

Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host "🔧 DÉPANNAGE" -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Si vous rencontrez des problèmes:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. Port 5173 déjà utilisé:" -ForegroundColor Cyan
Write-Host "   npm run dev -- --port 5174" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Erreur de dépendances:" -ForegroundColor Cyan
Write-Host "   del node_modules" -ForegroundColor Gray
Write-Host "   del package-lock.json" -ForegroundColor Gray
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Erreur CORS depuis le backend:" -ForegroundColor Cyan
Write-Host "   Vérifier CORS dans trajet-service/application.yml" -ForegroundColor Gray
Write-Host ""

Write-Host "4. Token JWT invalide:" -ForegroundColor Cyan
Write-Host "   Se reconnecter via /login" -ForegroundColor Gray
Write-Host "   Vérifier JWT_SECRET dans backend" -ForegroundColor Gray
Write-Host ""

Write-Host "5. Styles CSS manquants:" -ForegroundColor Cyan
Write-Host "   Vider le cache: Ctrl+Shift+Delete" -ForegroundColor Gray
Write-Host "   Recharger la page: F5" -ForegroundColor Gray
Write-Host ""

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Pour plus d'aide, consultez:" -ForegroundColor Cyan
Write-Host "  • src/services/trajet/CONFIGURATION_README.md" -ForegroundColor White
Write-Host "  • src/services/trajet/INTEGRATION_SUMMARY.md" -ForegroundColor White
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""
