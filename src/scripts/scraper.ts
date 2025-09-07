import axios from 'axios';
import * as cheerio from 'cheerio';
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

class MiluimScraper {
  private baseUrl = 'https://www.miluim.idf.il';
  private articles: Article[] = [];

  async scrapeMainPage(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/articles-list/`);
      const $ = cheerio.load(response.data);
      const articleLinks: string[] = [];

      $('a[href*="/articles/"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`;
          if (!articleLinks.includes(fullUrl)) {
            articleLinks.push(fullUrl);
          }
        }
      });

      console.log(`Found ${articleLinks.length} article links`);
      return articleLinks;
    } catch (error) {
      console.error('Error scraping main page:', error);
      return [];
    }
  }

  async scrapeArticle(url: string): Promise<Article | null> {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const title = $('h1').first().text().trim() || 
                   $('title').text().trim() ||
                   'ללא כותרת';

      const content = $('article').text().trim() ||
                     $('.content').text().trim() ||
                     $('main').text().trim() ||
                     $('body').text().trim();

      const category = $('.category').text().trim() ||
                      $('.breadcrumb li').last().text().trim() ||
                      'כללי';

      const date = $('.date').text().trim() ||
                  $('time').attr('datetime') ||
                  new Date().toISOString();

      return {
        title,
        content: content.substring(0, 10000),
        url,
        category,
        date,
      };
    } catch (error) {
      console.error(`Error scraping article ${url}:`, error);
      return null;
    }
  }

  async scrapeAll(): Promise<void> {
    console.log('Starting scraping process...');
    
    const articleLinks = await this.scrapeMainPage();
    
    for (let i = 0; i < Math.min(articleLinks.length, 50); i++) {
      console.log(`Scraping article ${i + 1}/${Math.min(articleLinks.length, 50)}: ${articleLinks[i]}`);
      const article = await this.scrapeArticle(articleLinks[i]);
      
      if (article) {
        this.articles.push(article);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await this.saveData();
  }

  async saveData(): Promise<void> {
    const dataDir = path.join(__dirname, '../../data');
    await fs.mkdir(dataDir, { recursive: true });
    
    const filePath = path.join(dataDir, 'miluim_articles.json');
    await fs.writeFile(filePath, JSON.stringify(this.articles, null, 2));
    
    console.log(`Saved ${this.articles.length} articles to ${filePath}`);
  }
}

const scraper = new MiluimScraper();
scraper.scrapeAll().catch(console.error);