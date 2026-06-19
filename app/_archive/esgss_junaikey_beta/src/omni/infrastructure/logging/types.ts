import { OmniLoggerService, logKernelEvent as logEvent, kernelLogs$ as logs$ } from './OmniLogger.ts';

/*
declare global {
  var omniLogger: any;
  var logKernelEvent: typeof logEvent;
  var kernelLogs$: typeof logs$;

  interface Window {
    omniLogger: any;
    logKernelEvent: typeof logEvent;
    kernelLogs$: typeof logs$;
  }
}
*/

export {};
