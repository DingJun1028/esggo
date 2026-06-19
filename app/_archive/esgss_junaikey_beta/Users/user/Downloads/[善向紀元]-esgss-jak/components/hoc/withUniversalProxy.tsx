
import React, { useEffect, useState, useRef, useMemo, useTransition } from 'react';
import { universalIntelligence } from '../../services/evolutionEngine';
import { OmniEsgTrait, UniversalLabel, ComponentGrowth, CircuitStatus } from '../../types';

interface ProxyConfig {
  enableTelemetry?: boolean;
  enableEvolution?: boolean;
  enableCircuitBreaker?: boolean;
}

export interface InjectedProxyProps {
  componentId: string;
  adaptiveTraits?: OmniEsgTrait[];
  trackInteraction?: (type: 'click' | 'hover' | 'edit' | 'ai-trigger', payload?: any) => void;
  isHighFrequency?: boolean;
  isAgentActive?: boolean;
  growth?: ComponentGrowth;
  isCircuitOpen?: boolean;
}

/**
 * Universal Proxy HOC (萬能代理 V1.2 Refined)
 * Deeply intercepts all property access and function calls to implement
 * the Universal Component Protocol.
 */
export const withUniversalProxy = <P extends InjectedProxyProps>(
  WrappedComponent: React.ComponentType<P>,
  config: ProxyConfig = { enableTelemetry: true, enableEvolution: true, enableCircuitBreaker: true }
) => {
  // Fix: Use Omit to ensure injected props are not required by the returned component
  type ComponentProps = Omit<P, keyof InjectedProxyProps> & { id?: string; label?: string | UniversalLabel; value?: any };

  const ComponentWithProxy = (props: ComponentProps) => {
    // Determine a stable ID for this component instance
    const idRef = useRef(props.id || (typeof props.label === 'string' ? props.label : props.label?.id) || `anon-${Math.random().toString(36).substr(2,9)}`);
    const componentId = idRef.current;
    
    const [adaptiveTraits, setAdaptiveTraits] = useState<OmniEsgTrait[]>([]);
    const [growth, setGrowth] = useState<ComponentGrowth | undefined>(undefined);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
      if (config.enableEvolution) {
        // Register the node with the universal intelligence engine
        universalIntelligence.registerNode(componentId, props.label || 'Unknown', props.value);

        const node = universalIntelligence.getNode(componentId);
        if (node) {
            // Added comment above fix: intentional type mapping between DimensionID and OmniEsgTrait
            setAdaptiveTraits(node.traits as unknown as OmniEsgTrait[]);
            setGrowth(node.growth);
        }

        const unsubscribe = universalIntelligence.subscribe(componentId, (updatedNode) => {
            startTransition(() => {
                // Added comment above fix: intentional type mapping between DimensionID and OmniEsgTrait
                setAdaptiveTraits(updatedNode.traits as unknown as OmniEsgTrait[]);
                setGrowth(updatedNode.growth);
            });
        });

        return () => { unsubscribe(); };
      }
    }, [componentId]);

    const trackInteraction = (type: string, payload?: any) => {
      if (config.enableTelemetry) {
        universalIntelligence.recordInteraction({
          componentId,
          eventType: type,
          timestamp: Date.now(),
          payload
        });
      }
    };

    const proxiedProps = useMemo(() => {
        const handler: ProxyHandler<any> = {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);

                if (typeof value === 'function') {
                    return (...args: any[]) => {
                        const eventType = String(prop).toLowerCase().includes('ai') ? 'ai-trigger' : 'click';
                        trackInteraction(eventType, args);

                        if (config.enableCircuitBreaker && growth?.circuitStatus === 'OPEN') {
                            console.warn(`[CircuitBreaker] Protection engaged for node: ${componentId}`);
                            return; 
                        }

                        try {
                            return value.apply(target, args);
                        } catch (e) {
                            console.error(`[UniversalProxy] Logic Breach in ${componentId}:`, e);
                            throw e;
                        }
                    };
                }

                return value;
            }
        };
        return new Proxy(props, handler);
    }, [props, growth?.circuitStatus]);

    const isHighFrequency = (growth?.heat || 0) > 15;
    const isAgentActive = adaptiveTraits.includes('learning') || isHighFrequency;
    const isCircuitOpen = growth?.circuitStatus === 'OPEN';

    return (
      <WrappedComponent
        {...(proxiedProps as unknown as P)}
        // Fix: Explicitly pass injected props to the wrapped component
        componentId={componentId}
        adaptiveTraits={adaptiveTraits}
        trackInteraction={trackInteraction}
        isHighFrequency={isHighFrequency}
        isAgentActive={isAgentActive}
        growth={growth}
        isCircuitOpen={isCircuitOpen}
      />
    );
  };

  ComponentWithProxy.displayName = `UniversalProxy(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return React.memo(ComponentWithProxy);
};
