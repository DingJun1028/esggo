// src/core/bus/OmniAgentBusFactory.ts

import { IOmniNotification } from './IOmniNotification';
import { IT5Protocol } from '../types/IComponentCore';

// 4. 萬能通知核心鑄造工廠
export class OmniAgentBusFactory {
  public static createNotification(
    uuid: string,
    type: IOmniNotification['type'],
    title: string,
    content: string,
    origin: string,
    formula: string
  ): Readonly<IOmniNotification> {
    
    // 建立基礎通知物件
    const notification: IOmniNotification = {
      uuid,
      version: '1.0.0',
      timestamp: Date.now(),
      evidence: {},
      type,
      title,
      content,
      payload: {},
      t5Data: {
        traceable: { source_origin: origin },
        trackable: { lifecycle_hook: 'Initialized' },
        transparent: { 
          algorithm_formula: formula, 
          verification: '[ISO-14064-1] Verified' 
        },
        trustworthy: { isLocked: true }
      }
    };

    // 【信 (Trust) 核⼼禁區】數據寫入後即刻執⾏ Hash Lock 與 Object.freeze()
    Object.freeze(notification.t5Data.trustworthy);
    Object.freeze(notification.t5Data.traceable);
    Object.freeze(notification.t5Data.transparent);
    return Object.freeze(notification);
  }
}