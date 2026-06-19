import React, { useEffect } from 'react';

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

export const AutoAiReplyAgent: React.FC = () => {
  useEffect(() => {
    // This component was simplified to remove server-side dependencies
    // that were causing build errors. The AI Reply functionality
    // will be implemented through a different architecture in future phases.

    omniLogger.info(LogCategory.SYSTEM, '[AutoAiReplyAgent] [AutoAiReplyAgent] Initialized (placeholder)');

    return () => {
      omniLogger.info(LogCategory.SYSTEM, '[AutoAiReplyAgent] [AutoAiReplyAgent] Cleanup');
    };
  }, []);

  return null; // Headless component
};
