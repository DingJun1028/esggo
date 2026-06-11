/**
 * ESGGO OmniAssistant Types - v1.1
 */

export type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';
export type AssistantSize = 'sm' | 'md' | 'lg';
export type AssistantColor = 'berkeley-blue' | 'california-gold' | 'glow-cyan' | 'glow-emerald';

export interface AssistantPosition {
  x: number;
  y: number;
}

export interface OmniAssistantProps {
  variant?: 'compact' | 'expanded';
  position?: AssistantPosition;
  size?: AssistantSize;
  color?: AssistantColor;
  initialState?: AssistantState;
  autoCollapse?: boolean;
  allowDrag?: boolean;
  onPositionChange?: (position: AssistantPosition) => void;
  onStateChange?: (state: AssistantState) => void;
}

export interface OmniAssistantOrbProps {
  size?: AssistantSize;
  color?: AssistantColor;
  state: AssistantState;
  onClick?: () => void;
  onLongPress?: () => void;
  onDrag?: (position: AssistantPosition) => void;
  onDragEnd?: (position: AssistantPosition) => void;
}

export interface OmniAssistantChatProps {
  open: boolean;
  onClose: () => void;
  state: AssistantState;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  onSendMessage: (message: string) => void;
}