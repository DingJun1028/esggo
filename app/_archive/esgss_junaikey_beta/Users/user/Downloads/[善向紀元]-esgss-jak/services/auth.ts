// 身份驗證與授權服務 - M8安全治理模組
import React from 'react';
import { BehaviorSubject } from 'rxjs';

// 用戶角色枚舉
export enum UserRole {
  ADMIN = 'ADMIN',
  ESG_MANAGER = 'ESG_MANAGER',
  ANALYST = 'ANALYST',
  AUDITOR = 'AUDITOR',
  VIEWER = 'VIEWER',
  GUEST = 'GUEST'
}

// 權限枚舉
export enum Permission {
  // 系統管理權限
  ADMIN_ACCESS = 'ADMIN_ACCESS',
  SYSTEM_CONFIG = 'SYSTEM_CONFIG',
  USER_MANAGEMENT = 'USER_MANAGEMENT',

  // ESG數據權限
  VIEW_MY_ESG = 'VIEW_MY_ESG',
  EDIT_ESG_DATA = 'EDIT_ESG_DATA',
  APPROVE_ESG_REPORTS = 'APPROVE_ESG_REPORTS',

  // 儀表板權限
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  CREATE_DASHBOARD = 'CREATE_DASHBOARD',
  EDIT_DASHBOARD = 'EDIT_DASHBOARD',
  DELETE_DASHBOARD = 'DELETE_DASHBOARD',
  SHARE_DASHBOARD = 'SHARE_DASHBOARD',

  // 分析權限
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  RUN_ANALYSIS = 'RUN_ANALYSIS',
  EXPORT_DATA = 'EXPORT_DATA',

  // 審計權限
  VIEW_AUDIT = 'VIEW_AUDIT',
  GENERATE_AUDIT_REPORT = 'GENERATE_AUDIT_REPORT',

  // 企業服務權限
  VIEW_ENTERPRISE_SERVICES = 'VIEW_ENTERPRISE_SERVICES',
  MANAGE_ENTERPRISE_DATA = 'MANAGE_ENTERPRISE_DATA',

  // 特殊權限
  VIEW_UNIVERSAL_AGENT = 'VIEW_UNIVERSAL_AGENT',
  VIEW_ARCHITECT_CONSOLE = 'VIEW_ARCHITECT_CONSOLE',
  VIEW_FIREWALL_GUARDIAN = 'VIEW_FIREWALL_GUARDIAN',
  VIEW_SITUATION_LOGS = 'VIEW_SITUATION_LOGS',
  VIEW_OMNIPOTENT_MATRIX = 'VIEW_OMNIPOTENT_MATRIX',
  VIEW_UNIVERSAL_MODULE_12A = 'VIEW_UNIVERSAL_MODULE_12A',
  VIEW_ESG_WAR_ROOM = 'VIEW_ESG_WAR_ROOM',
  VIEW_ANNUAL_REPORT_GENERATOR = 'VIEW_ANNUAL_REPORT_GENERATOR',
  VIEW_GENESIS_PRIME_OS = 'VIEW_GENESIS_PRIME_OS',
  VIEW_OMNI_CONTEXT_ENGINE = 'VIEW_OMNI_CONTEXT_ENGINE',
  VIEW_OMNI_SOVEREIGN_GOVERNANCE = 'VIEW_OMNI_SOVEREIGN_GOVERNANCE',
  VIEW_FOUNDATIONAL_INTELLIGENCE = 'VIEW_FOUNDATIONAL_INTELLIGENCE'
}

// 角色權限映射
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
    Permission.VIEW_UNIVERSAL_AGENT,
    Permission.VIEW_ARCHITECT_CONSOLE,
    Permission.VIEW_SITUATION_LOGS,
    Permission.VIEW_OMNI_SOVEREIGN_GOVERNANCE,
    Permission.VIEW_FOUNDATIONAL_INTELLIGENCE,
  ],
  [UserRole.VIEWER]: [
    Permission.VIEW_MY_ESG,
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
  ],
  [UserRole.GUEST]: [
    Permission.VIEW_MY_ESG,
  ]
};

// 用戶信息介面
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

// 認證令牌介面
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: 'Bearer';
  scope: string[];
}

// 認證狀態
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
}

// 認證事件類型
export enum AuthEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED'
}

// 認證配置
export interface AuthConfig {
  sessionTimeout: number; // 會話超時時間（分鐘）
  maxLoginAttempts: number; // 最大登入嘗試次數
  lockoutDuration: number; // 鎖定持續時間（分鐘）
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    preventReuse: number; // 防止重用最近N個密碼
  };
  mfaRequired: boolean;
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
}

