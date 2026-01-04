# 🚀 AI Story Forge - Démarrage Simplifié

## ⚡ Démarrage Ultra-Rapide

### 1️⃣ Installation (une seule fois)

```bash
# Installer TOUTES les dépendances (frontend + backend)
npm run install:all

# Générer la base de données Prisma
npm run db:generate
```

### 2️⃣ Configuration (une seule fois)

Éditez le fichier `server/.env` et ajoutez vos clés API :

```env
# Database PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ai_story_forge"

# OpenAI (OBLIGATOIRE)
OPENAI_API_KEY=sk-votre-clé-ici

# Stripe (pour les paiements)
STRIPE_SECRET_KEY=sk_test_votre-clé
STRIPE_PUBLISHABLE_KEY=pk_test_votre-clé

# Email Gmail (pour les magic links)
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
```

### 3️⃣ Créer la base de données (une seule fois)

```bash
# Sur Ubuntu/Debian
sudo apt install postgresql
sudo -u postgres psql
CREATE DATABASE ai_story_forge;
\q

# Migrer la base de données
npm run db:migrate
```

### 4️⃣ Lancer le site (à chaque fois)

**Option A - Script automatique (recommandé) :**

```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

**Option B - Commande npm :**

```bash
npm run dev
```

**Option C - Séparément :**

```bash
# Terminal 1
npm run dev:frontend

# Terminal 2
npm run dev:backend
```

### 5️⃣ Accéder au site

- **Frontend :** http://localhost:8080
- **Backend API :** http://localhost:3001
- **Health Check :** http://localhost:3001/health

---

## 🎯 Tout en Une Commande

Si PostgreSQL est déjà installé et configuré :

```bash
# Installation complète
npm run setup

# Configuration
nano server/.env  # Ajoutez vos clés API

# Migration DB
npm run db:migrate

# Lancement
npm run dev
```

C'est tout ! 🎉

---

## 📋 Commandes Disponibles

```bash
# Démarrage
npm start              # Lance avec le script shell (Linux/Mac)
npm run start:windows  # Lance avec le script batch (Windows)
npm run dev            # Lance frontend + backend (avec couleurs)

# Installation
npm run install:all    # Installe frontend + backend
npm run setup          # Installation + génération Prisma

# Base de données
npm run db:migrate     # Créer/mettre à jour les tables
npm run db:studio      # Interface visuelle de la DB
npm run db:generate    # Générer le client Prisma

# Build
npm run build          # Build frontend + backend
npm run build:frontend # Build frontend seul
npm run build:backend  # Build backend seul
```

---

## 🔑 Obtenir les Clés API

### OpenAI (Obligatoire)
1. https://platform.openai.com → API Keys
2. Create new secret key
3. Copiez dans `OPENAI_API_KEY`

### Stripe (Paiements)
1. https://stripe.com → Developers → API keys
2. Copiez Secret key et Publishable key

### Gmail (Magic Links)
1. https://myaccount.google.com/security
2. Validation en 2 étapes → Mots de passe des applications
3. Créez un mot de passe pour "Mail"

---

## 🐛 Problèmes Courants

**Port déjà utilisé :**
```bash
lsof -i :8080  # Trouve le processus
kill -9 <PID>  # Tue le processus
```

**Erreur base de données :**
```bash
# Vérifiez que PostgreSQL tourne
sudo systemctl status postgresql

# Vérifiez DATABASE_URL dans server/.env
```

**Erreur OpenAI :**
- Vérifiez que la clé commence par `sk-`
- Vérifiez que vous avez du crédit sur votre compte

---

## 📚 Documentation Complète

Consultez [README.md](./README.md) pour la documentation détaillée.

## 🎯 Architecture

```
Site Unifié AI Story Forge
├── Frontend (React) → http://localhost:8080
├── Backend (Express) → http://localhost:3001
└── Database (PostgreSQL) → localhost:5432
```

Le frontend communique automatiquement avec le backend via proxy Vite.

**Tout fonctionne comme UN SEUL SITE !** 🚀
