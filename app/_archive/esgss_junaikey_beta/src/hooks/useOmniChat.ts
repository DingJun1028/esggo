import { useState, useCallback } from 'react';
import { OmniKey, IVerifiedResponse } from '../omni/core/OmniKey';
import { omniLogger, LogCategory } from '../services/omniLogger';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'omni';
  content: string;
  timestamp: string;
  verifiedCore?: IVerifiedResponse['core']; // For Omni messages
  isTyping?: boolean;
}

export const useOmniChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'omni',
      content: 'Awakening Sequence Complete. I am ready. (System V2.0)',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsProcessing(true);

    try {
      // 2. Call OmniKey (Unlock)
      const omniKey = OmniKey.getInstance();
      const response = await omniKey.unlock(content);

      // 3. Add Omni Response
      const omniMsg: ChatMessage = {
        id: `omni-${Date.now()}`,
        sender: 'omni',
        content: response.message,
        timestamp: new Date().toISOString(),
        verifiedCore: response.core,
      };
      setMessages(prev => [...prev, omniMsg]);
    } catch (error) {
      omniLogger.error(LogCategory.AGENT, 'OmniChat Error', { error });
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'omni',
        content: 'System Dissonance Detected. Unable to process request.',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    sendMessage,
    isProcessing,
    clearChat,
  };
};
