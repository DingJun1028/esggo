import { ILoggerService, LogContext } from './ILoggerService';
export declare class OmniLoggerService implements ILoggerService {
    private remoteEndpoint;
    constructor();
    private formatMessage;
    private sendToRemote;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error | unknown, context?: LogContext): void;
}
//# sourceMappingURL=OmniLoggerService.d.ts.map