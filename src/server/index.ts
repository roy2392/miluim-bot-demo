import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { VectorStore } from './vectorStore';
import { ChatService } from './chatService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let chatService: ChatService;
let isInitialized = false;

async function initializeServices() {
  try {
    console.log('Initializing services...');
    const vectorStore = new VectorStore();
    await vectorStore.initialize();
    chatService = new ChatService(vectorStore);
    isInitialized = true;
    console.log('Services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({ 
        error: 'השירות עדיין בתהליך אתחול. אנא נסה שוב בעוד מספר שניות.' 
      });
    }

    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'הודעה נדרשת' });
    }

    const response = await chatService.generateResponse(message);
    res.json({ response });
  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ 
      error: 'מצטער, נתקלתי בבעיה. אנא נסה שוב מאוחר יותר.' 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: isInitialized ? 'ready' : 'initializing',
    timestamp: new Date().toISOString()
  });
});

initializeServices().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});