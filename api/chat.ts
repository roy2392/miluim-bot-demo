import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

// Sample data for the chatbot (in production, this would come from a proper database)
const sampleData = [
  {
    title: "זכויות חיילי מילואים בעבודה",
    content: "חיילי מילואים זכאים להגנות שונות במקום העבודה. החוק אוסר על פיטורי עובד בשל שירות מילואים. המעסיק חייב לשמור על מקום העבודה של החייל למשך כל תקופת השירות. בנוסף, ימי המילואים נחשבים כימי עבודה לצורך חישוב ותק וזכויות סוציאליות. עובדים שנקראו למילואים זכאים לתגמולי מילואים מהביטוח הלאומי בגובה של עד 68% מהשכר הממוצע במשק.",
    url: "https://www.miluim.idf.il/articles/work-rights",
    category: "זכויות"
  },
  {
    title: "הטבות לחיילי מילואים - מדריך מלא",
    content: "חיילי מילואים זכאים למגוון הטבות: הנחה בארנונה של עד 5% לכל יום שירות, פטור מאגרת רישוי רכב לאחר 60 ימי שירות בשנה, הטבות במס הכנסה כולל נקודות זיכוי נוספות, הטבות בחינוך הגבוה כולל מענקי לימודים ותוספת זמן במבחנים, הנחות בתחבורה הציבורית, כניסה חינם לגנים לאומיים ושמורות טבע, והטבות נוספות מרשויות מקומיות.",
    url: "https://www.miluim.idf.il/articles/benefits-guide",
    category: "הטבות"
  },
  {
    title: "תהליך הגיוס למילואים - כל מה שצריך לדעת",
    content: "גיוס למילואים מתבצע באמצעות צו 8 שנשלח בדואר רשום או במסירה אישית. חייל שקיבל צו חייב להתייצב במועד ובמקום הנקובים בצו. ניתן לבקש דחיית שירות מסיבות מיוחדות כגון: אירוע משפחתי, מצב רפואי, נסיעה לחו״ל שתוכננה מראש, או לחץ בעבודה. בקשות דחייה יש להגיש מוקדם ככל האפשר דרך מערכת 'מילואים נט' או ביחידה.",
    url: "https://www.miluim.idf.il/articles/recruitment-process",
    category: "גיוס"
  }
];

function findRelevantContent(query: string): string {
  const lowerQuery = query.toLowerCase();
  const relevantArticles = sampleData.filter(article => 
    article.title.includes(query) || 
    article.content.includes(query) ||
    (lowerQuery.includes('זכויות') && article.category === 'זכויות') ||
    (lowerQuery.includes('הטבות') && article.category === 'הטבות') ||
    (lowerQuery.includes('גיוס') && article.category === 'גיוס')
  );

  if (relevantArticles.length === 0) {
    return sampleData.slice(0, 2).map(article => 
      `מקור: ${article.title}\nקישור: ${article.url}\n\n${article.content}`
    ).join('\n\n---\n\n');
  }

  return relevantArticles.map(article => 
    `מקור: ${article.title}\nקישור: ${article.url}\n\n${article.content}`
  ).join('\n\n---\n\n');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'הודעה נדרשת' });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'שגיאה: נדרש מפתח API של OpenAI. אנא הגדר את המפתח בקובץ .env' });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const context = findRelevantContent(message);

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

שאלת המשתמש: ${message}

אנא ענה על השאלה בהתבסס על המידע שסופק. אם רלוונטי, כלול קישורים למקורות.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'מצטער, לא הצלחתי לעבד את הבקשה.';
    
    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ 
      error: 'מצטער, נתקלתי בבעיה טכנית. אנא נסה שוב מאוחר יותר.' 
    });
  }
}