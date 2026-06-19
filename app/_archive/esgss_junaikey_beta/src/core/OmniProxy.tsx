/**
 * 奧秘精靈 HOC (Omni Sprite Proxy HOC)
 *
 * 基於奧秘元件定義報告 V1.2 第二章
 * 攔截所有事件,實現埋點、熔斷、錯誤處理
 */

import React, { useMemo, useRef, forwardRef } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { CircuitBreaker } from './CircuitBreaker';

interface ProxyConfig {
  enableTracking?: boolean;
  enableCircuitBreaker?: boolean;
  nullSafety?: boolean;
}

/**
 * 奧秘精靈 HOC (Omni Proxy)
 *
 * 為任何 React 組件注入代理層
 */
export function withOmniProxy<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  config: ProxyConfig = {}
) {
  const { enableTracking = true, enableCircuitBreaker = true, nullSafety = false } = config;

  const ComponentWithProxy = forwardRef<any, P>((props, ref) => {
    const propsRef = useRef(props);
    propsRef.current = props;

    // Proxy Handler (穩定引用)
    const handler = useMemo(
      () => ({
        get(target: any, prop: string | symbol) {
          const value = Reflect.get(target, prop);

          // 攔截函數 (事件處理器)
          if (typeof value === 'function') {
            return (...args: unknown[]) => {
              const metadata = {
                component: WrappedComponent.displayName || WrappedComponent.name || 'Unknown',
                event: String(prop),
                timestamp: Date.now(),
              };

              // 埋點 (自我成長數據源)
              if (enableTracking && typeof window !== 'undefined') {
                // 觸發自定義事件
                window.dispatchEvent(
                  new CustomEvent('omni-interaction', {
                    detail: metadata,
                  })
                );
              }

              // 熔斷器檢查
              if (enableCircuitBreaker && CircuitBreaker.isOpen(metadata.component)) {
                console.warn(
                  `🚫 [OmniProxy] Circuit Open: ${metadata.component}.${metadata.event}`
                );
                return; // 阻止執行
              }

              try {
                const result = value.apply(target, args);

                // 異步錯誤捕獲
                if (result instanceof Promise) {
                  return result.catch((err: Error) => {
                    omniLogger.error(LogCategory.SYSTEM, '[OmniProxy] `[OmniProxy] Async Error:`', { error: err });
                    if (enableCircuitBreaker) {
                      CircuitBreaker.recordFailure(metadata.component);
                    }
                    throw err;
                  });
                }

                // 記錄成功
                if (enableCircuitBreaker) {
                  CircuitBreaker.recordSuccess(metadata.component);
                }

                return result;
              } catch (error) {
                omniLogger.error(LogCategory.SYSTEM, '[OmniProxy] `[OmniProxy] Sync Error:`', { error });
                if (enableCircuitBreaker) {
                  CircuitBreaker.recordFailure(metadata.component);
                }
                throw error;
              }
            };
          }

          // Null Safety
          if (value === undefined && nullSafety) {
            console.warn(`[OmniProxy] Missing prop: ${String(prop)}`);
            return null;
          }

          return value;
        },
      }),
      [enableTracking, enableCircuitBreaker, nullSafety]
    );

    // 創建代理 Props (穩定引用)
    const proxiedProps = useMemo(() => new Proxy(props, handler), [props, handler]);

    return <WrappedComponent {...(proxiedProps as P)} ref={ref} />;
  });

  ComponentWithProxy.displayName = `OmniProxy(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ComponentWithProxy;
}
