import React, { useState } from 'react';
import { Send } from 'lucide-react';

const AiAssistantBox: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content:
        'I am the Guardian of the 4T Protocol. Ask me anything about the data on this dashboard.',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          content: 'Analyzing the chain of trust... Found valid anchor for March data.',
        },
      ]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-gray-400 text-xs font-bold uppercase">AI Guardian (Oracle)</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about anomalies..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-600 rounded text-white hover:bg-blue-500"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default AiAssistantBox;
