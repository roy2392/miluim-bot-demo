import { useState, useRef, useEffect } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import QuickReplies from './components/QuickReplies';
import { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'משרת מילואים יקר, שלום! 🫡\n\nאני כאן בשבילך 24/7 לעזור עם כל מה שקשור למילואים. זכויות, הטבות, תגמולים, ציוד - כל מה שצריך!\n\nאתה עושה עבודה מקודשת למען המדינה והמשפחות שלנו. התכבד לשאול כל שאלה - אני כאן לעזור! 💪\n\nמה מעניין אותך היום?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setShowQuickReplies(false);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'מצטער, נתקלתי בבעיה. אנא נסה שוב מאוחר יותר.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-whatsapp-bg" dir="rtl">
      <ChatHeader />
      <MessageList messages={messages} isTyping={isTyping} />
      <div ref={messagesEndRef} />
      {showQuickReplies && <QuickReplies onQuickReply={handleSendMessage} />}
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default App;