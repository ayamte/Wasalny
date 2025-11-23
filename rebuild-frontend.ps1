# Script pour nettoyer et redémarrer le frontend sans cache

Write-Host "=== Nettoyage du cache frontend ===" -ForegroundColor Cyan

# Aller dans le dossier frontend
Set-Location -Path "frontend"

# 1. Nettoyer le cache npm
Write-Host "`n[1/5] Nettoyage du cache npm..." -ForegroundColor Yellow
npm cache clean --force

# 2. Supprimer les dossiers de cache Vite
Write-Host "`n[2/5] Suppression du cache Vite..." -ForegroundColor Yellow
Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".vite" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Supprimer node_modules (optionnel mais recommandé)
$cleanAll = Read-Host "`n[3/5] Voulez-vous aussi supprimer node_modules? (o/N)"
if ($cleanAll -eq "o" -or $cleanAll -eq "O") {
    Write-Host "Suppression de node_modules..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

    Write-Host "`n[4/5] Réinstallation des dépendances..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "`n[4/5] Conservation de node_modules (ignoré)" -ForegroundColor Gray
}

# 4. Démarrer le serveur de développement
Write-Host "`n[5/5] Démarrage du serveur de développement..." -ForegroundColor Yellow
Write-Host "`nLe serveur va démarrer. Appuyez sur Ctrl+C pour arrêter." -ForegroundColor Green
Write-Host "Puis ouvrez http://localhost:3000 dans votre navigateur`n" -ForegroundColor Green

npm run dev
