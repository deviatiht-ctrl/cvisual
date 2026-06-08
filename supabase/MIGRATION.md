# CVisual — Plan de Migration vers Supabase

## Vue d'ensemble
Remplacement complet du backend Python (Flask + SQLite/PostgreSQL sur Render)
par **Supabase** (PostgreSQL + Auth + Edge Functions).

Le frontend HTML/CSS/JS reste inchangé — seuls `public.js` et `admin.js`
seront mis à jour pour pointer vers Supabase.

---

## ÉTAPE 1 — Créer le projet Supabase

1. Aller sur [https://supabase.com](https://supabase.com) → **New Project**
2. Choisir un nom : `cvisual`
3. Choisir une région proche d'Haïti : **US East (N. Virginia)**
4. Définir un mot de passe de base de données fort (le sauvegarder)
5. Attendre la création (~2 min)
6. Dans **Settings → API**, copier :
   - `Project URL`  → `SUPABASE_URL`
   - `anon public`  → `SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ SECRET

---

## ÉTAPE 2 — Exécuter les schemas SQL

Dans **Supabase Dashboard → SQL Editor**, exécuter dans cet ordre :

```
1. supabase/sql/01_tables.sql   → Crée les 18 tables cvisual_*
2. supabase/sql/02_rls.sql      → Active RLS + policies publiques
3. supabase/sql/03_indexes.sql  → Index de performance
4. supabase/sql/04_seed.sql     → Données par défaut (templates, admin)
```

> Copier-coller chaque fichier dans le SQL Editor et cliquer **Run**.

---

## ÉTAPE 3 — Déployer l'Edge Function d'email

### Installer Supabase CLI (une seule fois)
```bash
npm install -g supabase
supabase login
```

### Lier le projet et déployer
```bash
supabase link --project-ref <TON_PROJECT_REF>
supabase functions deploy send-email --project-ref <TON_PROJECT_REF>
```

### Configurer les variables d'environnement de la fonction
Dans **Supabase Dashboard → Edge Functions → send-email → Secrets** :

| Variable              | Valeur                  |
|-----------------------|-------------------------|
| `CVISUAL_MAILER_KEY`  | Ta clé API Brevo        |

> `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont automatiquement
> injectés par Supabase — ne pas les ajouter manuellement.

---

## ÉTAPE 4 — Mettre à jour `assets/js/public.js`

Remplacer la constante `API_BASE` et les méthodes fetch par le client Supabase.

### Ajouter le script Supabase en haut de chaque page HTML publique
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
```

### Nouvelle configuration dans `public.js`
```javascript
const SUPABASE_URL      = 'https://XXXX.supabase.co';
const SUPABASE_ANON_KEY = 'eyJ...';  // clé anon publique (pas secret)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const EDGE_BASE = `${SUPABASE_URL}/functions/v1`;
```

### Mapping des méthodes (ancien → nouveau)

| Ancienne méthode          | Nouvelle logique Supabase                                          |
|---------------------------|--------------------------------------------------------------------|
| `fetchServices()`         | `supabase.from('cvisual_services').select('*').order('sort_order')`|
| `fetchPortfolio()`        | `supabase.from('cvisual_projects').select('*').order('sort_order')`|
| `fetchNews()`             | `supabase.from('cvisual_news').select('*').order('created_at', {ascending:false})`|
| `fetchClients()`          | `supabase.from('cvisual_clients').select('*').order('sort_order')` |
| `fetchBlog()`             | `supabase.from('cvisual_blog').select('*').eq('published',true).order('created_at',{ascending:false})`|
| `fetchTestimonials()`     | `supabase.from('cvisual_testimonials').select('*').order('sort_order')`|
| `fetchTeam()`             | `supabase.from('cvisual_team').select('*').order('sort_order')`    |
| `fetchStats()`            | Deux COUNT queries sur `cvisual_projects` et `cvisual_clients`     |
| `submitContact(data)`     | `supabase.from('cvisual_inquiries').insert({...})` + appel Edge Function email|
| `submitApplication(data)` | `supabase.from('cvisual_applications').insert({...})` + Edge Function email|
| `subscribeNewsletter(e)`  | `supabase.from('cvisual_newsletter').insert({email:e})`            |
| `getRecruitmentInfo()`    | `supabase.from('cvisual_recruitment_info').select('*').limit(1)`   |
| `getQuestions()`          | `supabase.from('cvisual_recruitment_questions').select('*').order('sort_order')`|

---

## ÉTAPE 5 — Mettre à jour `assets/js/admin.js`

### Nouvelle configuration dans `admin.js`
```javascript
const SUPABASE_URL           = 'https://XXXX.supabase.co';
const SUPABASE_ANON_KEY      = 'eyJ...';  // anon key
const SUPABASE_SERVICE_KEY   = 'eyJ...';  // ⚠️ SERVICE ROLE — ne pas exposer en prod !
const EDGE_BASE              = `${SUPABASE_URL}/functions/v1`;

// Client anon pour lecture
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Client service_role pour écriture admin
const supabaseAdmin = window.supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
```

> ⚠️ Pour la production, les opérations admin sensibles doivent passer
> par des Edge Functions qui gardent la service_role key côté serveur.
> Pour un site admin protégé par login, l'exposition dans le JS est
> acceptable si le dashboard est derrière Netlify/Vercel avec accès restreint.

### Mapping des routes admin (ancien endpoint → nouveau)

| Ancienne route API                        | Supabase équivalent                                               |
|-------------------------------------------|-------------------------------------------------------------------|
| `POST /admin/services`                    | `supabaseAdmin.from('cvisual_services').insert({...})`           |
| `PUT /admin/services/:id`                 | `supabaseAdmin.from('cvisual_services').update({...}).eq('id',id)`|
| `DELETE /admin/services/:id`              | `supabaseAdmin.from('cvisual_services').delete().eq('id',id)`    |
| `POST /admin/portfolio`                   | `supabaseAdmin.from('cvisual_projects').insert({...})`           |
| `PUT /admin/portfolio/:id`                | `supabaseAdmin.from('cvisual_projects').update({...}).eq('id',id)`|
| `DELETE /admin/portfolio/:id`             | `supabaseAdmin.from('cvisual_projects').delete().eq('id',id)`    |
| `POST /admin/news`                        | `supabaseAdmin.from('cvisual_news').insert({...})`               |
| `PUT /admin/news/:id`                     | `supabaseAdmin.from('cvisual_news').update({...}).eq('id',id)`   |
| `DELETE /admin/news/:id`                  | `supabaseAdmin.from('cvisual_news').delete().eq('id',id)`        |
| `POST /admin/clients`                     | `supabaseAdmin.from('cvisual_clients').insert({...})`            |
| `DELETE /admin/clients/:id`               | `supabaseAdmin.from('cvisual_clients').delete().eq('id',id)`     |
| `GET /admin/applications`                 | `supabaseAdmin.from('cvisual_applications').select('*').order('created_at',{ascending:false})`|
| `GET /admin/applications/:id`             | `supabaseAdmin.from('cvisual_applications').select('*').eq('id',id).single()`|
| `PUT /admin/applications/:id/status`      | `supabaseAdmin.from('cvisual_applications').update({status}).eq('id',id)` + Edge Function email|
| `GET /admin/inquiries`                    | `supabaseAdmin.from('cvisual_inquiries').select('*').order('created_at',{ascending:false})`|
| `GET/PUT/DELETE /admin/inquiries/:id`     | CRUD sur `cvisual_inquiries` via `supabaseAdmin`                 |
| `GET /admin/newsletter`                   | `supabaseAdmin.from('cvisual_newsletter').select('*')`           |
| `GET /admin/stats`                        | COUNT queries sur 4 tables                                        |
| `GET/POST /admin/recruitment/info`        | CRUD sur `cvisual_recruitment_info`                              |
| `POST /admin/recruitment/toggle`          | `update({is_active}).eq('id',1)`                                 |
| `GET/POST /admin/recruitment/questions`   | CRUD sur `cvisual_recruitment_questions`                         |
| `GET /admin/emails/templates`             | `supabaseAdmin.from('cvisual_email_templates').select('*')`      |
| `PUT /admin/emails/templates/:id`         | `supabaseAdmin.from('cvisual_email_templates').update({...}).eq('id',id)`|
| `GET/POST /admin/emails/settings`         | CRUD sur `cvisual_settings` WHERE key='logo_url'                 |
| `POST /admin/emails/broadcast`            | Boucle + appel `EDGE_BASE/send-email` pour chaque destinataire   |
| `POST /admin/emails/test`                 | Appel direct `EDGE_BASE/send-email` avec html direct             |
| `GET /admin/chat/conversations`           | `supabaseAdmin.from('cvisual_chat_messages').select('visitor_id')`|
| `GET/POST /api/chat/messages`             | CRUD sur `cvisual_chat_messages`                                 |
| `POST /auth/login` (admin)                | Comparer username/password_hash dans `cvisual_admins` via Edge Function|
| `POST /user/register`                     | `supabase.from('cvisual_users').insert({...})` + Edge Function email|
| `POST /user/login`                        | Comparer email/password_hash dans `cvisual_users` + retourner JWT|

---

## ÉTAPE 6 — Auth Admin (login.html)

### Option A — Simple (recommandée pour démarrer)
Garder l'auth actuelle basée sur username/password stockés dans `cvisual_admins`.
Créer une Edge Function `admin-login` :

```typescript
// supabase/functions/admin-login/index.ts
// Reçoit { username, password }
// Cherche dans cvisual_admins, compare bcrypt
// Retourne un JWT signé avec JWT_SECRET_KEY
```

### Option B — Supabase Auth natif
Migrer les admins vers `supabase.auth.signInWithPassword({ email, password })`
et utiliser les politiques RLS basées sur `auth.uid()`.

---

## ÉTAPE 7 — Fichiers uploads / images

Le backend Python stocke les images en base64 dans la DB.
Ce comportement est **conservé** — les colonnes `TEXT` supportent base64.

Pour la migration future vers Supabase Storage :
```javascript
const { data } = await supabaseAdmin.storage
  .from('cvisual-uploads')
  .upload(`images/${filename}`, file);
const url = supabase.storage.from('cvisual-uploads').getPublicUrl(data.path).data.publicUrl;
```

---

## ÉTAPE 8 — Supprimer le backend Python

Une fois que **tout fonctionne** avec Supabase :

1. Vérifier que toutes les pages admin et publiques fonctionnent correctement
2. Supprimer le service Render (ou le mettre en veille)
3. Supprimer le dossier `backend/` du repo Git :
   ```bash
   git rm -r backend/
   git commit -m "Remove Python backend — migrated to Supabase"
   git push
   ```

---

## ÉTAPE 9 — Mettre à jour les variables dans le frontend

Mettre à jour les deux fichiers suivants avec les vraies valeurs :
- `assets/js/public.js` → `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `assets/js/admin.js`  → `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`

---

## Résumé des fichiers créés

```
supabase/
├── sql/
│   ├── 01_tables.sql    ← 18 tables CREATE TABLE cvisual_*
│   ├── 02_rls.sql       ← Row Level Security (public read + form inserts)
│   ├── 03_indexes.sql   ← Index de performance
│   └── 04_seed.sql      ← Templates email + settings + admin par défaut
├── functions/
│   └── send-email/
│       └── index.ts     ← Edge Function Deno (remplace send_brevo_email)
└── MIGRATION.md         ← Ce fichier
```

## Tables créées (18 total, toutes préfixées `cvisual_`)

| Table                          | Description                            |
|--------------------------------|----------------------------------------|
| `cvisual_admins`               | Comptes admin dashboard                |
| `cvisual_users`                | Utilisateurs publics inscrits          |
| `cvisual_services`             | Services offerts                       |
| `cvisual_projects`             | Portfolio                              |
| `cvisual_news`                 | Actualités et offres d'emploi          |
| `cvisual_clients`              | Logos clients/partenaires              |
| `cvisual_newsletter`           | Abonnés newsletter                     |
| `cvisual_recruitment_info`     | Config du poste actif                  |
| `cvisual_recruitment_questions`| Questions formulaire recrutement       |
| `cvisual_applications`         | Candidatures reçues                    |
| `cvisual_inquiries`            | Demandes de devis / contact            |
| `cvisual_chat_messages`        | Messages live chat                     |
| `cvisual_visitors`             | Tracking visites                       |
| `cvisual_email_templates`      | Modèles d'emails (8 templates)         |
| `cvisual_settings`             | Paramètres globaux (logo_url, etc.)    |
| `cvisual_blog`                 | Articles de blog (nouveau)             |
| `cvisual_testimonials`         | Témoignages clients (nouveau)          |
| `cvisual_team`                 | Membres de l'équipe (nouveau)          |
