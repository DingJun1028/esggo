import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  AuthService,
  UserRole,
  Permission,
  RolePermissions,
  authService,
} from '../../services/auth';

// Mock localStorage and sessionStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock setInterval and clearInterval
vi.useFakeTimers();

describe('AuthService', () => {
  let authServiceInstance: AuthService;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    vi.clearAllTimers();

    // Reset localStorage and sessionStorage mocks
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
    sessionStorageMock.getItem.mockReturnValue(null);
    sessionStorageMock.setItem.mockImplementation(() => {});
    sessionStorageMock.removeItem.mockImplementation(() => {});

    // Get fresh instance for each test
    authServiceInstance = AuthService.getInstance();
  });

  afterEach(() => {
    // Reset the singleton instance after each test
    (AuthService as any).instance = null;
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AuthService.getInstance();
      const instance2 = AuthService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('Role Permissions', () => {
    it('should have correct permissions for ADMIN role', () => {
      expect(RolePermissions[UserRole.ADMIN]).toContain(Permission.ADMIN_ACCESS);
      expect(RolePermissions[UserRole.ADMIN]).toContain(Permission.USER_MANAGEMENT);
      expect(RolePermissions[UserRole.ADMIN]).toHaveLength(Object.values(Permission).length);
    });

    it('should have limited permissions for VIEWER role', () => {
      const viewerPermissions = RolePermissions[UserRole.VIEWER];
      expect(viewerPermissions).toContain(Permission.VIEW_MY_ESG);
      expect(viewerPermissions).toContain(Permission.VIEW_DASHBOARD);
      expect(viewerPermissions).toContain(Permission.VIEW_ANALYTICS);
      expect(viewerPermissions).not.toContain(Permission.ADMIN_ACCESS);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong password correctly', () => {
      const result = authServiceInstance.validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak password', () => {
      const result = authServiceInstance.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require minimum length', () => {
      const result = authServiceInstance.validatePassword('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('密碼長度至少需要8個字符');
    });

    it('should require uppercase letter', () => {
      const result = authServiceInstance.validatePassword('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('密碼必須包含至少一個大寫字母');
    });

    it('should require lowercase letter', () => {
      const result = authServiceInstance.validatePassword('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('密碼必須包含至少一個小寫字母');
    });

    it('should require number', () => {
      const result = authServiceInstance.validatePassword('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('密碼必須包含至少一個數字');
    });

    it('should require special character', () => {
      const result = authServiceInstance.validatePassword('Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('密碼必須包含至少一個特殊字符');
    });
  });

  describe('Permission Checking', () => {
    beforeEach(() => {
      // Mock authenticated user
      authServiceInstance['authState$'].next({
        isAuthenticated: true,
        user: {
          id: 'test-user',
          email: 'test@example.com',
          username: 'testuser',
          displayName: 'Test User',
          role: UserRole.ANALYST,
          permissions: RolePermissions[UserRole.ANALYST],
          isActive: true,
          mfaEnabled: false,
          loginAttempts: 0,
          profile: {
            timezone: 'Asia/Taipei',
            language: 'zh-TW',
            theme: 'light',
          },
          metadata: {
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        token: null,
        isLoading: false,
        error: null,
        lastActivity: Date.now(),
      });
    });

    it('should return true for granted permission', () => {
      expect(authServiceInstance.hasPermission(Permission.VIEW_ANALYTICS)).toBe(true);
    });

    it('should return false for non-granted permission', () => {
      expect(authServiceInstance.hasPermission(Permission.ADMIN_ACCESS)).toBe(false);
    });

    it('should check role correctly', () => {
      expect(authServiceInstance.hasRole(UserRole.ANALYST)).toBe(true);
      expect(authServiceInstance.hasRole(UserRole.ADMIN)).toBe(false);
    });

    it('should check any permission correctly', () => {
      expect(
        authServiceInstance.hasAnyPermission([Permission.VIEW_ANALYTICS, Permission.ADMIN_ACCESS])
      ).toBe(true);
      expect(
        authServiceInstance.hasAnyPermission([Permission.ADMIN_ACCESS, Permission.USER_MANAGEMENT])
      ).toBe(false);
    });

    it('should check all permissions correctly', () => {
      expect(
        authServiceInstance.hasAllPermissions([Permission.VIEW_ANALYTICS, Permission.RUN_ANALYSIS])
      ).toBe(true);
      expect(
        authServiceInstance.hasAllPermissions([Permission.VIEW_ANALYTICS, Permission.ADMIN_ACCESS])
      ).toBe(false);
    });
  });

  describe('Token Management', () => {
    it('should validate token correctly', () => {
      const validToken = {
        accessToken: 'test',
        refreshToken: 'test',
        expiresAt: Date.now() + 3600000, // 1 hour from now
        tokenType: 'Bearer' as const,
        scope: ['read'],
      };

      const expiredToken = {
        accessToken: 'test',
        refreshToken: 'test',
        expiresAt: Date.now() - 1000, // 1 second ago
        tokenType: 'Bearer' as const,
        scope: ['read'],
      };

      expect((authServiceInstance as any).isTokenValid(validToken)).toBe(true);
      expect((authServiceInstance as any).isTokenValid(expiredToken)).toBe(false);
    });

    it('should store tokens in correct storage', () => {
      const token = {
        accessToken: 'test',
        refreshToken: 'test',
        expiresAt: Date.now() + 3600000,
        tokenType: 'Bearer' as const,
        scope: ['read'],
      };

      // Test sessionStorage (rememberMe = false)
      (authServiceInstance as any).storeTokens(token, false);
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'esg_auth_token',
        JSON.stringify(token)
      );

      // Test localStorage (rememberMe = true)
      (authServiceInstance as any).storeTokens(token, true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'esg_auth_token',
        JSON.stringify(token)
      );
    });
  });

  describe('Session Management', () => {
    it('should update activity timestamp', () => {
      const initialActivity = authServiceInstance.currentState.lastActivity;
      authServiceInstance.updateActivity();

      expect(authServiceInstance.currentState.lastActivity).toBeGreaterThan(initialActivity);
    });

    it('should start session check when authenticated', () => {
      // Mock authenticated state
      authServiceInstance['authState$'].next({
        isAuthenticated: true,
        user: null,
        token: {
          accessToken: 'test',
          refreshToken: 'test',
          expiresAt: Date.now() + 3600000,
          tokenType: 'Bearer' as const,
          scope: ['read'],
        },
        isLoading: false,
        error: null,
        lastActivity: Date.now(),
      });

      (authServiceInstance as any).startSessionCheck();

      // Should set up interval
      expect(authServiceInstance['sessionCheckInterval']).toBeDefined();

      // Clean up
      (authServiceInstance as any).stopSessionCheck();
    });
  });

  describe('Event System', () => {
    it('should emit and handle events', () => {
      const mockCallback = vi.fn();
      const unsubscribe = authServiceInstance.subscribe('test-event', mockCallback);

      (authServiceInstance as any).emitEvent('test-event', { data: 'test' });

      expect(mockCallback).toHaveBeenCalledWith('test-event', { data: 'test' });

      // Test unsubscribe
      unsubscribe();
      (authServiceInstance as any).emitEvent('test-event', { data: 'test2' });
      expect(mockCallback).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });
});

// Integration tests with mock API calls
describe('AuthService Integration', () => {
  let authServiceInstance: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    (AuthService as any).instance = null;
    authServiceInstance = AuthService.getInstance();
  });

  afterEach(() => {
    (AuthService as any).instance = null;
  });

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const credentials = {
        email: 'admin@esg.com',
        password: 'Admin123!',
        rememberMe: true,
      };

      const result = await authServiceInstance.login(credentials);

      expect(result.success).toBe(true);
      expect(authServiceInstance.currentState.isAuthenticated).toBe(true);
      expect(authServiceInstance.currentState.user?.role).toBe(UserRole.ADMIN);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('should handle failed login', async () => {
      const credentials = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const result = await authServiceInstance.login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('無效的憑證');
      expect(authServiceInstance.currentState.isAuthenticated).toBe(false);
    });
  });

  describe('Logout Flow', () => {
    beforeEach(async () => {
      // Login first
      await authServiceInstance.login({
        email: 'admin@esg.com',
        password: 'Admin123!',
        rememberMe: false,
      });
    });

    it('should handle logout correctly', async () => {
      await authServiceInstance.logout();

      expect(authServiceInstance.currentState.isAuthenticated).toBe(false);
      expect(authServiceInstance.currentState.user).toBe(null);
      expect(authServiceInstance.currentState.token).toBe(null);
      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('esg_auth_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('esg_auth_token');
    });
  });

  describe('Password Change', () => {
    beforeEach(async () => {
      await authServiceInstance.login({
        email: 'admin@esg.com',
        password: 'Admin123!',
      });
    });

    it('should change password successfully', async () => {
      const result = await authServiceInstance.changePassword('Admin123!', 'NewPassword123!');

      expect(result.success).toBe(true);
    });

    it('should reject weak new password', async () => {
      const result = await authServiceInstance.changePassword('Admin123!', 'weak');

      expect(result.success).toBe(false);
      expect(result.error).toContain('密碼長度至少需要8個字符');
    });

    it('should reject password change when not logged in', async () => {
      // Logout first
      await authServiceInstance.logout();

      const result = await authServiceInstance.changePassword('old', 'NewPassword123!');

      expect(result.success).toBe(false);
      expect(result.error).toBe('用戶未登入');
    });
  });
});
