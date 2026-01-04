# 🚀 Comment Lancer AI Story Forge - UNE SEULE COMMANDE

## ⚡ Méthode Ultra-Simple

### 1️⃣ Configuration initiale (UNE SEULE FOIS)

```bash
# Tout installer d'un coup
npm run setup
```

Cette commande fait TOUT :
- ✅ Installe les dépendances frontend
- ✅ Installe les dépendances backend
- ✅ Génère le client Prisma

### 2️⃣ Configurer PostgreSQL (UNE SEULE FOIS)

```bash
# Installer PostgreSQL
sudo apt install postgresql  # Linux
brew install postgresql@14   # Mac

# Créer la base de données
sudo -u postgres psql -c "CREATE DATABASE ai_story_forge;"
```

### 3️⃣ Configurer les clés API (UNE SEULE FOIS)

Éditez `server/.env` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ai_story_forge"
OPENAI_API_KEY=sk-votre-clé
STRIPE_SECRET_KEY=sk_test_votre-clé
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
```

### 4️⃣ Créer les tables (UNE SEULE FOIS)

```bash
cd server && npx prisma migrate dev --name init
```

---

## 🎯 LANCER LE SITE - UNE SEULE COMMANDE

```bash
npm start
```

**OU**

```bash
npm run dev
```

**C'est tout !** 🎉

Cette commande lance :
- ✅ Le backend (Express) sur port 3001
- ✅ Le frontend (React) sur port 8080
- ✅ Les deux en même temps
- ✅ Avec des logs colorés pour distinguer frontend/backend

---

## 📺 Ce que vous verrez

```
┌──────────────────────────────────────────────┐
│  AI Story Forge - Démarrage                 │
└──────────────────────────────────────────────┘

[BACKEND]  🚀 Server running on port 3001
[BACKEND]  📝 Environment: development
[BACKEND]  ✅ Database connected

[FRONTEND] ➜  Local:   http://localhost:8080/
[FRONTEND] ➜  Network: use --host to expose
```

---

## 🌐 Accéder au site

Ouvrez votre navigateur :

👉 **http://localhost:8080**

Le frontend communique automatiquement avec le backend via le proxy Vite !

---

## 🛑 Arrêter le site

Appuyez sur **Ctrl+C** dans le terminal

---

## 🔧 Commandes Utiles

```bash
# Lancer le site (une seule commande)
npm start                # ou npm run dev

# Setup initial complet
npm run setup            # Installe tout + Prisma

# Base de données
cd server
npx prisma migrate dev   # Créer/mettre à jour les tables
npx prisma studio        # Interface visuelle de la DB

# Build pour production
npm run build            # Build frontend + backend
```

---

## ❓ Problèmes courants

### "Port 8080 déjà utilisé"

```bash
# Trouver et tuer le processus
lsof -i :8080
kill -9 <PID>
```

### "Cannot connect to database"

```bash
# Vérifier PostgreSQL
sudo systemctl status postgresql  # Linux
brew services list               # Mac

# Vérifier DATABASE_URL dans server/.env
```

### "Prisma client not generated"

```bash
cd server
npx prisma generate
```

---

## 🎯 Récapitulatif

**Setup (une seule fois) :**
```bash
npm run setup
# Configurer server/.env
cd server && npx prisma migrate dev --name init
```

**Lancer (à chaque fois) :**
```bash
npm start
```

**Accéder :**
```
http://localhost:8080
```

---

## 🚀 C'est vraiment UN SEUL SITE !

- ✅ **Une seule commande** pour tout lancer
- ✅ **Frontend + Backend** communiquent automatiquement
- ✅ **Proxy transparent** entre les deux
- ✅ **Logs unifiés** dans un seul terminal
- ✅ **Arrêt simple** avec Ctrl+C

**Pas besoin de lancer frontend et backend séparément !**

---

*Fait avec ❤️ pour simplifier votre vie*
