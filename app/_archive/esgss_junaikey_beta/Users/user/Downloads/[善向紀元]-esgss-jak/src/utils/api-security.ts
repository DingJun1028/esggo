// ESG儀表板API安全服務
import { SecurityUtils } from './security';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'enterprise';
  permissions: string[];
}

class ApiSecurityService {
  private tokens: AuthTokens | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private baseURL = process.env.VITE_API_URL || 'https://api.esg-dashboard.com';

  constructor() {
    this.loadTokens();
    this.setupInterceptors();
  }

  // JWT令牌管理
  private loadTokens(): void {
    const stored = localStorage.getItem('esg_auth_tokens');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.expiresAt > Date.now()) {
          this.tokens = parsed;
        } else {
          this.clearTokens();
        }
      } catch (error) {
        console.warn('Failed to parse stored tokens:', error);
        this.clearTokens();
      }
    }
  }

  private saveTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem('esg_auth_tokens', JSON.stringify(tokens));
  }

  private clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem('esg_auth_tokens');
    localStorage.removeItem('esg_user');
  }

  // 認證方法
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await this.makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      this.saveTokens(data.tokens);
      this.saveUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error('登入失敗：' + (error as Error).message);
    }
  }

  async register(userData: { email: string; password: string; name: string }): Promise<User> {
    try {
      const response = await this.makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      this.saveTokens(data.tokens);
      this.saveUser(data.user);
      return data.user;
    } catch (error) {
      throw new Error('註冊失敗：' + (error as Error).message);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokens();
      window.location.href = '/login';
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.doRefreshToken();

    try {
      const tokens = await this.refreshPromise;
      return tokens;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async doRefreshToken(): Promise<AuthTokens> {
    if (!this.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.tokens.refreshToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      this.saveTokens(data.tokens);
      return data.tokens;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // 用戶管理
  private saveUser(user: User): void {
    localStorage.setItem('esg_user', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const stored = localStorage.getItem('esg_user');
    return stored ? JSON.parse(stored) : null;
  }

  isAuthenticated(): boolean {
    return this.tokens !== null && this.tokens.expiresAt > Date.now();
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }

  // 安全請求攔截器
  private setupInterceptors(): void {
    // 攔截所有fetch請求
    const originalFetch = window.fetch;
    window.fetch = this.interceptFetch.bind(this);
  }

  private async interceptFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    // 只攔截API請求
    if (!url.startsWith(this.baseURL)) {
      return originalFetch(input, init);
    }

    // 添加認證標頭
    const headers = new Headers(init?.headers);
    if (this.tokens?.accessToken) {
      headers.set('Authorization', `Bearer ${this.tokens.accessToken}`);
    }

    // 添加CSRF保護
    headers.set('X-CSRF-Token', SecurityUtils.generateCSRFToken());

    // 添加其他安全標頭
    headers.set('X-Requested-With', 'XMLHttpRequest');

    const secureInit: RequestInit = {
      ...init,
      headers
    };

    try {
      let response = await originalFetch(input, secureInit);

      // 處理401未授權
      if (response.status === 401 && this.tokens?.refreshToken) {
        try {
          await this.refreshToken();
          // 重試請求
          const retryHeaders = new Headers(headers);
          retryHeaders.set('Authorization', `Bearer ${this.tokens!.accessToken}`);
          response = await originalFetch(input, { ...init, headers: retryHeaders });
        } catch (refreshError) {
          // 刷新失敗，登出用戶
          this.clearTokens();
          window.location.href = '/login';
          throw new Error('Session expired');
        }
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 通用API請求方法
  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

    const secureOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    // 加密敏感數據
    if (options.body && typeof options.body === 'string') {
      try {
        const data = JSON.parse(options.body);
        // 檢查是否包含敏感信息
        if (this.containsSensitiveData(data)) {
          const encrypted = await SecurityUtils.encryptData(data);
          secureOptions.body = JSON.stringify({ encrypted: true, data: encrypted });
        }
      } catch (error) {
        // 如果不是JSON，保持原樣
      }
    }

    const response = await fetch(url, secureOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed: ${response.status}`);
    }

    return response;
  }

  // 檢查是否包含敏感數據
  private containsSensitiveData(data: any): boolean {
    const sensitiveKeys = ['password', 'ssn', 'creditCard', 'bankAccount', 'esgData'];
    return Object.keys(data).some(key =>
      sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))
    );
  }

  // 角色權限檢查
  checkRoleAccess(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'user': 1,
      'enterprise': 2,
      'admin': 3
    };

    return (roleHierarchy[user.role as keyof typeof roleHierarchy] || 0) >=
           (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0);
  }

  // 企業級功能權限
  canAccessEnterpriseFeatures(): boolean {
    return this.checkRoleAccess('enterprise');
  }

  canAccessAdminFeatures(): boolean {
    return this.checkRoleAccess('admin');
  }
}

// 創建全域實例
export const apiSecurity = new ApiSecurityService();

// 便捷方法
export const auth = {
  login: apiSecurity.login.bind(apiSecurity),
  register: apiSecurity.register.bind(apiSecurity),
  logout: apiSecurity.logout.bind(apiSecurity),
  isAuthenticated: apiSecurity.isAuthenticated.bind(apiSecurity),
  getCurrentUser: apiSecurity.getCurrentUser.bind(apiSecurity),
  hasPermission: apiSecurity.hasPermission.bind(apiSecurity),
  checkRoleAccess: apiSecurity.checkRoleAccess.bind(apiSecurity),
  canAccessEnterpriseFeatures: apiSecurity.canAccessEnterpriseFeatures.bind(apiSecurity),
  canAccessAdminFeatures: apiSecurity.canAccessAdminFeatures.bind(apiSecurity)
};

export const secureApi = {
  request: apiSecurity.makeRequest.bind(apiSecurity)
};