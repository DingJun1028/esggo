// Authentication and Authorization - M8 Security Governance Module
import React from 'react';
import { BehaviorSubject } from 'rxjs';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

// User Role Enum
export enum UserRole {
  ADMIN = 'ADMIN',
  ESG_MANAGER = 'ESG_MANAGER',
  ANALYST = 'ANALYST',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER',
  GUEST = 'GUEST',
}

// Permission Enum
export enum Permission {
  // Admin Permissions
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  USER_MANAGEMENT = 'USER_MANAGEMENT',

  // ESG Permissions
  VIEW_MY_ESG = 'VIEW_MY_ESG',
  VIEW_MY_NORTH_STAR = 'VIEW_MY_NORTH_STAR',
  EDIT_ESG_DATA = 'EDIT_ESG_DATA',
  APPROVE_ESG_REPORTS = 'APPROVE_ESG_REPORTS',

  // Dashboard Permissions
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  CREATE_DASHBOARD = 'CREATE_DASHBOARD',
  EDIT_DASHBOARD = 'EDIT_DASHBOARD',
  DELETE_DASHBOARD = 'DELETE_DASHBOARD',
  SHARE_DASHBOARD = 'SHARE_DASHBOARD',

  // Analytics Permissions
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  RUN_ANALYSIS = 'RUN_ANALYSIS',
  EXPORT_DATA = 'EXPORT_DATA',

  // Audit Permissions
  VIEW_AUDIT = 'VIEW_AUDIT',
  GENERATE_AUDIT_REPORT = 'GENERATE_AUDIT_REPORT',

  // Enterprise Service Permissions
  VIEW_ENTERPRISE_SERVICES = 'VIEW_ENTERPRISE_SERVICES',
  MANAGE_ENTERPRISE_DATA = 'MANAGE_ENTERPRISE_DATA',

  // Omni System Permissions
  VIEW_OMNI_AGENT = 'VIEW_OMNI_AGENT',
  VIEW_ARCHITECT_CONSOLE = 'VIEW_ARCHITECT_CONSOLE',
  VIEW_FIREWALL_GUARDIAN = 'VIEW_FIREWALL_GUARDIAN',
  VIEW_SITUATION_LOGS = 'VIEW_SITUATION_LOGS',
  VIEW_OMNIPOTENT_MATRIX = 'VIEW_OMNIPOTENT_MATRIX',
  VIEW_OMNI_MODULE_12A = 'VIEW_OMNI_MODULE_12A',
  VIEW_ESG_WAR_ROOM = 'VIEW_ESG_WAR_ROOM',
  VIEW_ANNUAL_REPORT_GENERATOR = 'VIEW_ANNUAL_REPORT_GENERATOR',
  VIEW_GENESIS_PRIME_OS = 'VIEW_GENESIS_PRIME_OS',
  VIEW_OMNI_CONTEXT_ENGINE = 'VIEW_OMNI_CONTEXT_ENGINE',
  VIEW_OMNI_SOVEREIGN_GOVERNANCE = 'VIEW_OMNI_SOVEREIGN_GOVERNANCE',
  VIEW_FOUNDATIONAL_INTELLIGENCE = 'VIEW_FOUNDATIONAL_INTELLIGENCE',
}

// Role Permissions Map
export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),
  [UserRole.ESG_MANAGER]: [
    Permission.VIEW_MY_ESG,
    Permission.EDIT_ESG_DATA,
    Permission.APPROVE_ESG_REPORTS,
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_DASHBOARD,
    Permission.EDIT_DASHBOARD,
    Permission.SHARE_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.RUN_ANALYSIS,
    Permission.EXPORT_DATA,
    Permission.VIEW_ENTERPRISE_SERVICES,
    Permission.MANAGE_ENTERPRISE_DATA,
    Permission.VIEW_ESG_WAR_ROOM,
    Permission.VIEW_ANNUAL_REPORT_GENERATOR,
    Permission.VIEW_GENESIS_PRIME_OS,
    Permission.VIEW_OMNI_CONTEXT_ENGINE,
    Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.ANALYST]: [
    Permission.VIEW_MY_ESG,
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_DASHBOARD,
    Permission.EDIT_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.RUN_ANALYSIS,
    Permission.EXPORT_DATA,
    Permission.VIEW_OMNI_CONTEXT_ENGINE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.AUDITOR]: [
    Permission.VIEW_AUDIT,
    Permission.GENERATE_AUDIT_REPORT,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_OMNI_AGENT,
    Permission.VIEW_ARCHITECT_CONSOLE,
    Permission.VIEW_SITUATION_LOGS,
    Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.VIEWER]: [
    Permission.VIEW_MY_NORTH_STAR,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.GUEST]: [Permission.VIEW_MY_NORTH_STAR],
};

