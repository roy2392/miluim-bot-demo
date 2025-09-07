import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Article {
  title: string;
  content: string;
  url: string;
  category?: string;
  date?: string;
}

export class VectorStore {
  private vectorStore: HNSWLib | null = null;
  private embeddings: OpenAIEmbeddings;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async initialize(): Promise<void> {
    const vectorStorePath = path.join(__dirname, '../../data/vectorstore');
    
    try {
      console.log('Loading existing vector store...');
      this.vectorStore = await HNSWLib.load(vectorStorePath, this.embeddings);
      console.log('Vector store loaded successfully');
    } catch (error) {
      console.log('No existing vector store found, creating new one...');
      await this.createVectorStore();
    }
  }

  async createVectorStore(): Promise<void> {
    const dataPath = path.join(__dirname, '../../data/miluim_articles.json');
    
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      const articles: Article[] = JSON.parse(data);
      
      const documents = articles.map(article => {
        const pageContent = `כותרת: ${article.title}\n\nתוכן: ${article.content}`;
        
        return new Document({
          pageContent,
          metadata: {
            title: article.title,
            url: article.url,
            category: article.category || 'כללי',
            date: article.date || new Date().toISOString(),
          },
        });
      });

      console.log(`Creating vector store with ${documents.length} documents...`);
      this.vectorStore = await HNSWLib.fromDocuments(documents, this.embeddings);
      
      const vectorStorePath = path.join(__dirname, '../../data/vectorstore');
      await this.vectorStore.save(vectorStorePath);
      console.log('Vector store created and saved successfully');
    } catch (error) {
      console.error('Error creating vector store:', error);
      this.vectorStore = await HNSWLib.fromDocuments([], this.embeddings);
    }
  }

  async search(query: string, k: number = 3): Promise<Document[]> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    const results = await this.vectorStore.similaritySearch(query, k);
    return results;
  }

  async addDocument(article: Article): Promise<void> {
    if (!this.vectorStore) {
      throw new Error('Vector store not initialized');
    }

    const document = new Document({
      pageContent: `כותרת: ${article.title}\n\nתוכן: ${article.content}`,
      metadata: {
        title: article.title,
        url: article.url,
        category: article.category || 'כללי',
        date: article.date || new Date().toISOString(),
      },
    });

    await this.vectorStore.addDocuments([document]);
    
    const vectorStorePath = path.join(__dirname, '../../data/vectorstore');
    await this.vectorStore.save(vectorStorePath);
  }
}