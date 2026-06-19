import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  sender: 'User' | 'System';
  content: string;
  type: 'text' | 'code' | 'alert';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ sender, content, type }) => {
  const isSystem = sender === 'System';

  return (
    <motion.div
      initial={{ opacity: 0, x: isSystem ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex ${isSystem ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`p-4 rounded-lg border text-sm max-w-[80%] shadow-2xl ${
          isSystem
            ? 'border-green-800 bg-green-950/20 text-green-100 shadow-green-500/5'
            : 'border-blue-800 bg-blue-950/20 text-blue-100 shadow-blue-500/5'
        }`}
      >
        {type === 'code' ? (
          <pre className="font-mono text-xs text-green-400 overflow-x-auto">{content}</pre>
        ) : (
          <div className="whitespace-pre-wrap">{content}</div>
        )}
      </div>
    </motion.div>
  );
};
