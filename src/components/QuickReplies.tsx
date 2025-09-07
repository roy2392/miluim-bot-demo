import React from 'react';

interface QuickRepliesProps {
  onQuickReply: (message: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onQuickReply }) => {
  const quickReplies = [
    'זכויות בעבודה',
    'הטבות כספיות',
    'תגמולי מילואים',
    'ציוד ולוגיסטיקה',
    'בריאות ורפואה',
    'פטור ודחיות',
    'משפחה וילדים',
    'הכנה לשירות'
  ];

  return (
    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200" dir="rtl">
      <p className="text-xs text-gray-600 mb-2 text-right">נושאים פופולריים:</p>
      <div className="flex flex-wrap gap-2 justify-end">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onQuickReply(reply)}
            className="px-3 py-1 bg-whatsapp-light text-gray-700 text-sm rounded-full hover:bg-whatsapp-green hover:text-white transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;