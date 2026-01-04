# Guide de dépannage - Authentification

## Problème : La connexion ne fonctionne pas

### 1. Vérifier la configuration Supabase

Dans votre dashboard Supabase :
1. Allez dans **Authentication** > **Settings**
2. Désactivez **"Enable email confirmations"** si vous voulez permettre la connexion immédiate après inscription
3. Ou gardez-le activé et vérifiez votre email après inscription

### 2. Créer un compte

Si vous n'avez pas encore de compte :
1. Allez sur `/signup`
2. Entrez votre email et un mot de passe (min. 6 caractères)
3. Cliquez sur "Créer mon compte"
4. Si Supabase nécessite une confirmation d'email, vérifiez votre boîte de réception
5. Cliquez sur le lien de confirmation
6. Revenez sur `/login` et connectez-vous

### 3. Vérifier les variables d'environnement

Assurez-vous que votre `.env.local` contient :
```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon
```

### 4. Vérifier la console du navigateur

Ouvrez la console (F12) et regardez les erreurs :
- Erreurs 400 : Identifiants incorrects ou compte inexistant
- Erreurs 403 : Problème de permissions (peut être ignoré si c'est pour `subscriptions`)
- Erreurs 500 : Problème serveur

### 5. Tester avec un nouveau compte

1. Créez un nouveau compte avec un email différent
2. Si la confirmation d'email est requise, vérifiez votre email
3. Connectez-vous avec ce nouveau compte

## Solution rapide

Si vous voulez tester rapidement sans confirmation d'email :
1. Dans Supabase Dashboard > Authentication > Settings
2. Désactivez "Enable email confirmations"
3. Créez un nouveau compte
4. Connectez-vous immédiatement













