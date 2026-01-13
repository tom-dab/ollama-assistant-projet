/**
 * Serveur Backend pour l'interface Ollama
 * 
 * Ce serveur agit comme proxy entre le frontend et l'API Ollama locale.
 * Il gère les problèmes de CORS et centralise la logique de communication avec Ollama.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;
const OLLAMA_API_URL = 'http://localhost:11434';

// Middleware
app.use(cors()); // Autorise les requêtes cross-origin
app.use(express.json()); // Parse le JSON des requêtes
app.use(express.static(path.join(__dirname, '../frontend'))); // Sert les fichiers statiques

/**
 * Route pour lister les modèles disponibles sur Ollama
 * GET /api/models
 */
app.get('/api/models', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error);
    res.status(500).json({ 
      error: 'Impossible de récupérer les modèles',
      details: error.message 
    });
  }
});

/**
 * Route pour envoyer un message au modèle Ollama
 * POST /api/chat
 * Body: { model: string, prompt: string }
 */
app.post('/api/chat', async (req, res) => {
  const { model, prompt } = req.body;
  
  // Validation des données
  if (!model || !prompt) {
    return res.status(400).json({ 
      error: 'Le modèle et le prompt sont requis' 
    });
  }
  
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false // Désactive le streaming pour simplifier
      })
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la communication avec Ollama',
      details: error.message 
    });
  }
});

/**
 * Route de santé pour vérifier si Ollama est accessible
 * GET /api/health
 */
app.get('/api/health', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    
    if (response.ok) {
      res.json({ 
        status: 'ok', 
        ollama: 'connected',
        message: 'Ollama est accessible' 
      });
    } else {
      res.status(503).json({ 
        status: 'error', 
        ollama: 'disconnected',
        message: 'Ollama ne répond pas correctement' 
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      ollama: 'disconnected',
      message: 'Impossible de se connecter à Ollama',
      details: error.message
    });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 Proxy Ollama configuré sur ${OLLAMA_API_URL}`);
  console.log(`\n💡 Assurez-vous qu'Ollama est lancé avec: ollama serve`);
});