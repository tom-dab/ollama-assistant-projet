/**
 * Script principal pour l'interface Ollama
 * Gère la communication avec le backend et l'interface utilisateur
 */

// Configuration
const API_URL = 'http://localhost:3000/api';

// Éléments DOM
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const modelSelect = document.getElementById('model-select');
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// État de l'application
let isLoading = false;
let currentModel = null;

/**
 * Initialisation de l'application
 */
async function init() {
  await checkHealth();
  await loadModels();
  setupEventListeners();
}

/**
 * Vérifie l'état de connexion avec Ollama
 */
async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      updateStatus('connected', 'Connecté à Ollama');
    } else {
      updateStatus('error', 'Ollama non disponible');
      showError('Impossible de se connecter à Ollama. Assurez-vous qu\'il est lancé.');
    }
  } catch (error) {
    updateStatus('error', 'Serveur non disponible');
    showError('Le serveur backend n\'est pas accessible. Vérifiez qu\'il est démarré.');
    console.error('Erreur de santé:', error);
  }
}

/**
 * Charge la liste des modèles disponibles
 */
async function loadModels() {
  try {
    const response = await fetch(`${API_URL}/models`);
    
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des modèles');
    }
    
    const data = await response.json();
    
    if (data.models && data.models.length > 0) {
      populateModelSelect(data.models);
    } else {
      modelSelect.innerHTML = '<option value="">Aucun modèle trouvé</option>';
      showError('Aucun modèle Ollama n\'est installé. Installez-en un avec: ollama pull qwen2.5-coder');
    }
  } catch (error) {
    console.error('Erreur lors du chargement des modèles:', error);
    modelSelect.innerHTML = '<option value="">Erreur de chargement</option>';
    showError('Impossible de charger les modèles disponibles.');
  }
}

/**
 * Remplit le sélecteur de modèles
 */
function populateModelSelect(models) {
  modelSelect.innerHTML = '<option value="">Sélectionnez un modèle</option>';
  
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.name;
    option.textContent = `${model.name} (${formatSize(model.size)})`;
    modelSelect.appendChild(option);
  });
  
  modelSelect.disabled = false;
}

/**
 * Formate la taille d'un modèle en unités lisibles
 */
function formatSize(bytes) {
  if (!bytes) return 'Taille inconnue';
  const gb = bytes / (1024 ** 3);
  return `${gb.toFixed(1)} GB`;
}

/**
 * Met à jour l'indicateur de statut
 */
function updateStatus(status, text) {
  statusIndicator.className = `status-indicator ${status}`;
  statusText.textContent = text;
}

/**
 * Configure les écouteurs d'événements
 */
function setupEventListeners() {
  // Sélection du modèle
  modelSelect.addEventListener('change', (e) => {
    currentModel = e.target.value;
    sendButton.disabled = !currentModel;
    
    if (currentModel) {
      clearWelcomeMessage();
      addMessage('system', `Modèle "${currentModel}" sélectionné. Commencez à discuter !`);
    }
  });
  
  // Soumission du formulaire
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleSubmit();
  });
  
  // Raccourci clavier : Entrée pour envoyer
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendButton.disabled && !isLoading) {
        handleSubmit();
      }
    }
  });
}

/**
 * Gère l'envoi d'un message
 */
async function handleSubmit() {
  const prompt = userInput.value.trim();
  
  if (!prompt || !currentModel || isLoading) {
    return;
  }
  
  // Affiche le message de l'utilisateur
  addMessage('user', prompt);
  
  // Réinitialise le champ de saisie
  userInput.value = '';
  userInput.style.height = 'auto';
  
  // Désactive l'interface pendant le chargement
  isLoading = true;
  sendButton.disabled = true;
  userInput.disabled = true;
  
  // Affiche l'indicateur de chargement
  const loadingId = showLoading();
  
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: currentModel,
        prompt: prompt
      })
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Supprime l'indicateur de chargement
    removeLoading(loadingId);
    
    // Affiche la réponse
    if (data.response) {
      addMessage('assistant', data.response);
    } else if (data.error) {
      showError(data.error);
    }
    
  } catch (error) {
    removeLoading(loadingId);
    console.error('Erreur lors de l\'envoi:', error);
    showError('Une erreur est survenue lors de la génération de la réponse.');
  } finally {
    // Réactive l'interface
    isLoading = false;
    sendButton.disabled = false;
    userInput.disabled = false;
    userInput.focus();
  }
}

/**
 * Supprime le message de bienvenue
 */
function clearWelcomeMessage() {
  const welcome = chatContainer.querySelector('.welcome-message');
  if (welcome) {
    welcome.remove();
  }
}

/**
 * Ajoute un message au chat
 */
function addMessage(role, content) {
  clearWelcomeMessage();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  const headerDiv = document.createElement('div');
  headerDiv.className = 'message-header';
  headerDiv.textContent = role === 'user' ? 'Vous' : role === 'assistant' ? 'Assistant' : 'Système';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  // Détection et formatage du code
  if (content.includes('```')) {
    contentDiv.innerHTML = formatCodeBlocks(content);
  } else {
    contentDiv.textContent = content;
  }
  
  messageDiv.appendChild(headerDiv);
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);
  
  // Scroll automatique vers le bas
  scrollToBottom();
}

/**
 * Formate les blocs de code dans le texte
 */
function formatCodeBlocks(text) {
  // Remplace les blocs de code markdown par des balises <pre><code>
  return text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'text';
    return `<pre><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`;
  });
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Affiche un indicateur de chargement
 */
function showLoading() {
  const loadingId = `loading-${Date.now()}`;
  const loadingDiv = document.createElement('div');
  loadingDiv.id = loadingId;
  loadingDiv.className = 'message assistant';
  loadingDiv.innerHTML = `
    <div class="message-header">Assistant</div>
    <div class="message-content">
      <div class="loading-indicator" role="status" aria-label="Génération en cours">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatContainer.appendChild(loadingDiv);
  scrollToBottom();
  return loadingId;
}

/**
 * Supprime l'indicateur de chargement
 */
function removeLoading(loadingId) {
  const loadingDiv = document.getElementById(loadingId);
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message error';
  errorDiv.innerHTML = `
    <div class="message-header">Erreur</div>
    <div class="message-content">${escapeHtml(message)}</div>
  `;
  chatContainer.appendChild(errorDiv);
  scrollToBottom();
}

/**
 * Fait défiler le chat vers le bas
 */
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', init);