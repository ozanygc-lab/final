# 🚀 AI Story Forge - Plateforme de Création d'Ebooks avec IA

Une plateforme complète et commercialisable pour créer, éditer et vendre des ebooks générés par l'intelligence artificielle.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Fonctionnalités

### 🎨 Frontend
- **Interface moderne** : React + TypeScript + Vite + Tailwind CSS
- **Composants UI professionnels** : shadcn/ui + Radix UI
- **Authentification sécurisée** : Magic link (sans mot de passe)
- **Dashboard complet** : Statistiques, ebooks, revenus
- **Générateur intelligent** : Interface en 3 étapes pour créer des ebooks
- **Éditeur puissant** : Markdown avec preview en temps réel
- **Chat avec l'IA** : Interface conversationnelle pour l'assistance
- **Gestion des quotas** : Système de limites mensuelles
- **Pages produit** : Pour afficher et vendre vos ebooks

### ⚙️ Backend
- **API RESTful** : Express + TypeScript
- **Base de données** : PostgreSQL avec Prisma ORM
- **IA avancée** : OpenAI GPT-4 pour la génération de contenu
- **Authentification** : JWT + Magic Links
- **Paiements** : Stripe pour les abonnements et achats
- **Email** : Nodemailer pour les notifications
- **Sécurité** : Helmet, rate limiting, validation Zod
- **Logs** : Winston pour le monitoring

## 📁 Structure du Projet

```
ai-story-forge/
├── src/                          # Frontend React
│   ├── components/              # Composants React
│   │   ├── ui/                  # Composants UI (shadcn)
│   │   ├── BentoGrid.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── ...
│   ├── pages/                   # Pages de l'application
│   │   ├── Dashboard.tsx
│   │   ├── Generate.tsx
│   │   ├── EbookEditor.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── hooks/                   # React hooks
│   ├── lib/                     # Utilitaires
│   └── main.tsx                 # Point d'entrée
│
├── server/                       # Backend Node.js
│   ├── src/
│   │   ├── routes/              # Routes API
│   │   │   ├── auth.routes.ts
│   │   │   ├── ebook.routes.ts
│   │   │   ├── ai.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── controllers/         # Contrôleurs
│   │   ├── services/            # Services (AI, Email, Stripe)
│   │   ├── middleware/          # Middleware (Auth, Errors)
│   │   ├── models/              # Modèles Prisma
│   │   ├── config/              # Configuration
│   │   └── server.ts            # Point d'entrée serveur
│   ├── prisma/
│   │   └── schema.prisma        # Schéma de base de données
│   └── package.json
│
├── public/                       # Assets statiques
├── package.json                  # Dépendances frontend
└── README.md
```

## 🚀 Installation

### Prérequis

