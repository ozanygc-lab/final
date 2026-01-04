# 🏗️ Architecture - AI Story Forge (Site Unifié)

## Vue d'ensemble

AI Story Forge est un **site web fullstack unifié** combinant frontend et backend dans un seul repository. Le frontend communique automatiquement avec le backend via un proxy Vite transparent.

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Story Forge                           │
│                   (Site Complet)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
        ┌───────▼──────┐        ┌──────▼──────┐
        │   Frontend   │        │   Backend   │
        │    (React)   │◄──────►│  (Express)  │
        │ Port: 8080   │  API   │ Port: 3001  │
        └──────────────┘        └─────┬───────┘
                                      │
                                ┌─────▼──────┐
                                │ PostgreSQL │
                                │ Port: 5432 │
                                └────────────┘
```

## Flux de Communication

1. **Utilisateur** → accède à http://localhost:8080
2. **Frontend React** → affiche l'interface
3. **Action utilisateur** → déclenche un appel API
4. **Proxy Vite** → redirige `/api/*` vers `http://localhost:3001/api/*`
5. **Backend Express** → traite la requête
6. **PostgreSQL** → stocke/récupère les données
7. **Backend** → renvoie la réponse
8. **Frontend** → affiche le résultat

## Structure du Projet Unifié

```
ai-story-forge/
│
├── 📁 src/                      # Frontend React
│   ├── components/             # Composants UI
│   ├── pages/                  # Pages de l'application
│   ├── lib/
│   │   ├── api.ts             # ⭐ Client API (communication backend)
│   │   ├── auth.ts            # ⭐ Gestion authentification
│   │   └── utils.ts           # Utilitaires
│   └── main.tsx               # Point d'entrée frontend
│
├── 📁 server/                   # Backend Express
│   ├── src/
│   │   ├── routes/            # Routes API
│   │   ├── controllers/       # Logique métier
│   │   ├── services/          # Services (AI, Email, Stripe)
│   │   ├── middleware/        # Middleware (Auth, Errors)
│   │   └── server.ts          # Point d'entrée backend
│   └── prisma/
│       └── schema.prisma      # Schéma de la base de données
│
├── 📄 vite.config.ts           # ⭐ Configuration avec PROXY
├── 📄 package.json             # ⭐ Scripts de démarrage unifiés
├── 📄 start.sh                 # ⭐ Script de démarrage Linux/Mac
├── 📄 start.bat                # ⭐ Script de démarrage Windows
└── 📄 .env                     # Variables d'environnement frontend
```

## Configuration Clé : Le Proxy Vite

**Fichier : `vite.config.ts`**

```typescript
export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**Ce que fait le proxy :**
- Requête frontend : `fetch('/api/ebooks')`
- Automatiquement redirigée vers : `http://localhost:3001/api/ebooks`
- **Aucune configuration CORS complexe nécessaire !**

## Service API Client

**Fichier : `src/lib/api.ts`**

```typescript
const API_URL = '/api'; // Utilise le proxy Vite

class ApiClient {
  async createEbook(data, token) {
    return fetch('/api/ebooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
}
```

**Avantages :**
- ✅ Code propre et centralisé
- ✅ Gestion automatique des tokens
- ✅ Type-safe avec TypeScript
- ✅ Facile à maintenir

## Démarrage Unifié

### Méthode 1 : Script Shell (Recommandé)

```bash
./start.sh  # Linux/Mac
start.bat   # Windows
```

**Ce qu'il fait :**
1. Vérifie Node.js
2. Installe les dépendances si nécessaire
3. Génère Prisma si nécessaire
4. Lance backend ET frontend ensemble
5. Affiche les URLs

### Méthode 2 : npm run dev

```bash
npm run dev
```

**Utilise `concurrently` pour lancer :**
- Frontend (Vite) sur port 8080
- Backend (Express) sur port 3001
- Avec préfixes colorés dans les logs

### Méthode 3 : Séparément

```bash
# Terminal 1
npm run dev:frontend

# Terminal 2
npm run dev:backend
```

## Authentification Unifiée

**Backend génère le JWT :**

```typescript
// server/src/controllers/auth.controller.ts
const token = jwt.sign({ userId, email }, JWT_SECRET);
res.json({ token, user });
```

**Frontend stocke et utilise le token :**

```typescript
// src/lib/auth.ts
authStorage.setToken(token);
authStorage.setUser(user);

// src/lib/api.ts
headers.Authorization = `Bearer ${token}`;
```

## Base de Données

**PostgreSQL avec Prisma ORM**

```bash
# Créer/Mettre à jour les tables
npm run db:migrate

# Interface visuelle
npm run db:studio

# Générer le client
npm run db:generate
```

**Modèles :**
- User (utilisateurs)
- Ebook (ebooks)
- MagicLink (authentification)
- Activity (activités)
- Payment (paiements)

## Services Intégrés

### 1. OpenAI (Génération de contenu)
```typescript
// server/src/services/ai.service.ts
const content = await generateEbookContent({
  topic, chapters, audience, tone
});
```

### 2. Stripe (Paiements)
```typescript
// server/src/services/stripe.service.ts
const session = await createCheckoutSession(userId, priceId);
```

### 3. Nodemailer (Emails)
```typescript
// server/src/services/email.service.ts
await sendMagicLink(email, token);
```

## Sécurité

- **Helmet** : Headers HTTP sécurisés
- **Rate Limiting** : Protection contre les abus
- **JWT** : Authentification stateless
- **Zod** : Validation des données
- **CORS** : Configuré via proxy Vite
- **.env** : Variables sensibles protégées

## Flux d'Utilisation Complet

### 1. Connexion

```
User → /login
  ↓
Frontend → POST /api/auth/magic-link (email)
  ↓
Backend → sendMagicLink()
  ↓
Email sent with token
  ↓
User clicks link → /auth/callback?token=xxx
  ↓
Frontend → POST /api/auth/verify (token)
  ↓
Backend → JWT token
  ↓
Frontend → authStorage.setToken()
  ↓
Redirect to /dashboard
```

### 2. Création d'Ebook

```
User → /dashboard/generate
  ↓
Fills 3-step form (topic, audience, tone)
  ↓
Frontend → POST /api/ebooks (data + token)
  ↓
Backend → generateEbookContent() (OpenAI)
  ↓
Backend → Save to PostgreSQL
  ↓
Response → ebook object
  ↓
Frontend → Redirect to /dashboard/ebooks/:id
```

### 3. Paiement

```
User → /pricing
  ↓
Selects plan
  ↓
Frontend → POST /api/payments/subscription (priceId)
  ↓
Backend → createCheckoutSession() (Stripe)
  ↓
Response → checkout URL
  ↓
Frontend → Redirect to Stripe Checkout
  ↓
User pays
  ↓
Stripe → Webhook /api/payments/webhook
  ↓
Backend → Update user subscription
```

## Variables d'Environnement

### Frontend (.env)
```env
VITE_API_URL=/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_xxx
```

### Backend (server/.env)
```env
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-xxx
STRIPE_SECRET_KEY=sk_xxx
JWT_SECRET=xxx
SMTP_USER=xxx
SMTP_PASSWORD=xxx
```

## Build et Déploiement

### Build Local
```bash
npm run build
```

Crée :
- `dist/` : Frontend optimisé
- `server/dist/` : Backend compilé

### Déploiement Recommandé

**Frontend :**
- Vercel, Netlify, Cloudflare Pages
- Deploy le dossier `dist/`

**Backend :**
- Railway, Render, Heroku
- Deploy le dossier `server/`

**Database :**
- Supabase, Railway PostgreSQL, Render PostgreSQL

## Performance

- **Frontend :** Vite = build ultra-rapide
- **Backend :** Express = léger et rapide
- **Database :** PostgreSQL + Prisma = queries optimisées
- **Proxy :** Vite proxy = 0 latence en dev

## Scalabilité

Le site est conçu pour évoluer :
- Frontend et backend peuvent être déployés séparément
- Database peut être mise à l'échelle indépendamment
- Services (OpenAI, Stripe) gérés par des providers

## Conclusion

**AI Story Forge est un site fullstack UNIFIÉ** où :
- ✅ Frontend et backend travaillent ensemble
- ✅ Une seule commande pour tout lancer
- ✅ Communication transparente via proxy
- ✅ Code organisé et maintenable
- ✅ Prêt pour la production

**C'est vraiment UN SEUL SITE !** 🚀
