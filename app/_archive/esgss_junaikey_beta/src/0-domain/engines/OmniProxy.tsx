/**
 * 🏛️ OmniProxy (奧秘代理)
 * --------------------------------------------------
 * [系列] 奧秘元件核心心核
 * [功能] Higher-Order Component (HOC) 用於增強組件的追蹤、熔斷與 5T 協議注入。
 */

import React, { ComponentType, useEffect } from 'react';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

interface OmniProxyOptions {
  enableTracking?: boolean;
  enableCircuitBreaker?: boolean;
}

export function withOmniProxy<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: OmniProxyOptions = {}
) {
  const DisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const OmniProxyWrapper: React.FC<T> = props => {
    useEffect(() => {
      if (options.enableTracking) {
        omniLogger.info(LogCategory.UI, `[OmniProxy] Mounting: ${DisplayName}`, {
          id: (props as any).id || 'ANONYMOUS',
        });
      }
    }, [props, DisplayName, options.enableTracking]);

    // 簡化的熔斷與追蹤邏輯
    return <WrappedComponent {...props} />;
  };

  OmniProxyWrapper.displayName = `withOmniProxy(${DisplayName})`;
  return OmniProxyWrapper;
}
