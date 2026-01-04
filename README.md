# Marketing Digital AI - Plateforme de création et vente d'ebooks

Application Next.js avec Supabase et Stripe pour créer, publier et vendre des ebooks.

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créer un fichier `.env.local` avec :
```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
STRIPE_SECRET_KEY=votre_cle_secrete_stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre_cle_publique_stripe
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

## 📊 Schéma de base de données Supabase

### Table `ebooks`
```sql
CREATE TABLE ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  slug TEXT UNIQUE,
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ebooks_user_id ON ebooks(user_id);
CREATE INDEX idx_ebooks_slug ON ebooks(slug);
```

### Table `chapters`
```sql
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chapters_ebook_id ON chapters(ebook_id);
```

### Table `ebook_assets`
```sql
CREATE TABLE ebook_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE UNIQUE,
  pdf_path TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ebook_assets_ebook_id ON ebook_assets(ebook_id);
```

### Table `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID REFERENCES ebooks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_ebook_id ON orders(ebook_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_stripe_session_id ON orders(stripe_session_id);
```

### Table `subscriptions`
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('basic', 'pro', 'enterprise')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'canceled', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_session_id ON subscriptions(stripe_session_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

## 🗄️ Configuration Supabase Storage

Créer un bucket nommé `ebooks` dans Supabase Storage avec les politiques suivantes :

### Politique d'upload (authentifié uniquement)
```sql
CREATE POLICY "Users can upload their own ebooks"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'ebooks' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### Politique de lecture (public pour les PDFs publiés)
```sql
CREATE POLICY "Public can read published ebooks"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'ebooks');
```

## 🔐 Row Level Security (RLS)

Activer RLS sur toutes les tables et ajouter les politiques :

### `ebooks`
```sql
ALTER TABLE ebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ebooks"
ON ebooks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ebooks"
ON ebooks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ebooks"
ON ebooks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Public can view published ebooks"
ON ebooks FOR SELECT
TO public
USING (status = 'published');
```

### `chapters`
```sql
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage chapters of their ebooks"
ON chapters FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM ebooks
    WHERE ebooks.id = chapters.ebook_id
    AND ebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Public can view chapters of published ebooks"
ON chapters FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM ebooks
    WHERE ebooks.id = chapters.ebook_id
    AND ebooks.status = 'published'
  )
);
```

### `ebook_assets`
```sql
ALTER TABLE ebook_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assets of their ebooks"
ON ebook_assets FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM ebooks
    WHERE ebooks.id = ebook_assets.ebook_id
    AND ebooks.user_id = auth.uid()
  )
);

CREATE POLICY "Public can view assets of published ebooks"
ON ebook_assets FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM ebooks
    WHERE ebooks.id = ebook_assets.ebook_id
    AND ebooks.status = 'published'
  )
);
```

### `orders`
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Page de connexion avec magic link
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts          # Route API Stripe Checkout
│   │   └── ebooks/
│   │       └── [id]/
│   │           └── publish/
│   │               └── route.ts  # Route API pour publier un ebook
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard principal
│   │   └── ebooks/
│   │       └── [id]/
│   │           ├── page.tsx      # Page éditeur d'ebook
│   │           └── EbookEditor.tsx
│   ├── p/
│   │   └── [slug]/
│   │       ├── page.tsx          # Page produit publique
│   │       └── BuyButton.tsx
│   ├── success/
│   │   └── page.tsx              # Page de succès après paiement
│   ├── layout.tsx
│   └── page.tsx                  # Page d'accueil
├── lib/
│   ├── pdf.tsx                   # Génération PDF avec @react-pdf/renderer
│   └── supabase/
│       ├── client.ts             # Client Supabase pour composants client
│       ├── server.ts             # Client Supabase pour serveur
│       └── middleware.ts         # Middleware pour sessions
└── middleware.ts                 # Middleware Next.js
```

## 🎯 Fonctionnalités

- ✅ Authentification par magic link (email)
- ✅ Dashboard pour gérer ses ebooks
- ✅ Éditeur d'ebook avec gestion des chapitres
- ✅ Génération automatique de PDF
- ✅ Publication d'ebooks
- ✅ Page produit publique avec slug unique
- ✅ Intégration Stripe Checkout
- ✅ Gestion des commandes

## 🔧 Technologies utilisées

- **Next.js 14** (App Router)
- **Supabase** (Base de données, Auth, Storage)
- **Stripe** (Paiements)
- **@react-pdf/renderer** (Génération PDF)
- **Tailwind CSS** (Styling)
- **TypeScript**

# marketing
# marketing
