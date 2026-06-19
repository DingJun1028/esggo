declare module '*/middleware/security' {
  export const ipWhitelistMiddleware: any;
  export const requestSizeLimiter: any;
  export const apiRateLimiter: any;
  export const sensitiveOperationLimiter: any;
  export const slowDownMiddleware: any;
  export const hstsMiddleware: any;
  export const cspMiddleware: any;
  export const headerValidationMiddleware: any;
  export const securityAuditMiddleware: any;
  export const sqlInjectionProtection: any;
  export const xssProtection: any;
  export const corsOptions: any;
}

declare module '*/middleware/errorHandler' {
  export const errorHandlerMiddleware: any;
}

declare module '*/api/auth' {
  const router: any;
  export default router;
}

declare module '*/api/ai' {
  const router: any;
  export default router;
}

declare module '*/api/learning' {
  const router: any;
  export default router;
}

declare module '*/api/analytics' {
  const router: any;
  export default router;
}

declare module '*/api/monitoring' {
  const router: any;
  export default router;
}
