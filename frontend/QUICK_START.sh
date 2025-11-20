#!/bin/bash
# 🚀 QUICK START GUIDE - Configuration Horaire Wasalny
# =====================================================
# 
# Ce guide vous aidera à intégrer et tester rapidement
# la page de Configuration Horaire dans votre projet.
#

# ============================================
# 1. VÉRIFICATION DE L'ENVIRONNEMENT
# ============================================

echo "🔍 Vérification de l'environnement..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js v16+"
    exit 1
fi
echo "✅ Node.js $(node --version) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi
echo "✅ npm $(npm --version) détecté"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker n'est pas installé (optionnel mais recommandé)"
else
    echo "✅ Docker $(docker --version) détecté"
fi

# ============================================
# 2. INSTALLATION DES DÉPENDANCES
# ============================================

echo ""
echo "📦 Installation des dépendances..."

cd "frontend" || exit 1

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dépendances installées"
else
    echo "✅ Dépendances déjà présentes"
fi

# ============================================
# 3. VÉRIFICATION DES FICHIERS CRÉÉS
# ============================================

echo ""
echo "📂 Vérification des fichiers..."

FILES_TO_CHECK=(
    "src/services/trajet/pages/configuration/configuration.jsx"
    "src/services/trajet/pages/configuration/configuration.css"
    "src/services/trajet/configurationService.js"
    "src/services/trajet/API_ENDPOINTS.js"
    "src/services/trajet/index.js"
)

for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file MANQUANT"
    fi
done

# ============================================
# 4. LANCEMENT DU SERVEUR DE DÉVELOPPEMENT
# ============================================

echo ""
echo "🚀 Lancement du serveur Vite..."
echo "   Frontend: http://localhost:5173"
echo "   Admin Configuration: http://localhost:5173/admin/configuration"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

npm run dev

# ============================================
# 5. DÉPANNAGE
# ============================================

# Si le script s'arrête ici, utilisez:
# npm run dev
# # Ensuite visitez: http://localhost:5173/admin/configuration