// User Interface
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  companyId?: string;
  department?: string;
  position?: string;
  lastLogin?: number;
  isActive: boolean;
  mfaEnabled: boolean;
  passwordLastChanged?: number;
  loginAttempts: number;
  lockedUntil?: number;
  profile: {
    phone?: string;
    timezone: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  metadata: {
    createdAt: number;
    updatedAt: number;
    createdBy?: string;
    lastPasswordReset?: number;
  };
}

// Auth Token Interface
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
  scope: string[];
}

// Auth State Interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
}

// Auth Event Type
export enum AuthEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
}

// Auth Config
export interface AuthConfig {
  sessionTimeout: number; // Minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // Minutes
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number; // N times
  };
  mfaRequired: boolean;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
}

// Auth Service Class
export class AuthService {
  private static instance: AuthService;
  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null,
    lastActivity: Date.now(),
  });

  private config: AuthConfig;
  private sessionCheckInterval?: NodeJS.Timeout;
  private subscribers: Map<string, ((event: AuthEventType, data?: any) => void)[]> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    if (process.env.NODE_ENV === 'production' && !this.config.jwtSecret) {
      throw new Error('Security configuration missing: VITE_JWT_SECRET is required in production.');
    }
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Observable
  get authState() {
    return this.authState$.asObservable();
  }

  // Current State
  get currentState(): AuthState {
    return this.authState$.value;
  }

  // Login
  async login(credentials: {
    email: string;
    password: string;
    mfaCode?: string;
    rememberMe?: boolean;
  }): Promise<{ success: boolean; error?: string; requiresMfa?: boolean }> {
    this.setLoading(true);

    try {
      // Mock API Call
      const response = await this.mockLoginAPI(credentials);

      if (response.success) {
        const { user, token } = response.data!;

        // Update State
        this.authState$.next({
          ...this.authState$.value,
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
          error: null,
          lastActivity: Date.now(),
        });

        // Store Tokens
        this.storeTokens(token, credentials.rememberMe);

        // Start Session Check
        this.startSessionCheck();

        // Emit Event
        this.emitEvent(AuthEventType.LOGIN_SUCCESS, { user });
        omniLogger.info(LogCategory.SECURITY, `User login successful: ${user.email}`, {
          userId: user.id,
        });

        return { success: true };
      } else {
        // Login Failed
        if (response.requiresMfa) {
          omniLogger.info(LogCategory.SECURITY, `MFA required for user: ${credentials.email}`);
          return { success: false, requiresMfa: true };
        }

        omniLogger.warn(LogCategory.SECURITY, `Login failed for user: ${credentials.email}`, {
          reason: response.error,
        });
        this.emitEvent(AuthEventType.LOGIN_FAILED, { reason: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      this.setError(errorMessage);
      this.emitEvent(AuthEventType.LOGIN_FAILED, { reason: errorMessage });
      return { success: false, ...(errorMessage ? { error: errorMessage } : {}) };
    } finally {
      this.setLoading(false);
    }
  }

  // Logout
  async logout(): Promise<void> {
    // Clear Local Tokens
    this.clearStoredTokens();

    // Stop Session Check
    this.stopSessionCheck();

    // Reset State
    this.authState$.next({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      lastActivity: Date.now(),
    });

    // Emit Event
    const userId = this.currentState.user?.id;
    this.emitEvent(AuthEventType.LOGOUT);
    omniLogger.info(LogCategory.SECURITY, 'User logged out', { userId });
  }

  // Refresh Token
  async refreshToken(): Promise<boolean> {
    const currentToken = this.currentState.token;
    if (!currentToken?.refreshToken) {
      return false;
    }

    try {
      // Mock Refresh API
      const response = await this.mockRefreshTokenAPI(currentToken.refreshToken);

      if (response.success) {
        const newToken = response.data!;

        // Update State
        this.authState$.next({
          ...this.authState$.value,
          token: newToken,
          lastActivity: Date.now(),
        });

        // Update Store
        this.storeTokens(newToken, true);

        this.emitEvent(AuthEventType.TOKEN_REFRESH, { token: newToken });
        return true;
      } else {
        // Failed, logout
        await this.logout();
        return false;
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Log from auth', {
        data: ['Token refresh failed:', error],
        source_origin: 'auth',
      });
      await this.logout();
      return false;
    }
  }

  // Check Permission
  hasPermission(permission: Permission): boolean {
    const { user } = this.currentState;
    return user ? user.permissions.includes(permission) : false;
  }

  // Check Role
  hasRole(role: UserRole): boolean {
    const { user } = this.currentState;
    return user ? user.role === role : false;
  }

  // Check Any Permission
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Check All Permissions
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Update Activity
  updateActivity(): void {
    this.authState$.next({
      ...this.authState$.value,
      lastActivity: Date.now(),
    });
  }

  // Validate Password
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.config.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`Password length must be at least ${policy.minLength}`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { isValid: errors.length === 0, errors };
  }

  // Change Password
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    const { user } = this.currentState;
    if (!user) {
      return { success: false, error: 'User not logged in' };
    }

    // Validate New Password
    const validation = this.validatePassword(newPassword);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('; ') };
    }

    try {
      // Mock API
      const response = await this.mockChangePasswordAPI(user.id, currentPassword, newPassword);

      if (response.success) {
        // Update User
        const updatedUser = { ...user, passwordLastChanged: Date.now() };
        this.authState$.next({
          ...this.authState$.value,
          user: updatedUser,
        });

        this.emitEvent(AuthEventType.PASSWORD_CHANGED, { userId: user.id });
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Change password failed';
      return { success: false, error: errorMessage };
    }
  }

  // Subscribe Event
  subscribe(event: string, callback: (event: AuthEventType, data?: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }

  // Private Implementation

  private initializeAuth(): void {
    // Try to restore from local storage
    const storedTokens = this.getStoredTokens();
    if (storedTokens) {
      if (this.isTokenValid(storedTokens)) {
        this.restoreAuthState(storedTokens);
      } else {
        this.clearStoredTokens();
      }
    }

    // Start session check
    if (this.currentState.isAuthenticated) {
      this.startSessionCheck();
    }
  }

  private startSessionCheck(): void {
    this.sessionCheckInterval = setInterval(() => {
      const { token, lastActivity } = this.currentState;

      if (!token) return;

      const now = Date.now();
      const sessionTimeout = this.config.sessionTimeout * 60 * 1000;
      const inactiveTime = now - lastActivity;

      // Check Session Timeout
      if (inactiveTime > sessionTimeout) {
        this.handleSessionExpired();
        return;
      }

      // Check Token Expiry
      const timeToExpiry = token.expiresAt - now;
      const refreshThreshold = 5 * 60 * 1000; // 5 mins

      if (timeToExpiry < refreshThreshold) {
        this.refreshToken();
      }
    }, 60 * 1000); // Check every minute
  }

  private stopSessionCheck(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = undefined;
    }
  }

  private handleSessionExpired(): void {
    this.emitEvent(AuthEventType.SESSION_EXPIRED);
    this.logout();
  }

  private setLoading(loading: boolean): void {
    this.authState$.next({
      ...this.authState$.value,
      isLoading: loading,
    });
  }

  private setError(error: string | null): void {
    this.authState$.next({
      ...this.authState$.value,
      error,
      isLoading: false,
    });
  }

  private emitEvent(event: AuthEventType, data?: any): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          omniLogger.error(LogCategory.SECURITY, 'Auth event callback error', { error });
        }
      });
    }
  }

  private storeTokens(token: AuthToken, rememberMe: boolean = false): void {
    try {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('esg_auth_token', JSON.stringify(token));
    } catch (e) {
      omniLogger.warn(
        LogCategory.SECURITY,
        `Failed to store auth token (Strategy: ${rememberMe ? 'Local' : 'Session'})`,
        { error: e }
      );
    }
  }

  private getStoredTokens(): AuthToken | null {
    try {
      // Check session then local
      let tokenStr = sessionStorage.getItem('esg_auth_token');
      if (!tokenStr) {
        tokenStr = localStorage.getItem('esg_auth_token');
      }

      if (tokenStr) {
        try {
          return JSON.parse(tokenStr);
        } catch {
          return null;
        }
      }
    } catch (e) {
      omniLogger.warn(LogCategory.SECURITY, 'Failed to retrieve auth token from storage', {
        error: e,
      });
    }

    return null;
  }

  private clearStoredTokens(): void {
    try {
      sessionStorage.removeItem('esg_auth_token');
      localStorage.removeItem('esg_auth_token');
    } catch (e) {
      omniLogger.warn(LogCategory.SECURITY, 'Failed to clear auth token from storage', {
        error: e,
      });
    }
  }

  private isTokenValid(token: AuthToken): boolean {
    return token.expiresAt > Date.now();
  }

  private async restoreAuthState(token: AuthToken): Promise<void> {
    try {
      // Mock get User
      const response = await this.mockGetUserAPI(token.accessToken);

      if (response.success) {
        this.authState$.next({
          isAuthenticated: true,
          user: response.data!,
          token,
          isLoading: false,
          error: null,
          lastActivity: Date.now(),
        });
      } else {
        this.clearStoredTokens();
      }
    } catch (error) {
      omniLogger.error(LogCategory.SECURITY, 'Failed to restore auth state', { error });
      this.clearStoredTokens();
    }
  }

  private getDefaultConfig(): AuthConfig {
    return {
      sessionTimeout: 60, // 60 mins
      maxLoginAttempts: 5,
      lockoutDuration: 30, // 30 mins
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventReuse: 5,
      },
      mfaRequired: false,
      jwtSecret: process.env.VITE_JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'esg-jwt-secret-key-dev-only'),
      jwtExpiresIn: '1h',
      refreshTokenExpiresIn: '7d',
    };
  }

  // Mock API
  private async mockLoginAPI(credentials: any): Promise<{
    success: boolean;
    data?: { user: User; token: AuthToken };
    error?: string;
    requiresMfa?: boolean;
  }> {
    // Delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock Verification (Disabled in production unless forced)
    const isMockEnabled = process.env.NODE_ENV !== 'production';

    if (isMockEnabled && credentials.email === 'admin@esg.com' && credentials.password === 'Admin123!') {
      const user: User = {
        id: 'user_admin',
        email: credentials.email,
        username: 'admin',
        displayName: 'Administrator',
        role: UserRole.ADMIN,
        permissions: RolePermissions[UserRole.ADMIN],
        isActive: true,
        mfaEnabled: false,
        loginAttempts: 0,
        profile: {
          timezone: 'Asia/Taipei',
          language: 'zh-TW',
          theme: 'auto',
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      const token: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
        tokenType: 'Bearer',
        scope: ['read', 'write', 'admin'],
      };

      return { success: true, data: { user, token } };
    }

    return { success: false, error: 'Invalid credentials' };
  }

  private async mockRefreshTokenAPI(
    refreshToken: string
  ): Promise<{ success: boolean; data?: AuthToken; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (refreshToken.startsWith('mock_refresh_token_')) {
      const token: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000,
        tokenType: 'Bearer',
        scope: ['read', 'write'],
      };

      return { success: true, data: token };
    }

    return { success: false, error: 'Refresh failed' };
  }

  private async mockChangePasswordAPI(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock Change
    return { success: true };
  }

  private async mockGetUserAPI(
    accessToken: string
  ): Promise<{ success: boolean; data?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (accessToken.startsWith('mock_access_token_')) {
      const user: User = {
        id: 'user_admin',
        email: 'admin@esg.com',
        username: 'admin',
        displayName: 'Administrator',
        role: UserRole.ADMIN,
        permissions: RolePermissions[UserRole.ADMIN],
        isActive: true,
        mfaEnabled: false,
        loginAttempts: 0,
        profile: {
          timezone: 'Asia/Taipei',
          language: 'zh-TW',
          theme: 'auto',
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      };

      return { success: true, data: user };
    }

    return { success: false, error: 'Invalid token' };
  }
  /**
   * Lifecycle
   */
  destroy(): void {
    this.stopSessionCheck();
    this.subscribers.clear();
    this.authState$.next({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      lastActivity: Date.now(),
    });
    if (AuthService.instance === this) {
      AuthService.instance = null!;
    }
    omniLogger.info(LogCategory.SECURITY, 'AuthService destroyed');
  }
}

// Export Instance
export const authService = AuthService.getInstance();

// React Hook
export const useAuth = () => {
  const [authState, setAuthState] = React.useState(authService.currentState);

  React.useEffect(() => {
    const subscription = authService.authState.subscribe(setAuthState);
    return () => subscription.unsubscribe();
  }, []);

  return {
    ...authState,
    login: authService.login.bind(authService),
    logout: authService.logout.bind(authService),
    refreshToken: authService.refreshToken.bind(authService),
    hasPermission: authService.hasPermission.bind(authService),
    hasRole: authService.hasRole.bind(authService),
    hasAnyPermission: authService.hasAnyPermission.bind(authService),
    hasAllPermissions: authService.hasAllPermissions.bind(authService),
    changePassword: authService.changePassword.bind(authService),
    updateActivity: authService.updateActivity.bind(authService),
  };
};
