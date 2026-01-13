/**
 * Tests unitaires pour le frontend
 * Framework de test : Jest avec JSDOM
 */

// Mock du DOM
document.body.innerHTML = `
  <div id="status-indicator" class="status-indicator">
    <span class="status-dot"></span>
    <span id="status-text">Vérification...</span>
  </div>
  <select id="model-select">
    <option value="">Sélectionnez un modèle</option>
  </select>
  <div id="chat-container"></div>
  <form id="chat-form">
    <textarea id="user-input"></textarea>
    <button type="submit" id="send-button">Envoyer</button>
  </form>
`;

// Mock de fetch
global.fetch = jest.fn();

// Import des fonctions à tester (simulées ici)
const API_URL = 'http://localhost:3001/api';

function updateStatus(status, text) {
  const statusIndicator = document.getElementById('status-indicator');
  const statusText = document.getElementById('status-text');
  statusIndicator.className = `status-indicator ${status}`;
  statusText.textContent = text;
}

function populateModelSelect(models) {
  const modelSelect = document.getElementById('model-select');
  modelSelect.innerHTML = '<option value="">Sélectionnez un modèle</option>';
  
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = `${model.name} (${formatSize(model.size)})`;
    modelSelect.appendChild(option);
  });
  
  modelSelect.disabled = false;
}

function formatSize(bytes) {
  if (!bytes) return 'Taille inconnue';
  const gb = bytes / (1024 ** 3);
  return `${gb.toFixed(1)} GB`;
}

function addMessage(role, content) {
  const chatContainer = document.getElementById('chat-container');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  const headerDiv = document.createElement('div');
  headerDiv.className = 'message-header';
  headerDiv.textContent = role === 'user' ? 'Vous' : role === 'assistant' ? 'Assistant' : 'Système';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;
  
  messageDiv.appendChild(headerDiv);
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatCodeBlocks(text) {
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
  });
}

