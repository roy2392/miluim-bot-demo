import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`} dir="rtl">
      <div
        className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${
          isUser
            ? 'bg-whatsapp-light text-black rounded-tr-none'
            : 'bg-white text-black rounded-tl-none'
        }`}
        style={{ direction: 'rtl', textAlign: 'right' }}
      >
        <div className="whitespace-pre-wrap break-words">{message.text}</div>
        <div className={`text-xs ${isUser ? 'text-gray-600' : 'text-gray-500'} mt-1`}>
          {time}
        </div>
        <div
          className={`absolute top-0 ${
            isUser ? '-left-2' : '-right-2'
          } w-0 h-0 border-t-8 ${
            isUser
              ? 'border-t-whatsapp-light border-r-8 border-r-transparent'
              : 'border-t-white border-l-8 border-l-transparent'
          }`}
        />
      </div>
    </div>
  );
};

export default MessageBubble;