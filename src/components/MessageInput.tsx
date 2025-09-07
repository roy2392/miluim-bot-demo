import React, { useState, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-100 px-4 py-3 border-t border-gray-200" dir="rtl">
      <div className="flex items-center space-x-2">
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a3 3 0 006 0V7a3 3 0 00-3-3zm0-1a4 4 0 00-4 4v4a4 4 0 008 0V7a4 4 0 00-4-4z" clipRule="evenodd" />
            <path d="M2 7a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1zm14 0a1 1 0 011-1 1 1 0 010 2 1 1 0 01-1-1z" />
          </svg>
        </button>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="הקלד הודעה..."
          className="flex-1 px-4 py-2 rounded-full bg-white border border-gray-300 focus:outline-none focus:border-whatsapp-green"
          style={{ direction: 'rtl', textAlign: 'right' }}
        />
        
        <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button
          onClick={handleSend}
          className="p-2 bg-whatsapp-green text-white rounded-full hover:bg-whatsapp-darkgreen transition-colors"
        >
          <svg className="w-6 h-6 rotate-180" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;