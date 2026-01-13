# Guide d'Installation et d'Utilisation

**Projet** : Ollama Web Interface  
**Auteur** : [Ton nom]  
**Date** : 13 janvier 2025

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** version 18 ou supérieure ([Télécharger](https://nodejs.org/))
- **Ollama** ([Télécharger](https://ollama.com/download))

### Vérifier les installations

```bash
# Vérifier Node.js
node --version
# Doit afficher v18.x.x ou supérieur

# Vérifier npm
npm --version
# Doit afficher 9.x.x ou supérieur
```

---

## 🚀 Installation

### 1. Télécharger le projet

Si vous avez reçu une archive ZIP :
```bash
# Décompresser l'archive
# Puis ouvrir un terminal dans le dossier décompressé
```

Si c'est un repo Git :
```bash
git clone [URL_DU_REPO]
cd ollama-assistant-projet
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande va installer :
- Express (serveur web)
- CORS (gestion des requêtes cross-origin)
- Jest (tests unitaires)
- Supertest (tests API)

**⏱️ Durée** : ~30 secondes

---

## 🤖 Préparer Ollama

### 1. Installer Ollama

Si ce n'est pas déjà fait :

**Windows** :  
Télécharger et installer depuis https://ollama.com/download

**macOS** :
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Linux** :
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Télécharger un modèle

```bash
# Modèle recommandé pour le code (4.7 GB)
ollama pull qwen2.5-coder:7b
```

**⏱️ Durée** : ~5 minutes selon votre connexion

**Autres modèles disponibles** :
- `qwen2.5:0.5b` (397 MB) - Très léger et rapide
- `qwen3-coder:latest` (18 GB) - Plus performant mais lourd
- `deepseek-coder:latest` (776 MB) - Spécialisé code

### 3. Lancer Ollama en arrière-plan

**Ouvrir un premier terminal** et taper :

```bash
ollama serve
```

Vous devriez voir :
```
Listening on 127.0.0.1:11434 (version 0.x.x)
```

✅ **Laissez ce terminal ouvert !** Ollama doit tourner en permanence.

---

## ▶️ Lancer l'application

### 1. Ouvrir un second terminal

Dans le dossier du projet :

```bash
npm start
```

Vous devriez voir :
```
🚀 Serveur démarré sur http://localhost:3001
📡 Proxy Ollama configuré sur http://localhost:11434

💡 Assurez-vous qu'Ollama est lancé avec: ollama serve
```

### 2. Ouvrir dans le navigateur

Aller sur : **http://localhost:3001**

---

## ✅ Vérification du fonctionnement

Une fois l'application ouverte, vous devriez voir :

1. **En-tête bleu** avec le titre "🤖 Ollama Assistant"

2. **Indicateur de statut vert** :
   ```
   🟢 Connecté à Ollama
   ```

3. **Liste déroulante "Modèle"** avec vos modèles installés :
   ```
   qwen2.5-coder:7b (4.7 GB)
   ```

4. **Zone de chat** avec le message de bienvenue

5. **Champ de texte** et bouton "📤 Envoyer"

---

## 🧪 Tester l'application

### 1. Sélectionner un modèle

Cliquer sur la liste déroulante et choisir un modèle (ex: `qwen2.5-coder:7b`)

### 2. Poser une question

Exemples de questions à tester :

```
Explique-moi ce qu'est une closure en JavaScript
```

```
Écris une fonction Python pour trier une liste par ordre décroissant
```

```
Comment fonctionne async/await en JavaScript ?
```

### 3. Observer la réponse

- Un indicateur de chargement s'affiche (3 points animés)
- La réponse apparaît après quelques secondes
- Le code est formaté avec coloration syntaxique

---

## 🧪 Lancer les tests unitaires

Le projet inclut des tests automatisés.

```bash
# Lancer tous les tests
npm test

# Avec rapport de couverture
npm run test:coverage
```

**Résultat attendu** :
```
PASS  backend/server.test.js
PASS  frontend/script.test.js

Test Suites: 2 passed, 2 total
Tests:       25 passed, 25 total
Time:        3.456 s
```

---

## 🛑 Arrêter l'application

### Pour arrêter le serveur :
Dans le terminal du serveur, appuyer sur **Ctrl + C**

### Pour arrêter Ollama :
Dans le terminal d'Ollama, appuyer sur **Ctrl + C**

---

## ❌ Résolution des problèmes

### Problème 1 : "Serveur non disponible" (point rouge)

**Cause** : Le serveur backend n'est pas lancé

**Solution** :
```bash
npm start
```

---

### Problème 2 : "Ollama non disponible" (point rouge)

**Cause** : Ollama n'est pas lancé

**Solution** :
```bash
# Dans un terminal séparé
ollama serve
```

Vérifier qu'il écoute sur le port 11434.

---

### Problème 3 : "Aucun modèle trouvé"

**Cause** : Aucun modèle Ollama installé

**Solution** :
```bash
ollama pull qwen2.5-coder:7b
```

Puis rafraîchir la page (F5).

---

### Problème 4 : Port 3001 déjà utilisé

**Erreur** :
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution 1** : Trouver et tuer le processus
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [NUMERO] /F

# macOS/Linux
lsof -ti:3001 | xargs kill -9
```

**Solution 2** : Changer le port dans `backend/server.js` (ligne 7)
```javascript
const PORT = 3002; // ou 4000, 5000, etc.
```

Puis aussi dans `frontend/script.js` (ligne 7) :
```javascript
const API_URL = 'http://localhost:3002/api';
```

---

### Problème 5 : npm install échoue dans PowerShell

**Erreur** : Variable LASTEXITCODE non définie

**Solution** : Utiliser CMD au lieu de PowerShell
```bash
# Ouvrir un terminal CMD
cmd

# Puis
npm install
```

---

## 📁 Structure du projet

```
ollama-assistant-projet/
├── backend/
│   ├── server.js              # Serveur Express (API)
│   └── server.test.js         # Tests backend
├── frontend/
│   ├── index.html             # Interface utilisateur
│   ├── style.css              # Styles
│   ├── script.js              # Logique frontend
│   └── script.test.js         # Tests frontend
├── node_modules/              # Dépendances (généré)
├── package.json               # Configuration npm
├── README.md                  # Documentation principale
├── TESTS.md                   # Documentation des tests
├── ANALYSE_CRITIQUE.md        # Analyse du code
├── GUIDE_INSTALLATION.md      # Ce fichier
└── .gitignore                 # Fichiers ignorés par Git
```

---

## 🔧 Configuration avancée (optionnel)

### Changer l'URL d'Ollama

Si Ollama tourne sur un autre port ou serveur :

**Fichier** : `backend/server.js` (ligne 8)
```javascript
const OLLAMA_API_URL = 'http://localhost:11434'; // Modifier ici
```

### Activer le mode développement

Pour que le serveur redémarre automatiquement à chaque modification :

```bash
npm run dev
```

Nécessite `nodemon` (déjà dans les dépendances).

---

## 📞 Support

Si vous rencontrez un problème non listé ici :

1. Vérifier les logs dans les terminaux
2. Vérifier que toutes les dépendances sont installées
3. Consulter le fichier `ANALYSE_CRITIQUE.md` pour les limitations connues

---

## 📝 Checklist pour la première utilisation

- [ ] Node.js installé (v18+)
- [ ] Ollama installé
- [ ] `npm install` exécuté
- [ ] Au moins un modèle téléchargé (`ollama pull qwen2.5-coder:7b`)
- [ ] Terminal 1 : `ollama serve` lancé
- [ ] Terminal 2 : `npm start` lancé
- [ ] Navigateur ouvert sur http://localhost:3001
- [ ] Indicateur vert "Connecté à Ollama"
- [ ] Modèle sélectionné dans la liste
- [ ] Question posée et réponse reçue

---

**Bon test ! 🚀**

---

**Contact** : [Ton email ou info de contact]