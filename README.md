# 🧾 Facturo — SaaS de Facturation

SaaS de facturation pour freelances et petites entreprises.

## 🚀 Features

### Backend (Laravel 12)
- ✅ Gestion des clients (CRUD)
- ✅ Création de factures avec numérotation auto
- ✅ Lignes de facture (produits/services)
- ✅ Calcul automatique TVA
- ✅ Statuts: Brouillon, Envoyée, Payée, En retard
- ✅ Intégration Stripe prête
- ✅ API REST complète

### Frontend (Angular 19)
- ✅ Dashboard avec statistiques (CA, impayés, en retard)
- ✅ Liste des factures
- ✅ Création de facture avec calcul auto
- ✅ Gestion des clients
- ✅ Design responsive

## 🛠️ Stack

- **Backend:** Laravel 12, PHP 8.4
- **Frontend:** Angular 19, TypeScript 5.7
- **State:** Angular Signals
- **CSS:** Tailwind CSS
- **Paiement:** Stripe (prêt à intégrer)

## 📊 Dashboard

Affiche en temps réel:
- Total des factures
- Montant payé
- Montant en attente
- Montant en retard

## 📝 Création de facture

Formulaire complet avec:
- Sélection du client
- Lignes de facture (description, qté, prix)
- Calcul auto TVA
- Dates d'émission et d'échéance
- Notes et conditions

## 🚀 Installation

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend
cd frontend
npm install
npm start
```

## 💰 Modèle économique pour Pierre

| Pack | Prix | Description |
|------|------|-------------|
| Basic | €29/mois | 10 factures/mois |
| Pro | €79/mois | Factures illimitées + multi-utilisateurs |
| Enterprise | €199/mois | White-label + API |

---

*Projet créé pour Pierre — SaaS Launch Pack (€779)*
