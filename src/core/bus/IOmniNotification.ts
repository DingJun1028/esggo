// src/core/bus/IOmniNotification.ts

import { IComponentCore, IT5Protocol } from '../types/IComponentCore';

// 3. OmniAgentBus 通知實體定義
export interface IOmniNotification extends IComponentCore {
  type: 'system' | 'agent_task' | 'security' | 'evolution';
  title: string;
  content: string;
  payload: unknown;
  t5Data: IT5Protocol;
}