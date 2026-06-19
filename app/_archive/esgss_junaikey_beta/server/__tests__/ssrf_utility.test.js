import { describe, it, expect, vi } from 'vitest';
import { isPrivateIP, validateUrlWithDNS } from '../utils/ssrfValidator.js';
import dns from 'dns';

// Mock dns.promises.lookup
vi.mock('dns', async () => {
    const actual = await vi.importActual('dns');
    return {
        ...actual,
        default: {
            ...actual.default,
            promises: {
                lookup: vi.fn(),
            }
        },
        promises: {
            lookup: vi.fn(),
        },
    };
});

describe('SSRF Validator', () => {
    describe('isPrivateIP', () => {
        it('should return true for localhost (IPv4)', () => {
            expect(isPrivateIP('127.0.0.1')).toBe(true);
        });

        it('should return true for localhost (IPv6)', () => {
            expect(isPrivateIP('::1')).toBe(true);
        });

        it('should return true for private 10.x.x.x', () => {
            expect(isPrivateIP('10.0.0.5')).toBe(true);
        });

        it('should return true for private 192.168.x.x', () => {
            expect(isPrivateIP('192.168.1.1')).toBe(true);
        });

        it('should return true for private 172.16.x.x', () => {
            expect(isPrivateIP('172.16.0.1')).toBe(true);
            expect(isPrivateIP('172.31.255.255')).toBe(true);
        });

        it('should return false for public 172.32.x.x', () => {
            expect(isPrivateIP('172.32.0.1')).toBe(false);
        });

        it('should return true for link-local 169.254.x.x', () => {
            expect(isPrivateIP('169.254.169.254')).toBe(true);
        });

        it('should return false for public IP (Google DNS)', () => {
            expect(isPrivateIP('8.8.8.8')).toBe(false);
        });

        it('should return true for mapped IPv4', () => {
            expect(isPrivateIP('::ffff:127.0.0.1')).toBe(true);
        });
    });

    describe('validateUrlWithDNS', () => {
        it('should return false for non-http protocols', async () => {
            const result = await validateUrlWithDNS('ftp://example.com');
            expect(result).toBe(false);
        });

        it('should return false for localhost hostname', async () => {
            const result = await validateUrlWithDNS('http://localhost:3000');
            expect(result).toBe(false);
        });

        it('should return true for public domain', async () => {
            vi.mocked(dns.promises.lookup).mockResolvedValue({ address: '93.184.216.34', family: 4 });
            const result = await validateUrlWithDNS('http://example.com');
            expect(result).toBe(true);
        });

        it('should return false for domain resolving to private IP', async () => {
            vi.mocked(dns.promises.lookup).mockResolvedValue({ address: '127.0.0.1', family: 4 });
            const result = await validateUrlWithDNS('http://evil.com');
            expect(result).toBe(false);
        });

        it('should return false if DNS lookup fails', async () => {
            vi.mocked(dns.promises.lookup).mockRejectedValue(new Error('ENOTFOUND'));
            const result = await validateUrlWithDNS('http://nonexistent.com');
            expect(result).toBe(false);
        });
    });
});
