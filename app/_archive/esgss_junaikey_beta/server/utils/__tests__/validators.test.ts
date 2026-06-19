/**
 * Integration Tests for Validators
 * 輸入驗證工具的整合測試
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Import validators
import {
  validators,
  createValidator,
  ValidationSchema,
  ValidationResult,
  // Email validators
  isValidEmail,
  isValidEmailLite,
  // URL validators
  isValidUrl,
  isValidUrlWithProtocol,
  isValidHttpsUrl,
  // String validators
  isValidPassword,
  isValidUsername,
  isValidPhone,
  isValidTaiwanPhone,
  isValidChineseName,
  // Number validators
  isValidNumber,
  isPositiveNumber,
  isInteger,
  isInRange,
  // Date validators
  isValidDate,
  isValidDateRange,
  isPastDate,
  isFutureDate,
  isAge,
  // Type validators
  isValidObjectId,
  isValidUUID,
  isValidJSON,
  // Security validators
  sanitizeInput,
  escapeHtml,
  escapeSql,
  // Custom validation helpers
  checkRequired,
  checkMinLength,
  checkMaxLength,
  checkPattern,
  checkEnum
} from '../validators.js';

describe('Validators Integration Tests', () => {
  describe('Email Validation', () => {
    it('should validate correct emails', () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.com',
        'user@subdomain.example.com',
        'user123@example.co.uk'
      ];

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid emails', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'user@.com',
        'user@exam ple.com',
        'user@example.com.',
        'user@exam-ple.com spaces'
      ];

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it('should validate lite email format', () => {
      expect(isValidEmailLite('test@test.com')).toBe(true);
      expect(isValidEmailLite('invalid-email')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://example.com',
        'https://example.com/path',
        'https://example.com/path?query=value',
        'https://sub.domain.example.com/path/to/resource'
      ];

      validUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(true);
      });
    });

    it('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'ftp://example.com',
        '//example.com',
        'https://',
        'example.com'
      ];

      invalidUrls.forEach(url => {
        expect(isValidUrl(url)).toBe(false);
      });
    });

    it('should require HTTPS for HTTPS validator', () => {
      expect(isValidHttpsUrl('https://example.com')).toBe(true);
      expect(isValidHttpsUrl('http://example.com')).toBe(false);
    });

    it('should require protocol', () => {
      expect(isValidUrlWithProtocol('https://example.com')).toBe(true);
      expect(isValidUrlWithProtocol('example.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const strongPasswords = [
        'Abc123!@#',
        'MySecureP@ssw0rd',
        'C0mplex!#$%^&*()'
      ];

      strongPasswords.forEach(password => {
        const result = isValidPassword(password);
        expect(result.isValid).toBe(true);
      });
    });

    it('should reject weak passwords', () => {
      const weakPasswords = [
        '123',
        'password',
        'abc123',
        'short',
        'lowercase123!'
      ];

      weakPasswords.forEach(password => {
        const result = isValidPassword(password);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should check all password requirements', () => {
      const result = isValidPassword('weak');
      
      expect(result.errors).toContain('密碼長度至少需要 8 個字元');
      expect(result.errors).toContain('密碼必須包含大寫字母');
      expect(result.errors).toContain('密碼必須包含小寫字母');
      expect(result.errors).toContain('密碼必須包含數字');
      expect(result.errors).toContain('密碼必須包含特殊字元 (!@#$%^&*...)');
    });
  });

  describe('Username Validation', () => {
    it('should validate correct usernames', () => {
      const validUsernames = [
        'john_doe',
        'user123',
        'User_Name',
        'a1b2c3'
      ];

      validUsernames.forEach(username => {
        expect(isValidUsername(username)).toBe(true);
      });
    });

    it('should reject invalid usernames', () => {
      const invalidUsernames = [
        'ab', // too short
        'user with spaces',
        'user@name',
        'user-name',
        '1234567890123456789012345678901' // too long
      ];

      invalidUsernames.forEach(username => {
        expect(isValidUsername(username)).toBe(false);
      });
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate Taiwan phone numbers', () => {
      const validTaiwanPhones = [
        '0912345678',
        '0922-345678',
        '0933-456-789',
        '+886912345678'
      ];

      validTaiwanPhones.forEach(phone => {
        expect(isValidTaiwanPhone(phone)).toBe(true);
      });
    });

    it('should reject invalid Taiwan phone numbers', () => {
      const invalidPhones = [
        '12345',
        '091234567',
        '09123456789',
        '123-456-7890'
      ];

      invalidPhones.forEach(phone => {
        expect(isValidTaiwanPhone(phone)).toBe(false);
      });
    });
  });

  describe('Chinese Name Validation', () => {
    it('should validate Chinese names', () => {
      const validNames = [
        '王小明',
        '李美華',
        '張三',
        '歐陽長榮'
      ];

      validNames.forEach(name => {
        expect(isValidChineseName(name)).toBe(true);
      });
    });

    it('should reject invalid Chinese names', () => {
      const invalidNames = [
        'abc',
        '王', // too short
        'a' + 'a'.repeat(20), // too long
        '王123'
      ];

      invalidNames.forEach(name => {
        expect(isValidChineseName(name)).toBe(false);
      });
    });
  });

  describe('Number Validation', () => {
    it('should validate numbers', () => {
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('123.45')).toBe(true);
      expect(isValidNumber('-123')).toBe(true);
      expect(isValidNumber('0')).toBe(true);
    });

    it('should reject non-numbers', () => {
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('12abc')).toBe(false);
      expect(isValidNumber('')).toBe(false);
    });

    it('should check positive numbers', () => {
      expect(isPositiveNumber('123')).toBe(true);
      expect(isPositiveNumber('0')).toBe(false);
      expect(isPositiveNumber('-123')).toBe(false);
    });

    it('should check integers', () => {
      expect(isInteger('123')).toBe(true);
      expect(isInteger('123.45')).toBe(false);
    });

    it('should check range', () => {
      expect(isInRange(50, 1, 100)).toBe(true);
      expect(isInRange(0, 1, 100)).toBe(false);
      expect(isInRange(101, 1, 100)).toBe(false);
    });
  });

  describe('Date Validation', () => {
    it('should validate dates', () => {
      expect(isValidDate('2024-01-15')).toBe(true);
      expect(isValidDate('2024-02-29')).toBe(true); // Leap year
      expect(isValidDate('invalid')).toBe(false);
    });

    it('should check past dates', () => {
      expect(isPastDate('2020-01-01')).toBe(true);
      expect(isPastDate('2099-01-01')).toBe(false);
    });

    it('should check future dates', () => {
      expect(isFutureDate('2099-01-01')).toBe(true);
      expect(isFutureDate('2020-01-01')).toBe(false);
    });

    it('should check age', () => {
      expect(isAge('2020-01-01', 18)).toBeLessThanOrEqual(5); // About 4-5 years old
      expect(isAge('2000-01-01', 18)).toBeGreaterThanOrEqual(24); // About 24 years old
    });

    it('should validate date range', () => {
      expect(isValidDateRange('2024-01-01', '2024-12-31')).toBe(true);
      expect(isValidDateRange('2024-12-31', '2024-01-01')).toBe(false);
    });
  });

  describe('Type Validation', () => {
    it('should validate ObjectId', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('invalid-id')).toBe(false);
    });

    it('should validate UUID', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('not-a-uuid')).toBe(false);
    });

    it('should validate JSON', () => {
      expect(isValidJSON('{"key": "value"}')).toBe(true);
      expect(isValidJSON('{invalid}')).toBe(false);
    });
  });

  describe('Security Sanitization', () => {
    it('should sanitize input', () => {
      const input = 'Test <script>alert("xss")</script> and \'quotes\' and "double quotes"';
      const sanitized = sanitizeInput(input);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('alert');
      expect(sanitized).not.toContain('"xss"');
    });

    it('should escape HTML', () => {
      const input = '<div>Test & "quotes"</div>';
      const escaped = escapeHtml(input);

      expect(escaped).toContain('<div>');
      expect(escaped).toContain('&');
      expect(escaped).toContain('"');
    });

    it('should escape SQL', () => {
      const input = "User's input; DROP TABLE--";
      const escaped = escapeSql(input);

      expect(escaped).toContain("\\'");
      expect(escaped).toContain(';');
    });

    it('should remove XSS patterns', () => {
      const xssInputs = [
        '<script>alert(1)</script>',
        'javascript:alert(1)',
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>'
      ];

      xssInputs.forEach(input => {
        const sanitized = sanitizeInput(input);
        expect(sanitized).not.toContain('<script>');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
        expect(sanitized).not.toContain('onload');
      });
    });
  });

  describe('Custom Validation Helpers', () => {
    it('should check required fields', () => {
      expect(checkRequired('value')).toEqual({ isValid: true });
      expect(checkRequired('')).toEqual({ isValid: false, error: '此欄位為必填' });
      expect(checkRequired(null)).toEqual({ isValid: false, error: '此欄位為必填' });
      expect(checkRequired(undefined)).toEqual({ isValid: false, error: '此欄位為必填' });
    });

    it('should check min length', () => {
      expect(checkMinLength('hello', 3)).toEqual({ isValid: true });
      expect(checkMinLength('hi', 3)).toEqual({ isValid: false, error: '長度至少需要 3 個字元' });
    });

    it('should check max length', () => {
      expect(checkMaxLength('hi', 5)).toEqual({ isValid: true });
      expect(checkMaxLength('hello world', 5)).toEqual({ isValid: false, error: '長度不能超過 5 個字元' });
    });

    it('should check pattern', () => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(checkPattern('test@example.com', emailPattern)).toEqual({ isValid: true });
      expect(checkPattern('invalid', emailPattern)).toEqual({ isValid: false, error: '格式不符' });
    });

    it('should check enum', () => {
      const statusEnum = ['active', 'inactive', 'pending'] as const;
      expect(checkEnum('active', statusEnum)).toEqual({ isValid: true });
      expect(checkEnum('unknown', statusEnum)).toEqual({ isValid: false, error: '必須是有效的選項' });
    });
  });

  describe('Schema Validation', () => {
    it('should create validator from schema', () => {
      const schema: ValidationSchema = {
        email: {
          type: 'email',
          required: true
        },
        age: {
          type: 'number',
          min: 0,
          max: 150
        },
        name: {
          type: 'string',
          minLength: 2,
          maxLength: 50
        }
      };

      const validator = createValidator(schema);
      expect(validator).toBeDefined();
      expect(typeof validator).toBe('function');
    });

    it('should validate object against schema', () => {
      const schema: ValidationSchema = {
        email: { type: 'email', required: true },
        age: { type: 'number', min: 0, max: 150 }
      };

      const validator = createValidator(schema);

      const validData = { email: 'test@example.com', age: 25 };
      const result1 = validator(validData);
      expect(result1.isValid).toBe(true);

      const invalidData = { email: 'invalid-email', age: 200 };
      const result2 = validator(invalidData);
      expect(result2.isValid).toBe(false);
      expect(result2.errors).toBeDefined();
    });

    it('should handle nested objects', () => {
      const schema: ValidationSchema = {
        user: {
          type: 'object',
          schema: {
            name: { type: 'string', required: true },
            email: { type: 'email', required: true }
          }
        }
      };

      const validator = createValidator(schema);

      const validData = {
        user: { name: 'John', email: 'john@example.com' }
      };

      const result = validator(validData);
      expect(result.isValid).toBe(true);
    });

    it('should validate arrays', () => {
      const schema: ValidationSchema = {
        tags: {
          type: 'array',
          itemSchema: { type: 'string' },
          minItems: 1,
          maxItems: 10
        }
      };

      const validator = createValidator(schema);

      const validData = { tags: ['tag1', 'tag2'] };
      const result1 = validator(validData);
      expect(result1.isValid).toBe(true);

      const invalidData = { tags: [] };
      const result2 = validator(invalidData);
      expect(result2.isValid).toBe(false);
    });
  });

  describe('Integration: Complete Form Validation', () => {
    it('should validate registration form', () => {
      const registrationSchema: ValidationSchema = {
        email: { type: 'email', required: true },
        password: { type: 'password', required: true, minLength: 8 },
        confirmPassword: { type: 'string', required: true },
        name: { type: 'string', required: true, minLength: 2, maxLength: 50 },
        phone: { type: 'custom', validator: isValidTaiwanPhone },
        acceptTerms: { type: 'boolean', required: true }
      };

      const validator = createValidator(registrationSchema);

      const validForm = {
        email: 'user@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        name: '王小明',
        phone: '0912345678',
        acceptTerms: true
      };

      const result = validator(validForm);
      expect(result.isValid).toBe(true);
    });

    it('should validate login form', () => {
      const loginSchema: ValidationSchema = {
        email: { type: 'email', required: true },
        password: { type: 'string', required: true }
      };

      const validator = createValidator(loginSchema);

      const validLogin = { email: 'test@example.com', password: 'anypassword' };
      const result = validator(validLogin);
      expect(result.isValid).toBe(true);
    });

    it('should validate API request body', () => {
      const apiSchema: ValidationSchema = {
        action: { type: 'string', required: true, enum: ['create', 'update', 'delete'] },
        data: { type: 'object', required: true },
        options: { type: 'object' }
      };

      const validator = createValidator(apiSchema);

      const validRequest = {
        action: 'create',
        data: { key: 'value' },
        options: { recursive: true }
      };

      const result = validator(validRequest);
      expect(result.isValid).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should validate quickly', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        isValidEmail(`test${i}@example.com`);
        isValidPassword('SecurePass123!');
        isValidTaiwanPhone('0912345678');
      }

      const end = performance.now();
      const duration = end - start;

      // Should complete within reasonable time (less than 1 second for 3000 validations)
      expect(duration).toBeLessThan(1000);
    });
  });
});
