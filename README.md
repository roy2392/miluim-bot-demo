# מילואים צ'אט - IDF Reserve Chatbot

צ'אטבוט מבוסס RAG (Retrieval-Augmented Generation) לחיילי מילואים בצה"ל עם ממשק משתמש בסגנון WhatsApp.

## תכונות

- ממשק משתמש בסגנון WhatsApp
- RAG מבוסס על תוכן מאתר מילואים צה"ל
- תמיכה מלאה בעברית
- חיפוש וקטורי למציאת מידע רלוונטי
- תשובות מבוססות AI עם OpenAI GPT

## התקנה

1. שכפל את הפרויקט:
```bash
git clone https://github.com/yourusername/miloaim-chat.git
cd miloaim-chat
```

2. התקן תלויות:
```bash
npm install
```

3. צור קובץ `.env` והוסף את מפתח ה-API של OpenAI:
```bash
cp .env.example .env
# ערוך את הקובץ .env והוסף את המפתח שלך
```

4. רוץ את הסקרייפר לאיסוף נתונים (פעם ראשונה):
```bash
npm run scrape
```

## הפעלה

1. הפעל את השרת:
```bash
npm run server
```

2. בטרמינל נפרד, הפעל את האפליקציה:
```bash
npm run dev
```

3. פתח את הדפדפן בכתובת: http://localhost:5173

## מבנה הפרויקט

```
miloaim-chat/
├── src/
│   ├── components/      # React components (WhatsApp UI)
│   ├── server/          # Express server + RAG logic
│   ├── scripts/         # Web scraper
│   └── types.ts         # TypeScript types
├── data/                # Scraped data + vector store
└── package.json
```

## טכנולוגיות

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express, Node.js
- **AI/RAG**: OpenAI GPT, LangChain, HNSWLib
- **Web Scraping**: Cheerio, Axios

## הערות

- הפרויקט דורש מפתח API של OpenAI
- הסקרייפר אוסף עד 50 מאמרים כברירת מחדל
- הוקטור סטור נשמר לוקלית ב-`data/vectorstore`