# 🚀 Déploiement Gratuit

## 1. Landing Page Statique → GitHub Pages (GRATUIT)

### Configuration (1 minute)

1. Va sur ton repo : https://github.com/MoussaBoaz/laravel-angular-starter
2. Clique **Settings** (onglet en haut)
3. Dans le menu de gauche, clique **Pages**
4. Source : Sélectionne **Deploy from a branch**
5. Branch : Sélectionne **main** et dossier **/docs**
6. Clique **Save**

7. Attends 2-3 minutes
8. Ton site sera disponible sur :
   **https://moussaboaz.github.io/laravel-angular-starter**

### Personnaliser le domaine (optionnel)
Si tu veux un domaine perso (ex: `starter.moussaboaz.dev`) :
1. Crée un fichier `docs/CNAME` avec ton domaine
2. Configure un CNAME chez ton registrar vers `moussaboaz.github.io`

---

## 2. Démo Full Stack → Vercel + Render (GRATUIT)

### Frontend Angular → Vercel

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Se connecter (une seule fois)
vercel login

# Déployer
cd frontend
vercel --prod
```

**OU via Git (automatique)** :
1. Va sur https://vercel.com/new
2. Importe ton repo GitHub
3. Sélectionne le dossier `frontend/`
4. Framework : Other (Angular)
5. Build command : `npm run build`
6. Output directory : `dist/frontend/browser`

**URL gratuite** : `https://laravel-angular-starter.vercel.app`

---

### Backend Laravel → Render

```bash
# Créer un fichier render.yaml
touch backend/render.yaml
```

**Contenu du fichier** (je te le crée) :

```yaml
services:
  - type: web
    name: laravel-api
    env: docker
    dockerfilePath: ./Dockerfile
    envVars:
      - key: APP_ENV
        value: production
      - key: APP_KEY
        generateValue: true
      - key: DB_CONNECTION
        value: mysql
      - key: DB_HOST
        fromDatabase:
          name: laravel-db
          property: host
      - key: DB_DATABASE
        value: laravel
      - key: DB_USERNAME
          value: laravel
      - key: DB_PASSWORD
        fromDatabase:
          name: laravel-db
          property: password

databases:
  - name: laravel-db
    databaseName: laravel
    user: laravel
```

**Déploiement** :
1. Va sur https://dashboard.render.com/
2. Crée un compte (gratuit)
3. **New +** → **Blueprint**
4. Connecte ton repo GitHub
5. Render détecte le `render.yaml` et déploie tout

**URL gratuite** : `https://laravel-api.onrender.com`

---

## 3. Récapitulatif des URLs

| Service | URL | Prix |
|---------|-----|------|
| Landing Page | `moussaboaz.github.io/laravel-angular-starter` | GRATUIT |
| Frontend | `laravel-angular-starter.vercel.app` | GRATUIT |
| Backend API | `laravel-api.onrender.com` | GRATUIT (750h/mois) |

---

## 🎯 Prochaine étape

**Je te recommande de commencer par :**
1. **GitHub Pages** (1 min) → Landing visible immédiatement
2. **Vercel** (5 min) → Frontend live
3. **Render** (10 min) → Backend + API fonctionnels

**Tu veux que je configure quoi en premier ?**
- A) Juste GitHub Pages (landing)
- B) Vercel + Render (full stack démo)
- C) Les 3 en même temps
