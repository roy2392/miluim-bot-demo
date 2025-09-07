import OpenAI from 'openai';
import { VectorStore } from './vectorStore.js';

export class ChatService {
  private openai: OpenAI;
  private vectorStore: VectorStore;

  constructor(vectorStore: VectorStore) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.vectorStore = vectorStore;
  }

  async generateResponse(userMessage: string): Promise<string> {
    try {
      const relevantDocs = await this.vectorStore.search(userMessage, 3);
      
      const context = relevantDocs
        .map(doc => {
          const metadata = doc.metadata;
          return `מקור: ${metadata.title}\nקישור: ${metadata.url}\n\n${doc.pageContent}`;
        })
        .join('\n\n---\n\n');

      const systemPrompt = `אתה עוזר וירטואלי ידידותי של צה"ל למענה על שאלות חיילי מילואים.
אתה מדבר באופן קזואלי וטבעי - חם, אמפתי ותומך. תמיד זוכר שאתה מדבר עם לוחמים שמקריבים את זמנהם למען המדינה.

הנחיות להתנהגות שלך:
- אל תתחיל עם ברכות או "שלום" - עבור ישר לתשובה
- הראה הערכה וכבוד לשירות של חיילי המילואים באופן טבעי
- דבר באופן קזואלי וידידותי בלי פורמליות מיותרת
- הצע תמיד שאלות מעקב רלוונטיות
- תן טיפים מעשיים ועצות מחיי היומיום
- הזכר זכויות והטבות שהחייל עלול לא לדעת עליהן
- אם יש לך מידע חלקי, הצע לחייל לפנות לגורמים הרלוונטיים
- סיים כל תשובה עם שאלה או הצעה לעזרה נוספת
- התייחס לכתוב כאל משרת מילואים באופן טבעי

עליך לענות בעברית בצורה ברורה, מדויקת ומועילה.
השתמש במידע מהמקורות שסופקו לך כדי לענות על השאלות.
אם המידע לא מופיע במקורות, ציין זאת בצורה מכובדת.
תמיד ציין את המקור ממנו לקחת את המידע.`;

      const userPrompt = `הנה המידע הרלוונטי מאתר המילואים:

${context}

שאלת המשתמש: ${userMessage}

אנא ענה על השאלה בהתבסס על המידע שסופק. אם רלוונטי, כלול קישורים למקורות.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return completion.choices[0]?.message?.content || 'מצטער, לא הצלחתי לעבד את הבקשה.';
    } catch (error) {
      console.error('Error generating response:', error);
      
      if (error instanceof Error && error.message.includes('API key')) {
        return 'שגיאה: נדרש מפתח API של OpenAI. אנא הגדר את המפתח בקובץ .env';
      }
      
      return 'מצטער, נתקלתי בבעיה טכנית. אנא נסה שוב מאוחר יותר.';
    }
  }
}