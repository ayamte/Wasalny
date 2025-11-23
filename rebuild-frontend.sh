#!/bin/bash

# Script pour nettoyer et redémarrer le frontend sans cache

echo "=== Nettoyage du cache frontend ==="

# Aller dans le dossier frontend
cd frontend || exit

# 1. Nettoyer le cache npm
echo -e "\n[1/4] Nettoyage du cache npm..."
npm cache clean --force

# 2. Supprimer les dossiers de cache Vite
echo -e "\n[2/4] Suppression du cache Vite..."
rm -rf node_modules/.vite .vite dist

# 3. Vérifier node_modules
echo -e "\n[3/4] Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
    echo "Installation des dépendances..."
    npm install
else
    echo "node_modules existe déjà"
fi

# 4. Démarrer le serveur de développement
echo -e "\n[4/4] Démarrage du serveur de développement..."
echo -e "\nLe serveur va démarrer. Appuyez sur Ctrl+C pour arrêter."
echo -e "Puis ouvrez http://localhost:3000 dans votre navigateur\n"

npm run dev
