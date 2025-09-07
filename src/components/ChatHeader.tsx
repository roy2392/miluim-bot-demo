import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-whatsapp-darkgreen text-white p-4 flex items-center shadow-md" dir="rtl">
      <div className="flex items-center flex-1">
        <img 
          src="https://static.wixstatic.com/media/628bcf_bc9a0e85381e4f1a913cb29805724602~mv2.png" 
          alt="IDF Miluim Logo" 
          className="w-10 h-10 rounded-full ml-3 bg-white p-1"
        />
        <div className="text-right">
          <h2 className="font-semibold">בוט מילואים צה"ל</h2>
          <p className="text-xs text-green-100">מקוון</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="p-2 hover:bg-whatsapp-green rounded-full transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </button>
        <button className="p-2 hover:bg-whatsapp-green rounded-full transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;