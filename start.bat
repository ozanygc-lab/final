@echo off
REM Script de démarrage pour AI Story Forge (Windows)
REM Lance le frontend et le backend ensemble

echo.
echo ========================================
echo   AI Story Forge - Demarrage
echo ========================================
echo.

REM Vérifier Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js n'est pas installe
    echo Installez Node.js depuis https://nodejs.org
    pause
    exit /b 1
)

echo [OK] Node.js installe
node -v

REM Vérifier les dépendances frontend
if not exist "node_modules\" (
    echo.
    echo Installation des dependances frontend...
    call npm install
)

REM Vérifier les dépendances backend
if not exist "server\node_modules\" (
    echo.
    echo Installation des dependances backend...
    cd server
    call npm install
    cd ..
)

REM Vérifier Prisma
if not exist "server\node_modules\.prisma\" (
    echo.
    echo Generation du client Prisma...
    cd server
    call npx prisma generate
    cd ..
)

REM Vérifier .env
if not exist "server\.env" (
    echo.
    echo [ATTENTION] Fichier server\.env manquant
    echo Copie de .env.example vers .env...
    copy server\.env.example server\.env
    echo [IMPORTANT] Configurez vos cles API dans server\.env
    echo.
)

echo.
echo ========================================
echo   Demarrage du site...
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:3001
echo API:      http://localhost:3001/health
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.
echo ========================================
echo.

REM Lancer le backend dans une nouvelle fenêtre
start "AI Story Forge - Backend" cmd /k "cd server && npm run dev"

REM Attendre un peu que le backend démarre
timeout /t 3 /nobreak >nul

REM Lancer le frontend dans une nouvelle fenêtre
start "AI Story Forge - Frontend" cmd /k "npm run dev:frontend"

echo.
echo [OK] Les serveurs sont lances dans des fenetres separees
echo Fermez les fenetres pour arreter les serveurs
echo.
pause
