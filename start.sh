#!/bin/bash

# Script de démarrage pour AI Story Forge
# Lance le frontend et le backend ensemble

echo "🚀 Démarrage de AI Story Forge..."
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js depuis https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances frontend...${NC}"
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances backend...${NC}"
    cd server && npm install && cd ..
fi

# Vérifier si Prisma est configuré
if [ ! -d "server/node_modules/.prisma" ]; then
    echo -e "${YELLOW}🔧 Génération du client Prisma...${NC}"
    cd server && npx prisma generate && cd ..
fi

# Vérifier si le fichier .env existe
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}⚠️  Fichier server/.env manquant${NC}"
    echo "Copie de .env.example vers .env..."
    cp server/.env.example server/.env
    echo -e "${RED}⚠️  IMPORTANT: Configurez vos clés API dans server/.env${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 AI Story Forge est en cours de démarrage...${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Frontend:${NC} http://localhost:8080"
echo -e "${GREEN}Backend:${NC}  http://localhost:3001"
echo -e "${GREEN}API:${NC}      http://localhost:3001/health"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Fonction pour nettoyer les processus à l'arrêt
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arrêt de AI Story Forge...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Lancer le backend
cd server
npm run dev &
BACKEND_PID=$!
cd ..

# Attendre que le backend démarre
sleep 3

# Lancer le frontend
npm run dev:frontend &
FRONTEND_PID=$!

# Attendre que les processus se terminent
wait
