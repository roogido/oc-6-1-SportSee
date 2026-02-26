# SportSee – Dashboard d’analytics sportif

SportSee est une application web permettant à un utilisateur de consulter ses statistiques sportives via un tableau de bord interactif.

Ce projet a été réalisé dans le cadre de la formation **OpenClassrooms – Développeur d’application Full-Stack**, mission :

> *Développez un tableau de bord d’analytics avec React et React Router*

L’objectif est de développer une application React moderne intégrant :
- Authentification
- Gestion d’état global
- Routage sécurisé
- Visualisations de données interactives

---

## 🎯 Objectifs du projet

- Mettre en place une application avec **Create React Router**
- Implémenter un système d’authentification
- Gérer un état global avec **Context API**
- Intégrer des graphiques avec **Recharts**
- Connecter le frontend à une API NodeJS
- Permettre l’utilisation de **données mockées ou API réelle**
- Respecter fidèlement les maquettes Figma (desktop ≥ 1024px)

---

## 🧱 Architecture & Implémentation

L’application repose sur :

- **React 19**
- **React Router**
- **Context API** (gestion globale de l’authentification)
- **Recharts** (visualisation des données)
- Hooks personnalisés pour les appels API
- Sélecteurs pour formatter et standardiser les données
- Gestion des états : loading / erreurs
- Routes protégées via `ProtectedRoute`
- Page 404
- Possibilité de basculer entre **mode mock** et **mode API**

Les appels HTTP sont externalisés hors des composants React (hooks dédiés), conformément aux recommandations du projet.

---

## 📊 Fonctionnalités

### 🔐 Authentification
- Page de connexion non protégée
- Routes Dashboard et Profil protégées
- Redirection automatique si non authentifié
- Token JWT inclus dans les requêtes authentifiées

### 📈 Dashboard
- Distance moyenne (4 semaines)
- Fréquence cardiaque (semaine ISO)
- Objectif hebdomadaire (Donut)
- Indicateurs hebdomadaires :
  - Durée d’activité
  - Distance parcourue
- Données dynamiques (mock ou API)

### 👤 Profil
- Informations utilisateur
- Statistiques globales depuis la date d’inscription
- Total :
  - Temps couru
  - Calories brûlées
  - Distance parcourue
  - Nombre de sessions
  - Jours de repos

---

## 🧪 Comptes de test

Trois utilisateurs sont disponibles :

- username: `sophiemartin`  
  password: `password123`

- username: `emmaleroy`  
  password: `password789`

- username: `marcdubois`  
  password: `password456`

---

## 🛠 Technologies utilisées

- React
- React Router
- Context API
- Recharts
- Fetch API
- CSS Modules
- Backend NodeJS (fourni)

---

## 📁 Structure simplifiée

```text
src
├── api
├── assets
│   └── images
│       └── brand
├── components
│   ├── HeartRateChart
│   ├── WeekKpi
│   ├── WeeklyAverageChart
│   ├── WeeklyGoalDonut
│   └── layout
│       ├── Footer
│       ├── Header
│       └── Layout
├── context
├── data
│   ├── mappers
│   ├── mocks
│   ├── providers
│   ├── raw
│   │   └── users
│   └── selectors
├── hooks
├── pages
│   ├── Dashboard
│   ├── Errors
│   │   └── NotFound
│   ├── Login
│   └── Profile
├── router
└── utils
```

---

## Installation

### 1. Cloner le projet

```bash
git clone git@github.com:roogido/oc-6-1-SportSee.git
cd oc-6-1-SportSee
```

---

### 2. Lancer le backend (NodeJS)

```bash
cd backend
npm install
npm run dev
```

Le backend démarre sur le port configuré (par défaut : http://localhost:8000).

---

### 3. Lancer le frontend (React)

Dans un nouveau terminal :

```bash
cd frontend
npm install
npm run dev
```

L’application est accessible sur :

http://localhost:5173

---

## Configuration : mode Mock ou API

Le projet permet d’utiliser :

- des données mockées
- le backend NodeJS fourni

Le choix se fait via la variable d’environnement suivante (fichier /frontend/.env):

```bash
VITE_DATA_SOURCE=mock
```

ou

```bash
VITE_DATA_SOURCE=api
```

---

## Auteur

Projet réalisé par Salem Hadjali  
Formation OpenClassrooms – Développeur d’application Full-Stack.