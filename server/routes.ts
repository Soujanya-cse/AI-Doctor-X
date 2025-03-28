import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertHealthConditionSchema, insertChatMessageSchema } from "@shared/schema";
import { diseases, organs } from "./data/diseases";

export async function registerRoutes(app: Express): Promise<Server> {
  // Disease and organ data endpoints
  app.get('/api/diseases', (req, res) => {
    res.json({ diseases });
  });

  app.get('/api/organs', (req, res) => {
    res.json({ organs });
  });

  app.get('/api/disease/:id', (req, res) => {
    const disease = diseases.find(d => d.id === req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.json({ disease });
  });

  app.get('/api/organ/:id', (req, res) => {
    const organ = organs.find(o => o.id === req.params.id);
    if (!organ) {
      return res.status(404).json({ message: 'Organ not found' });
    }
    res.json({ organ });
  });

  // User management
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Health conditions
  app.post('/api/health-conditions', async (req, res) => {
    try {
      const conditionData = insertHealthConditionSchema.parse(req.body);
      // In a real app, we'd have a storage method for this
      // For demo, we'll just return the data
      res.status(201).json({ condition: conditionData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Failed to create health condition' });
    }
  });

  // Disease progression simulation
  app.get('/api/disease-progression/:diseaseId/:months', (req, res) => {
    const diseaseId = req.params.diseaseId;
    const months = parseInt(req.params.months);
    
    const disease = diseases.find(d => d.id === diseaseId);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }

    // Simulate disease progression over time
    const baseSeverity = disease.initialSeverity || 1;
    const progressionRate = disease.progressionRate || 0.5;
    const maxSeverity = 10;
    
    let severity = Math.min(maxSeverity, baseSeverity + (progressionRate * months));
    
    const progression = {
      diseaseId,
      diseaseName: disease.name,
      initialSeverity: baseSeverity,
      currentSeverity: severity,
      months,
      affectedOrgans: disease.affectedOrgans.map(organId => {
        const organ = organs.find(o => o.id === organId);
        return {
          organId,
          organName: organ?.name || 'Unknown Organ',
          severity: severity
        };
      }),
      recommendations: disease.recommendations || []
    };
    
    res.json({ progression });
  });

  // AI Chat functionality
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: 'Message is required' });
      }
      
      // Simple AI response logic - in a real app this would connect to an AI service
      let aiResponse = '';
      
      if (message.toLowerCase().includes('pain')) {
        aiResponse = "I understand you're experiencing pain. Can you describe the location and intensity of the pain?";
      } else if (message.toLowerCase().includes('treatment')) {
        aiResponse = "There are several treatment options available. Would you like me to explain the conservative approaches or medical interventions?";
      } else if (message.toLowerCase().includes('exercise')) {
        aiResponse = "Exercise can be beneficial for many conditions. For joint health, low-impact activities like swimming or cycling are often recommended.";
      } else {
        aiResponse = "Thank you for your message. Is there something specific about your health condition you'd like to know more about?";
      }
      
      // Save the message and response
      const timestamp = new Date().toISOString();
      
      // In a real app, we'd store these in the database
      // For demo, we'll just return the conversation
      
      res.json({
        userMessage: {
          content: message,
          isFromAI: false,
          timestamp
        },
        aiResponse: {
          content: aiResponse,
          isFromAI: true,
          timestamp: new Date(Date.now() + 1000).toISOString()
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to process chat message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
