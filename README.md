# Ollama Web Interface

Interface web moderne et accessible pour interagir avec des modèles d'IA locaux via Ollama.

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Bonnes pratiques implémentées](#bonnes-pratiques-implémentées)
- [Technologies utilisées](#technologies-utilisées)
- [Développement](#développement)
- [Licence](#licence)

## 🎯 Aperçu

Ce projet est une interface web complète permettant d'interagir avec des modèles d'intelligence artificielle hébergés localement via Ollama. L'application offre une expérience utilisateur fluide et professionnelle pour discuter avec différents modèles LLM.

## ✨ Fonctionnalités

- **Sélection de modèles** : Affichage dynamique des modèles Ollama installés
- **Interface de chat intuitive** : Conversation en temps réel avec l'IA
- **Indicateur de statut** : Vérification de la connexion à Ollama
- **Formatage du code** : Détection et mise en forme automatique des blocs de code
- **Design responsive** : Interface adaptée mobile et desktop
- **Accessibilité** : Respect des normes WCAG (labels ARIA, navigation clavier)
- **Gestion d'erreurs** : Messages clairs en cas de problème

## 🏗️ Architecture

### Structure du projet

```
ollama-web-interface/
├── backend/
│   └── server.js          # Serveur Express (proxy API)
├── frontend/
│   ├── index.html         # Structure HTML
│   ├── style.css          # Styles CSS
│   └── script.js          # Logique JavaScript
├── package.json           # Dépendances Node.js
└── README.md             # Documentation
```

### Séparation des responsabilités

**Backend (Node.js + Express)**
- Proxy entre le frontend et l'API Ollama
- Gestion du CORS
- Validation des requêtes
- Logging des erreurs

**Frontend (HTML/CSS/JS Vanilla)**
- Interface utilisateur
- Gestion de l'état de l'application
- Communication avec le backend via fetch API
- Rendu dynamique des messages

### Flux de données

```
Frontend (navigateur)
    ↓ HTTP Request
Backend (Express :3000)
    ↓ HTTP Request
Ollama API (localhost:11434)
    ↓ Response
Backend
    ↓ Response
Frontend
```

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **Ollama** ([Télécharger ici](https://ollama.com/download))
- Au moins un modèle Ollama installé

### Installation d'Ollama et d'un modèle

```bash
# Sur macOS/Linux
curl -fsSL https://ollama.com/install.sh | sh

# Télécharger un modèle (exemple : qwen2.5-coder)
ollama pull qwen2.5-coder

# Lancer Ollama en arrière-plan
ollama serve
```

## 🚀 Installation

### 1. Cloner ou télécharger le projet

```bash
# Si vous avez Git
git clone [URL_DU_REPO]
cd ollama-web-interface

# Ou décompresser l'archive téléchargée
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Vérifier qu'Ollama est lancé

```bash
# Dans un autre terminal
ollama serve
```

### 4. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur **http://localhost:3000**

## 💻 Utilisation

1. **Ouvrir l'application** : Accédez à http://localhost:3000 dans votre navigateur

2. **Vérifier le statut** : L'indicateur en haut doit afficher "Connecté à Ollama" en vert

3. **Sélectionner un modèle** : Choisissez un modèle dans la liste déroulante

4. **Commencer à discuter** : Tapez votre message et appuyez sur Entrée (ou Maj+Entrée pour une nouvelle ligne)

### Raccourcis clavier

- **Entrée** : Envoyer le message
- **Maj + Entrée** : Nouvelle ligne dans le message

## ✅ Bonnes pratiques implémentées

### Architecture

- ✅ Séparation claire front/back
- ✅ Architecture modulaire avec fonctions réutilisables
- ✅ Gestion centralisée des erreurs
- ✅ Configuration via variables (API_URL)

### Sécurité

- ✅ Validation des entrées côté backend
- ✅ Protection contre les injections XSS (escapeHtml)
- ✅ Gestion sécurisée du CORS
- ✅ Pas de données sensibles exposées

### Accessibilité (WCAG)

- ✅ Sémantique HTML5 (`<main>`, `<section>`, `<header>`)
- ✅ Labels ARIA pour les éléments interactifs
- ✅ Attributs `role`, `aria-live`, `aria-label`
- ✅ Classe `.visually-hidden` pour les screen readers
- ✅ Navigation au clavier complète
- ✅ Contraste des couleurs respecté
- ✅ Focus visible sur les éléments interactifs

### Performances

- ✅ CSS avec variables pour réutilisation
- ✅ Pas de framework lourd (Vanilla JS)
- ✅ Événements optimisés (pas de fuites mémoire)
- ✅ Requêtes HTTP asynchrones avec async/await
- ✅ Scroll automatique uniquement si nécessaire

### Maintenabilité

- ✅ Code commenté et documenté
- ✅ Nommage clair des variables et fonctions
- ✅ Structure de fichiers logique
- ✅ Séparation des préoccupations (HTML/CSS/JS)
- ✅ Constantes en début de fichier
- ✅ Fonctions courtes et spécialisées

### UX/UI

- ✅ Design moderne et épuré
- ✅ Feedback visuel (loading, status)
- ✅ Messages d'erreur clairs
- ✅ Interface responsive (mobile/desktop)
- ✅ Animation fluide et subtile
- ✅ États désactivés visuellement clairs

## 🛠️ Technologies utilisées

### Backend
- **Node.js** : Environnement d'exécution JavaScript
- **Express** : Framework web minimaliste
- **CORS** : Middleware pour gérer les requêtes cross-origin

### Frontend
- **HTML5** : Structure sémantique
- **CSS3** : Styles modernes (Grid, Flexbox, Variables CSS)
- **JavaScript Vanilla** : Logique applicative (ES6+)
- **Fetch API** : Communication HTTP

### Outils de développement
- **Nodemon** (optionnel) : Rechargement automatique du serveur

## 👨‍💻 Développement

### Mode développement avec rechargement automatique

```bash
npm run dev
```

### Structure des requêtes API

**GET /api/health**
```json
{
  "status": "ok",
  "ollama": "connected",
  "message": "Ollama est accessible"
}
```

**GET /api/models**
```json
{
  "models": [
    {
      "name": "qwen2.5-coder",
      "size": 4711348672
    }
  ]
}
```

**POST /api/chat**
```json
// Request
{
  "model": "qwen2.5-coder",
  "prompt": "Explique-moi le concept de closure en JavaScript"
}

// Response
{
  "response": "Une closure est...",
  "done": true
}
```

### Personnalisation

#### Changer le port du serveur

Modifier dans `backend/server.js` :
```javascript
const PORT = 3000; // Changer ici
```

#### Modifier l'URL de l'API Ollama

Modifier dans `backend/server.js` :
```javascript
const OLLAMA_API_URL = 'http://localhost:11434'; // Changer ici
```

#### Personnaliser les couleurs

Modifier les variables CSS dans `frontend/style.css` :
```css
:root {
  --primary-color: #2563eb; /* Couleur principale */
  --success-color: #10b981; /* Couleur de succès */
  /* ... */
}
```

## 🐛 Résolution de problèmes

### Le serveur ne démarre pas

- Vérifiez que le port 3000 n'est pas déjà utilisé
- Vérifiez que Node.js est installé : `node --version`
- Réinstallez les dépendances : `rm -rf node_modules && npm install`

### "Ollama non disponible"

- Vérifiez qu'Ollama est lancé : `ollama serve`
- Vérifiez qu'Ollama écoute sur le port 11434
- Testez manuellement : `curl http://localhost:11434/api/tags`

### "Aucun modèle trouvé"

- Installez un modèle : `ollama pull qwen2.5-coder`
- Listez les modèles : `ollama list`

### Problèmes de CORS

- Vérifiez que le backend est bien lancé
- Vérifiez l'URL de l'API dans `script.js` (ligne 7)

## 📝 Licence

MIT - Projet réalisé dans le cadre d'un atelier pédagogique

## 👤 Auteur

**[Vos noms et prénoms]**

Projet développé avec l'assistance d'IA générative dans le cadre du cours "Coder avec l'IA générative".




# Créer la structure de dossiers
New-Item -Path "ollama-web-interface" -ItemType Directory
cd ollama-web-interface
New-Item -Path "backend" -ItemType Directory
New-Item -Path "frontend" -ItemType Directory