# Documentation des Tests Unitaires

Ce document explique comment exécuter et comprendre les tests unitaires du projet Ollama Web Interface.

## 📋 Vue d'ensemble

Le projet contient deux suites de tests :

1. **Tests Backend** (`backend/server.test.js`) : Teste les routes API et la logique serveur
2. **Tests Frontend** (`frontend/script.test.js`) : Teste les fonctions JavaScript côté client

## 🛠️ Installation

Les dépendances de test sont déjà incluses dans le `package.json`. Installez-les avec :

```bash
npm install
```

### Dépendances de test :
- **Jest** : Framework de test JavaScript
- **Supertest** : Pour tester les routes HTTP Express
- **@types/jest** : Typages TypeScript pour une meilleure autocomplétion

## 🚀 Exécution des tests

### Lancer tous les tests

```bash
npm test
```

### Lancer les tests en mode watch (redémarre automatiquement)

```bash
npm run test:watch
```

### Générer un rapport de couverture de code

```bash
npm run test:coverage
```

Le rapport sera généré dans le dossier `coverage/` et vous pourrez l'ouvrir dans votre navigateur :
```bash
# Ouvrir le rapport HTML
coverage/lcov-report/index.html
```

## 📊 Tests Backend

### Fichier : `backend/server.test.js`

#### Routes testées :

**1. GET /api/health**
- ✅ Retourne status "ok" quand Ollama est accessible
- ✅ Retourne status "error" quand Ollama est inaccessible
- ✅ Gère les erreurs de connexion

**2. GET /api/models**
- ✅ Retourne la liste des modèles disponibles
- ✅ Gère les erreurs réseau
- ✅ Valide le format de réponse

**3. POST /api/chat**
- ✅ Génère une réponse avec un prompt valide
- ✅ Valide les paramètres requis (modèle + prompt)
- ✅ Retourne erreur 400 si données manquantes
- ✅ Gère les erreurs Ollama

### Exemple de sortie :

```
Backend API Tests
  GET /api/health
    ✓ devrait retourner status ok quand Ollama est accessible (15ms)
    ✓ devrait retourner status error quand Ollama est inaccessible (8ms)
  GET /api/models
    ✓ devrait retourner la liste des modèles (12ms)
    ✓ devrait retourner une erreur 500 si Ollama est inaccessible (5ms)
  POST /api/chat
    ✓ devrait générer une réponse avec un prompt valide (10ms)
    ✓ devrait retourner erreur 400 si le modèle est manquant (3ms)
    ✓ devrait retourner erreur 400 si le prompt est manquant (2ms)
```

## 🎨 Tests Frontend

### Fichier : `frontend/script.test.js`

#### Fonctions testées :

**1. updateStatus()**
- ✅ Met à jour l'indicateur de statut (connecté/erreur)
- ✅ Change la classe CSS appropriée
- ✅ Met à jour le texte affiché

**2. formatSize()**
- ✅ Formate correctement les octets en GB
- ✅ Gère les valeurs nulles/undefined
- ✅ Arrondit à 1 décimale

**3. populateModelSelect()**
- ✅ Ajoute les modèles à la liste déroulante
- ✅ Affiche la taille formatée
- ✅ Active le select après chargement

**4. addMessage()**
- ✅ Ajoute un message utilisateur au chat
- ✅ Ajoute un message assistant au chat
- ✅ Applique les bonnes classes CSS

**5. escapeHtml()**
- ✅ Échappe les caractères HTML dangereux
- ✅ Protège contre les injections XSS
- ✅ Préserve le texte normal

**6. formatCodeBlocks()**
- ✅ Détecte et formate les blocs de code markdown
- ✅ Applique la coloration syntaxique
- ✅ Gère plusieurs blocs de code
- ✅ Échappe le HTML dans le code

### Exemple de sortie :

```
Frontend Tests
  updateStatus()
    ✓ devrait mettre à jour le statut en "connected" (5ms)
    ✓ devrait mettre à jour le statut en "error" (3ms)
  formatSize()
    ✓ devrait formater correctement la taille en GB (2ms)
    ✓ devrait gérer les valeurs nulles ou indéfinies (1ms)
  escapeHtml()
    ✓ devrait échapper les caractères HTML dangereux (4ms)
    ✓ devrait échapper les guillemets et apostrophes (2ms)
```

## 📈 Couverture de code

Objectif de couverture : **80%+**

### Rapport de couverture typique :

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.23 |    78.45 |   90.12 |   84.67 |
 backend            |   88.76 |    82.35 |   95.00 |   87.89 |
  server.js         |   88.76 |    82.35 |   95.00 |   87.89 |
 frontend           |   82.14 |    75.00 |   85.71 |   81.82 |
  script.js         |   82.14 |    75.00 |   85.71 |   81.82 |
--------------------|---------|----------|---------|---------|
```

## 🔍 Comment lire les résultats

### Symboles :
- ✓ : Test réussi
- ✗ : Test échoué
- → : Test en cours d'exécution

### Métriques de couverture :
- **% Stmts** : Pourcentage d'instructions exécutées
- **% Branch** : Pourcentage de branches (if/else) testées
- **% Funcs** : Pourcentage de fonctions testées
- **% Lines** : Pourcentage de lignes de code testées

## 🐛 Debugging des tests

### Un test échoue ?

1. **Lire le message d'erreur** : Jest affiche exactement où et pourquoi
2. **Vérifier les mocks** : Les fonctions mockées retournent-elles les bonnes valeurs ?
3. **Isoler le test** : Utilisez `test.only()` pour exécuter un seul test
4. **Ajouter des console.log** : Pour débugger les valeurs

### Exemple :

```javascript
test.only('mon test qui échoue', () => {
  console.log('Valeur actuelle:', maVariable);
  expect(maVariable).toBe(valeurAttendue);
});
```

## ✅ Bonnes pratiques testées

### Sécurité :
- ✅ Protection XSS (escapeHtml)
- ✅ Validation des entrées
- ✅ Gestion des erreurs

### Performance :
- ✅ Pas de requêtes inutiles
- ✅ Mocks pour éviter les appels réseau réels

### Accessibilité :
- ✅ Labels ARIA présents
- ✅ Attributs role corrects

### Architecture :
- ✅ Séparation des responsabilités
- ✅ Fonctions réutilisables
- ✅ Code modulaire

## 📝 Ajouter de nouveaux tests

### Template pour un nouveau test :

```javascript
describe('Ma nouvelle fonctionnalité', () => {
  test('devrait faire quelque chose de spécifique', () => {
    // Arrange : Préparer les données
    const input = 'test';
    
    // Act : Exécuter la fonction
    const result = maFonction(input);
    
    // Assert : Vérifier le résultat
    expect(result).toBe('attendu');
  });
});
```

## 🎯 CI/CD (Intégration Continue)

Ces tests peuvent être intégrés dans un pipeline CI/CD :

```yaml
# Exemple GitHub Actions
- name: Run tests
  run: npm test
  
- name: Generate coverage
  run: npm run test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## 📚 Ressources

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Documentation Supertest](https://github.com/visionmedia/supertest)
- [Guide des tests unitaires](https://kentcdodds.com/blog/write-tests)

## 🤝 Contribution

Pour ajouter de nouveaux tests :

1. Créer un fichier `*.test.js`
2. Suivre la structure existante
3. Documenter ce qui est testé
4. Viser 80%+ de couverture
5. Lancer `npm test` avant de commit

---

**Dernière mise à jour** : Janvier 2025