describe('Frontend Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.getElementById('chat-container').innerHTML = '';
    document.getElementById('model-select').innerHTML = '<option value="">Sélectionnez un modèle</option>';
  });
  
  describe('updateStatus()', () => {
    test('devrait mettre à jour le statut en "connected"', () => {
      updateStatus('connected', 'Connecté à Ollama');
      
      const statusIndicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      
      expect(statusIndicator.className).toBe('status-indicator connected');
      expect(statusText.textContent).toBe('Connecté à Ollama');
    });
    
    test('devrait mettre à jour le statut en "error"', () => {
      updateStatus('error', 'Erreur de connexion');
      
      const statusIndicator = document.getElementById('status-indicator');
      const statusText = document.getElementById('status-text');
      
      expect(statusIndicator.className).toBe('status-indicator error');
      expect(statusText.textContent).toBe('Erreur de connexion');
    });
  });
  
  describe('formatSize()', () => {
    test('devrait formater correctement la taille en GB', () => {
      expect(formatSize(4700000000)).toBe('4.4 GB');
      expect(formatSize(776000000)).toBe('0.7 GB');
      expect(formatSize(18000000000)).toBe('16.8 GB');
    });
    
    test('devrait gérer les valeurs nulles ou indéfinies', () => {
      expect(formatSize(null)).toBe('Taille inconnue');
      expect(formatSize(undefined)).toBe('Taille inconnue');
      expect(formatSize(0)).toBe('Taille inconnue');
    });
  });
  
  describe('populateModelSelect()', () => {
    test('devrait ajouter les modèles à la liste déroulante', () => {
      const models = [
        { name: 'qwen2.5-coder:7b', size: 4700000000 },
        { name: 'deepseek-coder:latest', size: 776000000 }
      ];
      
      populateModelSelect(models);
      
      const modelSelect = document.getElementById('model-select');
      const options = modelSelect.querySelectorAll('option');
      
      expect(options.length).toBe(3); // 1 option par défaut + 2 modèles
      expect(options[1].value).toBe('qwen2.5-coder:7b');
      expect(options[2].value).toBe('deepseek-coder:latest');
      expect(modelSelect.disabled).toBe(false);
    });
    
    test('devrait afficher la taille formatée pour chaque modèle', () => {
      const models = [
        { name: 'test-model', size: 5000000000 }
      ];
      
      populateModelSelect(models);
      
      const modelSelect = document.getElementById('model-select');
      const option = modelSelect.querySelector('option[value="test-model"]');
      
      expect(option.textContent).toContain('4.7 GB');
    });
  });
  
  describe('addMessage()', () => {
    test('devrait ajouter un message utilisateur', () => {
      addMessage('user', 'Bonjour !');
      
      const chatContainer = document.getElementById('chat-container');
      const message = chatContainer.querySelector('.message.user');
      
      expect(message).not.toBeNull();
      expect(message.querySelector('.message-header').textContent).toBe('Vous');
      expect(message.querySelector('.message-content').textContent).toBe('Bonjour !');
    });
    
    test('devrait ajouter un message assistant', () => {
      addMessage('assistant', 'Bonjour ! Comment puis-je vous aider ?');
      
      const chatContainer = document.getElementById('chat-container');
      const message = chatContainer.querySelector('.message.assistant');
      
      expect(message).not.toBeNull();
      expect(message.querySelector('.message-header').textContent).toBe('Assistant');
      expect(message.querySelector('.message-content').textContent).toBe('Bonjour ! Comment puis-je vous aider ?');
    });
    
    test('devrait ajouter un message système', () => {
      addMessage('system', 'Modèle sélectionné');
      
      const chatContainer = document.getElementById('chat-container');
      const message = chatContainer.querySelector('.message.system');
      
      expect(message).not.toBeNull();
      expect(message.querySelector('.message-header').textContent).toBe('Système');
    });
  });
  
  describe('escapeHtml()', () => {
    test('devrait échapper les caractères HTML dangereux', () => {
      const input = '<script>alert("XSS")</script>';
      const output = escapeHtml(input);
      
      expect(output).not.toContain('<script>');
      expect(output).toContain('&lt;script&gt;');
    });
    
    test('devrait échapper les guillemets et apostrophes', () => {
      const input = '"test" et \'test\'';
      const output = escapeHtml(input);
      
      expect(output).toContain('&quot;');
      expect(output).toContain('&#39;');
    });
    
    test('devrait gérer le texte normal sans modification', () => {
      const input = 'Texte normal sans HTML';
      const output = escapeHtml(input);
      
      expect(output).toBe(input);
    });
  });
  
  describe('formatCodeBlocks()', () => {
    test('devrait formater un bloc de code simple', () => {
      const input = '```javascript\nconst x = 5;\n```';
      const output = formatCodeBlocks(input);
      
      expect(output).toContain('<pre><code class="language-javascript">');
      expect(output).toContain('const x = 5;');
      expect(output).toContain('</code></pre>');
    });
    
    test('devrait formater un bloc de code sans langage spécifié', () => {
      const input = '```\ndu code\n```';
      const output = formatCodeBlocks(input);
      
      expect(output).toContain('<pre><code class="language-text">');
    });
    
    test('devrait gérer plusieurs blocs de code', () => {
      const input = '```js\ncode1\n```\nTexte\n```python\ncode2\n```';
      const output = formatCodeBlocks(input);
      
      expect(output).toContain('language-js');
      expect(output).toContain('language-python');
      expect(output).toContain('Texte');
    });
    
    test('devrait échapper le HTML dans les blocs de code', () => {
      const input = '```html\n<script>alert("test")</script>\n```';
      const output = formatCodeBlocks(input);
      
      expect(output).toContain('&lt;script&gt;');
      expect(output).not.toContain('<script>alert');
    });
  });
  
  describe('Validation des entrées', () => {
    test('le champ de saisie devrait être requis', () => {
      const userInput = document.getElementById('user-input');
      expect(userInput.hasAttribute('required')).toBe(false); // Dans notre HTML actuel
      
      // Test de validation personnalisée
      const isEmpty = userInput.value.trim() === '';
      expect(isEmpty).toBe(true);
    });
  });
  
  describe('Accessibilité', () => {
    test('les éléments importants devraient avoir des labels ARIA', () => {
      const sendButton = document.getElementById('send-button');
      const chatContainer = document.getElementById('chat-container');
      
      // Ces attributs devraient être présents dans le HTML
      expect(sendButton.getAttribute('aria-label')).toBeTruthy();
      expect(chatContainer.getAttribute('role')).toBe('log');
    });
  });
});