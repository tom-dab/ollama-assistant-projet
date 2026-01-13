/**
 * Tests unitaires pour le serveur backend
 * Framework de test : Jest avec Supertest
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock de l'API Ollama
global.fetch = jest.fn();

// Configuration du serveur de test
const createTestApp = () => {
  const app = express();
  const OLLAMA_API_URL = 'http://localhost:11434';
  
  app.use(cors());
  app.use(express.json());
  
  // Route health
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
  
  // Route models
  app.get('/api/models', async (req, res) => {
    try {
      const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ 
        error: 'Impossible de récupérer les modèles',
        details: error.message 
      });
    }
  });
  
  // Route chat
  app.post('/api/chat', async (req, res) => {
    const { model, prompt } = req.body;
    
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
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ 
        error: 'Erreur lors de la communication avec Ollama',
        details: error.message 
      });
    }
  });
  
  return app;
};

describe('Backend API Tests', () => {
  let app;
  
  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });
  
  describe('GET /api/health', () => {
    test('devrait retourner status ok quand Ollama est accessible', async () => {
      // Mock de la réponse Ollama
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ models: [] })
      });
      
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        ollama: 'connected',
        message: 'Ollama est accessible'
      });
    });
    
    test('devrait retourner status error quand Ollama est inaccessible', async () => {
      // Mock d'une erreur de connexion
      fetch.mockRejectedValueOnce(new Error('Connection refused'));
      
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
      expect(response.body.ollama).toBe('disconnected');
    });
    
    test('devrait retourner status error quand Ollama répond avec une erreur', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });
      
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
    });
  });
  
  describe('GET /api/models', () => {
    test('devrait retourner la liste des modèles', async () => {
      const mockModels = {
        models: [
          { name: 'qwen2.5-coder:7b', size: 4700000000 },
          { name: 'deepseek-coder:latest', size: 776000000 }
        ]
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModels
      });
      
      const response = await request(app).get('/api/models');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockModels);
      expect(response.body.models).toHaveLength(2);
    });
    
    test('devrait retourner une erreur 500 si Ollama est inaccessible', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const response = await request(app).get('/api/models');
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Impossible de récupérer les modèles');
    });
  });
  
  describe('POST /api/chat', () => {
    test('devrait générer une réponse avec un prompt valide', async () => {
      const mockResponse = {
        response: 'Voici ma réponse',
        done: true
      };
      
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      const response = await request(app)
        .post('/api/chat')
        .send({
          model: 'qwen2.5-coder:7b',
          prompt: 'Explique-moi les closures'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
      expect(response.body.response).toBe('Voici ma réponse');
    });
    
    test('devrait retourner erreur 400 si le modèle est manquant', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          prompt: 'Test prompt'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Le modèle et le prompt sont requis');
    });
    
    test('devrait retourner erreur 400 si le prompt est manquant', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          model: 'qwen2.5-coder:7b'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Le modèle et le prompt sont requis');
    });
    
    test('devrait retourner erreur 500 si Ollama échoue', async () => {
      fetch.mockRejectedValueOnce(new Error('Generation failed'));
      
      const response = await request(app)
        .post('/api/chat')
        .send({
          model: 'qwen2.5-coder:7b',
          prompt: 'Test prompt'
        });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur lors de la communication avec Ollama');
    });
  });
  
  describe('Validation des données', () => {
    test('devrait rejeter les requêtes avec un body vide', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({});
      
      expect(response.status).toBe(400);
    });
    
    test('devrait rejeter les requêtes avec des données invalides', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({
          model: '',
          prompt: ''
        });
      
      expect(response.status).toBe(400);
    });
  });
});