// 認證服務類
export class AuthService {
  private static instance: AuthService;
  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
    error: null,
    lastActivity: Date.now()
  });

  private config: AuthConfig;
  private sessionCheckInterval?: NodeJS.Timeout;
  private subscribers: Map<string, ((event: AuthEventType, data?: any) => void)[]> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeAuth();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // 獲取認證狀態可觀察對象
  get authState() {
    return this.authState$.asObservable();
  }

  // 獲取當前認證狀態
  get currentState(): AuthState {
    return this.authState$.value;
  }

  // 登入
  async login(credentials: {
    email: string;
    password: string;
    mfaCode?: string;
    rememberMe?: boolean;
  }): Promise<{ success: boolean; error?: string; requiresMfa?: boolean }> {
    this.setLoading(true);

    try {
      // 模擬API調用
      const response = await this.mockLoginAPI(credentials);

      if (response.success) {
        const { user, token } = response.data!;

        // 更新認證狀態
        this.authState$.next({
          ...this.authState$.value,
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
          error: null,
          lastActivity: Date.now()
        });

        // 儲存令牌到本地儲存
        this.storeTokens(token, credentials.rememberMe);

        // 啟動會話檢查
        this.startSessionCheck();

        // 觸發登入成功事件
        this.emitEvent(AuthEventType.LOGIN_SUCCESS, { user });

        return { success: true };
      } else {
        // 處理登入失敗
        if (response.requiresMfa) {
          return { success: false, requiresMfa: true };
        }

        this.emitEvent(AuthEventType.LOGIN_FAILED, { reason: response.error });
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登入失敗';
      this.setError(errorMessage);
      this.emitEvent(AuthEventType.LOGIN_FAILED, { reason: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      this.setLoading(false);
    }
  }

  // 登出
  async logout(): Promise<void> {
    // 清除本地儲存的令牌
    this.clearStoredTokens();

    // 停止會話檢查
    this.stopSessionCheck();

    // 重置認證狀態
    this.authState$.next({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
      lastActivity: Date.now()
    });

    // 觸發登出事件
    this.emitEvent(AuthEventType.LOGOUT);
  }

  // 刷新令牌
  async refreshToken(): Promise<boolean> {
    const currentToken = this.currentState.token;
    if (!currentToken?.refreshToken) {
      return false;
    }

    try {
      // 模擬令牌刷新API調用
      const response = await this.mockRefreshTokenAPI(currentToken.refreshToken);

      if (response.success) {
        const newToken = response.data!;

        // 更新認證狀態
        this.authState$.next({
          ...this.authState$.value,
          token: newToken,
          lastActivity: Date.now()
        });

        // 更新本地儲存的令牌
        this.storeTokens(newToken, true);

        this.emitEvent(AuthEventType.TOKEN_REFRESH, { token: newToken });
        return true;
      } else {
        // 刷新失敗，登出用戶
        await this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      return false;
    }
  }

  // 檢查權限
  hasPermission(permission: Permission): boolean {
    const { user } = this.currentState;
    return user ? user.permissions.includes(permission) : false;
  }

  // 檢查角色
  hasRole(role: UserRole): boolean {
    const { user } = this.currentState;
    return user ? user.role === role : false;
  }

  // 檢查多個權限中的任意一個
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // 檢查所有權限
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // 更新用戶活動時間
  updateActivity(): void {
    this.authState$.next({
      ...this.authState$.value,
      lastActivity: Date.now()
    });
  }

  // 驗證密碼強度
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.config.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`密碼長度至少需要${policy.minLength}個字符`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('密碼必須包含至少一個大寫字母');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('密碼必須包含至少一個小寫字母');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('密碼必須包含至少一個數字');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('密碼必須包含至少一個特殊字符');
    }

    return { isValid: errors.length === 0, errors };
  }

  // 變更密碼
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const { user } = this.currentState;
    if (!user) {
      return { success: false, error: '用戶未登入' };
    }

    // 驗證新密碼
    const validation = this.validatePassword(newPassword);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join('; ') };
    }

    try {
      // 模擬密碼變更API調用
      const response = await this.mockChangePasswordAPI(user.id, currentPassword, newPassword);

      if (response.success) {
        // 更新用戶信息
        const updatedUser = { ...user, passwordLastChanged: Date.now() };
        this.authState$.next({
          ...this.authState$.value,
          user: updatedUser
        });

        this.emitEvent(AuthEventType.PASSWORD_CHANGED, { userId: user.id });
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '密碼變更失敗';
      return { success: false, error: errorMessage };
    }
  }

  // 事件訂閱
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

  // 私有方法實現

  private initializeAuth(): void {
    // 嘗試從本地儲存恢復認證狀態
    const storedTokens = this.getStoredTokens();
    if (storedTokens) {
      // 驗證令牌有效性
      if (this.isTokenValid(storedTokens)) {
        // 恢復用戶信息（在實際實現中需要從後端驗證）
        this.restoreAuthState(storedTokens);
      } else {
        // 令牌無效，清除儲存
        this.clearStoredTokens();
      }
    }

    // 啟動會話檢查
    if (this.currentState.isAuthenticated) {
      this.startSessionCheck();
    }
  }

  private startSessionCheck(): void {
    this.sessionCheckInterval = setInterval(() => {
      const { token, lastActivity } = this.currentState;

      if (!token) return;

      const now = Date.now();
      const sessionTimeout = this.config.sessionTimeout * 60 * 1000; // 轉換為毫秒
      const inactiveTime = now - lastActivity;

      // 檢查會話是否過期
      if (inactiveTime > sessionTimeout) {
        this.handleSessionExpired();
        return;
      }

      // 檢查令牌是否即將過期，提前刷新
      const timeToExpiry = token.expiresAt - now;
      const refreshThreshold = 5 * 60 * 1000; // 5分鐘前刷新

      if (timeToExpiry < refreshThreshold) {
        this.refreshToken();
      }
    }, 60 * 1000); // 每分鐘檢查一次
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
      isLoading: loading
    });
  }

  private setError(error: string | null): void {
    this.authState$.next({
      ...this.authState$.value,
      error,
      isLoading: false
    });
  }

  private emitEvent(event: AuthEventType, data?: any): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          console.error('Auth event callback error:', error);
        }
      });
    }
  }

  private storeTokens(token: AuthToken, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('esg_auth_token', JSON.stringify(token));
  }

  private getStoredTokens(): AuthToken | null {
    // 優先檢查sessionStorage，然後檢查localStorage
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

    return null;
  }

  private clearStoredTokens(): void {
    sessionStorage.removeItem('esg_auth_token');
    localStorage.removeItem('esg_auth_token');
  }

  private isTokenValid(token: AuthToken): boolean {
    return token.expiresAt > Date.now();
  }

  private async restoreAuthState(token: AuthToken): Promise<void> {
    try {
      // 模擬從後端獲取用戶信息
      const response = await this.mockGetUserAPI(token.accessToken);

      if (response.success) {
        this.authState$.next({
          isAuthenticated: true,
          user: response.data!,
          token,
          isLoading: false,
          error: null,
          lastActivity: Date.now()
        });
      } else {
        this.clearStoredTokens();
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error);
      this.clearStoredTokens();
    }
  }

  private getDefaultConfig(): AuthConfig {
    return {
      sessionTimeout: 60, // 60分鐘
      maxLoginAttempts: 5,
      lockoutDuration: 30, // 30分鐘
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        preventReuse: 5
      },
      mfaRequired: false,
      jwtSecret: 'esg-jwt-secret-key', // 在生產環境中應該從環境變數獲取
      jwtExpiresIn: '1h',
      refreshTokenExpiresIn: '7d'
    };
  }

  // 模擬API調用（在實際實現中替換為真實的API調用）
  private async mockLoginAPI(credentials: any): Promise<{ success: boolean; data?: { user: User; token: AuthToken }; error?: string; requiresMfa?: boolean }> {
    // 模擬網路延遲
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模擬用戶驗證邏輯
    if (credentials.email === 'admin@esg.com' && credentials.password === 'Admin123!') {
      const user: User = {
        id: 'user_admin',
        email: credentials.email,
        username: 'admin',
        displayName: '系統管理員',
        role: UserRole.ADMIN,
        permissions: RolePermissions[UserRole.ADMIN],
        isActive: true,
        mfaEnabled: false,
        loginAttempts: 0,
        profile: {
          timezone: 'Asia/Taipei',
          language: 'zh-TW',
          theme: 'auto'
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      };

      const token: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + (60 * 60 * 1000), // 1小時後過期
        tokenType: 'Bearer',
        scope: ['read', 'write', 'admin']
      };

      return { success: true, data: { user, token } };
    }

    return { success: false, error: '無效的憑證' };
  }

  private async mockRefreshTokenAPI(refreshToken: string): Promise<{ success: boolean; data?: AuthToken; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (refreshToken.startsWith('mock_refresh_token_')) {
      const token: AuthToken = {
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresAt: Date.now() + (60 * 60 * 1000),
        tokenType: 'Bearer',
        scope: ['read', 'write']
      };

      return { success: true, data: token };
    }

    return { success: false, error: '無效的刷新令牌' };
  }

  private async mockChangePasswordAPI(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 模擬密碼驗證（在實際實現中需要驗證當前密碼）
    return { success: true };
  }

  private async mockGetUserAPI(accessToken: string): Promise<{ success: boolean; data?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (accessToken.startsWith('mock_access_token_')) {
      const user: User = {
        id: 'user_admin',
        email: 'admin@esg.com',
        username: 'admin',
        displayName: '系統管理員',
        role: UserRole.ADMIN,
        permissions: RolePermissions[UserRole.ADMIN],
        isActive: true,
        mfaEnabled: false,
        loginAttempts: 0,
        profile: {
          timezone: 'Asia/Taipei',
          language: 'zh-TW',
          theme: 'auto'
        },
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      };

      return { success: true, data: user };
    }

    return { success: false, error: '無效的訪問令牌' };
  }
}

// 導出單例實例
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
    updateActivity: authService.updateActivity.bind(authService)
  };
};