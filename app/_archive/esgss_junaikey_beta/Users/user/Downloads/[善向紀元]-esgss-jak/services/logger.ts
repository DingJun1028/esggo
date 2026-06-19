
import { BehaviorSubject } from 'rxjs';
import { KernelLog } from '../types';

/**
 * Global Kernel Log Stream
 * Optimized for high-frequency technical tracing across the AIOS.
 */
export const kernelLogs$ = new BehaviorSubject<KernelLog[]>([]);

const sanitizeMetadata = (meta: any): any => {
    if (meta === null || meta === undefined) return {};
    
    // If it's an Error, extract the useful parts
    if (meta instanceof Error) {
        return { 
            message: meta.message, 
            stack: meta.stack,
            name: meta.name
        };
    }

    // If it's not an object, wrap it
    if (typeof meta !== 'object') {
        return { value: String(meta) };
    }

    // If it's an object, sanitize its properties to avoid circularity or complex types
    const sanitized: any = {};
    const seen = new WeakSet();

    for (const key in meta) {
        try {
            const val = meta[key];
            
            if (val instanceof Error) {
                sanitized[key] = { 
                    message: val.message, 
                    name: val.name,
                    stack: val.stack 
                };
            } else if (val !== null && typeof val === 'object') {
                // Basic check for circularity
                if (seen.has(val)) {
                    sanitized[key] = "[Circular Reference]";
                    continue;
                }
                // Only track non-null objects
                if (val !== null) seen.add(val);
                
                // Shallow clone or summarize nested objects
                try {
                    sanitized[key] = Array.isArray(val) ? val.slice(0, 5).map(v => typeof v === 'object' ? '[Object]' : v) : { ...val };
                } catch (e) {
                    sanitized[key] = "[Complex Object]";
                }
            } else {
                sanitized[key] = val;
            }
        } catch (e) {
            sanitized[key] = "[Unserializable]";
        }
    }
    return sanitized;
};

export const logKernelEvent = (
    source: KernelLog['source'], 
    operation: string, 
    level: KernelLog['level'], 
    metadata: any = {}
) => {
    const sanitizedMeta = sanitizeMetadata(metadata);
    const log: KernelLog = {
        id: `klog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        source,
        operation,
        level,
        metadata: sanitizedMeta
    };

    const current = kernelLogs$.value;
    // Maintain a rolling window of 100 logs
    kernelLogs$.next([log, ...current].slice(0, 100));

    // Console output for development debugging
    const prefix = `[${source}] [${level}] ${operation}`;
    const metaStr = JSON.stringify(sanitizedMeta, null, 2);
    
    if (level === 'ERROR') {
        console.error(`${prefix}\n${metaStr}`);
    } else if (level === 'WARNING') {
        console.warn(`${prefix}\n${metaStr}`);
    } else {
        console.log(`${prefix}\n${metaStr}`);
    }
};
