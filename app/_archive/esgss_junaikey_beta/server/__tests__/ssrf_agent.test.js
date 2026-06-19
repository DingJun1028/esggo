import { describe, it, expect, vi } from 'vitest';
import { getSafeLookup } from '../utils/ssrfValidator.js';
import dns from 'dns';

// Mock dns
vi.mock('dns', () => {
    return {
        default: {
            lookup: vi.fn(),
        },
        lookup: vi.fn(),
    };
});

describe('SSRF Safe Lookup', () => {
    it('should resolve public IP correctly', () => {
        const safeLookup = getSafeLookup();
        // Mock dns.lookup to return a public IP
        vi.mocked(dns.lookup).mockImplementation((hostname, options, callback) => {
            callback(null, '93.184.216.34', 4);
        });

        const callback = vi.fn();
        safeLookup('example.com', {}, callback);

        expect(callback).toHaveBeenCalledWith(null, '93.184.216.34', 4);
    });

    it('should block private IP (IPv4)', () => {
        const safeLookup = getSafeLookup();
        // Mock dns.lookup to return a private IP
        vi.mocked(dns.lookup).mockImplementation((hostname, options, callback) => {
            callback(null, '127.0.0.1', 4);
        });

        const callback = vi.fn();
        safeLookup('localhost', {}, callback);

        expect(callback).toHaveBeenCalledWith(expect.any(Error), '127.0.0.1', 4);
        expect(callback.mock.calls[0][0].message).toContain('DNS lookup restricted');
    });

    it('should block private IP (IPv6)', () => {
        const safeLookup = getSafeLookup();
        // Mock dns.lookup to return a private IP
        vi.mocked(dns.lookup).mockImplementation((hostname, options, callback) => {
            callback(null, '::1', 6);
        });

        const callback = vi.fn();
        safeLookup('localhost', {}, callback);

        expect(callback).toHaveBeenCalledWith(expect.any(Error), '::1', 6);
        expect(callback.mock.calls[0][0].message).toContain('DNS lookup restricted');
    });

    it('should pass through DNS errors', () => {
        const safeLookup = getSafeLookup();
        const dnsError = new Error('ENOTFOUND');
        // Mock dns.lookup to fail
        vi.mocked(dns.lookup).mockImplementation((hostname, options, callback) => {
            callback(dnsError, undefined, undefined);
        });

        const callback = vi.fn();
        safeLookup('nonexistent.com', {}, callback);

        expect(callback).toHaveBeenCalledWith(dnsError, undefined, undefined);
    });
});
