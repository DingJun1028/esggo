import type { OmniLoggerService } from './OmniLogger';

declare global {
  var omniLogger: OmniLoggerService;
  var logKernelEvent: typeof import('./OmniLogger').logKernelEvent;
  var kernelLogs$: typeof import('./OmniLogger').kernelLogs$;

  interface Window {
    omniLogger: OmniLoggerService;
    logKernelEvent: typeof import('./OmniLogger').logKernelEvent;
    kernelLogs$: typeof import('./OmniLogger').kernelLogs$;
  }
}

export {};
