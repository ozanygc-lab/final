# 🚀 Guide de Démarrage Rapide - AI Story Forge

## Résumé

Votre site **AI Story Forge** est maintenant complet avec :
- ✅ Frontend React + TypeScript
- ✅ Backend Express + PostgreSQL
- ✅ Tous les modules Node.js installés
- ✅ Code commité et pushé sur GitHub

## 📋 Prochaines étapes pour lancer le site

### 1. Configuration de la base de données PostgreSQL

Vous devez d'abord installer et configurer PostgreSQL :

```bash
# Sur Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Sur macOS avec Homebrew
brew install postgresql@14
brew services start postgresql@14

# Sur Windows
# Téléchargez depuis https://www.postgresql.org/download/windows/
```

Créez la base de données :

```bash
# Connectez-vous à PostgreSQL
sudo -u postgres psql

# Créez la base de données
CREATE DATABASE ai_story_forge;

# Créez un utilisateur (optionnel)
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE ai_story_forge TO your_username;

# Quittez
\q
```

### 2. Configuration des variables d'environnement

Modifiez le fichier `server/.env` :

```bash
cd server
nano .env  # ou utilisez votre éditeur préféré
```

**IMPORTANT** - Remplacez ces valeurs :

```env
# Database - Mettez vos vrais identifiants
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/ai_story_forge?schema=public"

# OpenAI - OBLIGATOIRE pour la génération d'ebooks
OPENAI_API_KEY=sk-votre-vraie-clé-openai

# Stripe - OBLIGATOIRE pour les paiements
STRIPE_SECRET_KEY=sk_test_votre-clé
STRIPE_PUBLISHABLE_KEY=pk_test_votre-clé

# Email - OBLIGATOIRE pour les magic links
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-application
```

### 3. Migration de la base de données

```bash
cd server

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate dev --name init

# Vérifier que tout fonctionne (optionnel)
npx prisma studio
```

### 4. Lancer l'application

Depuis la racine du projet :

```bash
# Lancer frontend + backend ensemble
npm run dev
```

Ou séparément dans deux terminaux :

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
cd server && npm run dev
```

### 5. Accéder au site

- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:3001
- **API Health** : http://localhost:3001/health

## 🔑 Obtenir les clés API

### OpenAI (OBLIGATOIRE)

1. Allez sur https://platform.openai.com
2. Créez un compte
3. Allez dans "API Keys"
4. Cliquez sur "Create new secret key"
5. Copiez la clé et mettez-la dans `OPENAI_API_KEY`
6. Ajoutez du crédit (minimum 5$) : https://platform.openai.com/account/billing

### Stripe (pour les paiements)

1. Créez un compte sur https://stripe.com
2. En mode Test, allez dans "Developers" → "API keys"
3. Copiez :
   - Secret key → `STRIPE_SECRET_KEY`
   - Publishable key → `STRIPE_PUBLISHABLE_KEY`

### Gmail (pour les magic links)

1. Allez sur https://myaccount.google.com/security
2. Activez la validation en 2 étapes
3. Allez dans "Mots de passe des applications"
4. Créez un nouveau mot de passe pour "Mail"
5. Utilisez ce mot de passe dans `SMTP_PASSWORD`

## 🎯 Tester le site

1. **Créer un compte** : Allez sur http://localhost:8080/login
2. **Magic link** : Vérifiez vos emails (si SMTP configuré)
3. **Dashboard** : Explorez les statistiques
4. **Générer un ebook** : Utilisez le générateur en 3 étapes
5. **Éditer** : Modifiez votre ebook dans l'éditeur

## 📊 Base de données - Prisma Studio

Pour visualiser et modifier les données :

```bash
cd server
npx prisma studio
```

Ouvre une interface web sur http://localhost:5555

## 🐛 Résolution des problèmes

### Erreur : "Cannot connect to database"

```bash
# Vérifiez que PostgreSQL est lancé
sudo systemctl status postgresql

# Ou sur macOS
brew services list

# Vérifiez la DATABASE_URL dans server/.env
```

### Erreur : "OpenAI API key invalid"

- Vérifiez que vous avez copié la clé complète (commence par `sk-`)
- Assurez-vous d'avoir du crédit sur votre compte OpenAI

### Erreur : "Cannot send email"

- Vérifiez vos identifiants SMTP
- Si vous utilisez Gmail, assurez-vous d'utiliser un "mot de passe d'application" et non votre mot de passe normal

### Port 3001 ou 8080 déjà utilisé

```bash
# Trouvez le processus
lsof -i :3001
lsof -i :8080

# Tuez le processus
kill -9 <PID>

# Ou changez le port dans .env et vite.config.ts
```

## 📦 Commandes utiles

```bash
# Installation
npm run install:all          # Installe tout

# Développement
npm run dev                   # Lance tout
npm run dev:frontend         # Frontend seul
npm run dev:backend          # Backend seul

# Build
npm run build                # Build tout
npm run build:frontend       # Build frontend
npm run build:backend        # Build backend

# Base de données
cd server
npm run migrate              # Nouvelle migration
npm run prisma:generate      # Génère le client
npm run prisma:studio        # Interface visuelle
```

## 🚢 Déploiement

Quand vous serez prêt pour la production :

1. **Frontend** : Déployez sur Vercel, Netlify ou Cloudflare Pages
2. **Backend** : Déployez sur Railway, Render ou Heroku
3. **Database** : Utilisez Supabase, Railway ou Render PostgreSQL

Voir le README.md principal pour plus de détails.

## 📚 Documentation complète

Lisez [README.md](./README.md) pour :
- Architecture détaillée
- API endpoints
- Configuration avancée
- Guide de commercialisation

## 💡 Support

Si vous avez des questions :
1. Consultez le README.md
2. Vérifiez les logs dans le terminal
3. Consultez la documentation des services (OpenAI, Stripe, etc.)

---

**Bon développement ! 🎉**