- Node.js 18+ et npm
- PostgreSQL 14+
- Compte OpenAI (pour l'API GPT-4)
- Compte Stripe (pour les paiements)
- Compte email SMTP (Gmail recommandé)

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/ozanygc-lab/final.git
cd final
```

### Étape 2 : Installer les dépendances

```bash
# Installer toutes les dépendances (frontend + backend)
npm run install:all

# Ou manuellement :
npm install
cd server && npm install
```

### Étape 3 : Configuration de l'environnement

#### Backend (`server/.env`)

Copiez le fichier `.env.example` et configurez vos clés :

```bash
cd server
cp .env.example .env
```

Modifiez `server/.env` avec vos informations :

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ai_story_forge?schema=public"

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-secret

# Email (Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend (`.env`)

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
```

### Étape 4 : Base de données

```bash
cd server

# Générer le client Prisma
npx prisma generate

# Créer et migrer la base de données
npx prisma migrate dev --name init

# Optionnel : Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### Étape 5 : Lancer l'application

#### En mode développement (recommandé)

```bash
# Depuis la racine du projet
npm run dev
```

Cela lance :
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:3001

#### Ou séparément :

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

## 📦 Commandes disponibles

```bash
# Développement
npm run dev                    # Lance frontend + backend
npm run dev:frontend          # Lance uniquement le frontend
npm run dev:backend           # Lance uniquement le backend

# Build
npm run build                 # Build frontend + backend
npm run build:frontend        # Build frontend
npm run build:backend         # Build backend

# Installation
npm run install:all           # Installe toutes les dépendances
npm run setup                 # Installation + génération Prisma

# Base de données
cd server
npm run migrate               # Créer une migration
npm run prisma:generate       # Générer le client Prisma
npm run prisma:studio         # Ouvrir Prisma Studio

# Autres
npm run lint                  # Lint du code
npm run preview               # Preview du build frontend
```

## 🎯 API Endpoints

### Authentification
- `POST /api/auth/magic-link` - Envoyer un magic link
- `POST /api/auth/verify` - Vérifier le magic link
- `GET /api/auth/me` - Obtenir l'utilisateur courant

### Ebooks
- `POST /api/ebooks` - Créer un ebook (avec génération IA)
- `GET /api/ebooks` - Liste des ebooks de l'utilisateur
- `GET /api/ebooks/:id` - Obtenir un ebook
- `PUT /api/ebooks/:id` - Mettre à jour un ebook
- `DELETE /api/ebooks/:id` - Supprimer un ebook
- `POST /api/ebooks/:id/publish` - Publier un ebook
- `GET /api/ebooks/public/:slug` - Obtenir un ebook public

### IA
- `POST /api/ai/chat` - Chat avec l'IA
- `POST /api/ai/improve` - Améliorer du contenu

### Utilisateur
- `GET /api/users/dashboard` - Statistiques du dashboard
- `PUT /api/users/profile` - Mettre à jour le profil

### Paiements
- `POST /api/payments/subscription` - Créer un abonnement
- `POST /api/payments/ebook` - Acheter un ebook
- `POST /api/payments/webhook` - Webhook Stripe

## 🔐 Configuration de la sécurité

### Configuration Gmail pour les Magic Links

1. Activez la validation en 2 étapes sur votre compte Google
2. Générez un mot de passe d'application :
   - Google Account → Sécurité → Validation en 2 étapes → Mots de passe des applications
3. Utilisez ce mot de passe dans `SMTP_PASSWORD`

### Configuration Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. En mode test, récupérez vos clés dans le Dashboard
3. Configurez le webhook pour `/api/payments/webhook`
4. Événements à écouter :
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### Configuration OpenAI

1. Créez un compte sur [OpenAI](https://platform.openai.com)
2. Générez une clé API
3. Ajoutez du crédit à votre compte
4. Le modèle utilisé est `gpt-4-turbo-preview`

## 🎨 Technologies utilisées

### Frontend
- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI de haute qualité
- **Radix UI** - Primitives d'accessibilité
- **React Router** - Routing
- **TanStack Query** - Gestion d'état serveur
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas
- **Lucide React** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **Prisma** - ORM moderne
- **PostgreSQL** - Base de données
- **OpenAI** - API d'intelligence artificielle
- **Stripe** - Plateforme de paiement
- **Nodemailer** - Envoi d'emails
- **JWT** - Authentification par tokens
- **Helmet** - Sécurité HTTP
- **Winston** - Logging

## 📊 Modèle de base de données

```prisma
User
  - id, email, name
  - subscriptionTier (free/pro/enterprise)
  - monthlyEdits, maxMonthlyEdits
  - ebooks[]

Ebook
  - id, title, subtitle, slug
  - topic, chapters, audience, tone
  - content (JSON)
  - status (draft/published)
  - views, sales, revenue
  - user

MagicLink
  - token, email, expiresAt
  - used, user

Activity
  - type, description
  - ebook

Payment
  - stripePaymentId, amount
  - status, customer
```

## 🚢 Déploiement en production

### Frontend (Vercel/Netlify)

```bash
npm run build:frontend
# Le dossier dist/ contient les fichiers statiques
```

### Backend (Heroku/Railway/Render)

```bash
cd server
npm run build
# Configurer les variables d'environnement
# Lancer avec : npm start
```

### Base de données

- Utilisez un service géré : Supabase, Railway, Render PostgreSQL
- N'oubliez pas de mettre à jour `DATABASE_URL`

## 🔧 Configuration pour la commercialisation

### 1. Plans tarifaires

Modifiez les limites dans `server/prisma/schema.prisma` :

```prisma
enum SubscriptionTier {
  free      // 50 éditions/mois
  pro       // 200 éditions/mois
  enterprise // Illimité
}
```

### 2. Prix Stripe

Créez des produits dans le Dashboard Stripe et utilisez les `priceId`.

### 3. Branding

- Modifiez les couleurs dans `tailwind.config.ts`
- Changez le logo et les favicons dans `/public`
- Personnalisez les emails dans `server/src/services/email.service.ts`

## 📝 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📧 Support

Pour toute question ou support, contactez : support@ai-story-forge.com

---

**Fait avec ❤️ par ozanygc-lab**
