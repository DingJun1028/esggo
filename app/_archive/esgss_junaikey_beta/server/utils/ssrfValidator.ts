import net from 'net';
import dns from 'dns';
import { promisify } from 'util';

// Use dns.promises if available, otherwise promisify dns.lookup
const lookup = dns.promises ? dns.promises.lookup : promisify(dns.lookup);

/**
 * Checks if an IP address is private or restricted.
 * Blocks:
 * - Loopback (127.0.0.0/8, ::1)
 * - Private IPv4 (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)
 * - Link-local (169.254.0.0/16, fe80::/10)
 * - Unique Local IPv6 (fc00::/7)
 * - Unspecified (0.0.0.0, ::)
 */
export function isPrivateIP(ip: string): boolean {
    if (!net.isIP(ip)) return false;

    // IPv4 Checks
    if (net.isIPv4(ip)) {
        // Loopback 127.0.0.0/8
        if (ip.startsWith('127.')) return true;
        // Private 10.0.0.0/8
        if (ip.startsWith('10.')) return true;
        // Private 192.168.0.0/16
        if (ip.startsWith('192.168.')) return true;
        // Link-local 169.254.0.0/16
        if (ip.startsWith('169.254.')) return true;
        // Private 172.16.0.0/12
        // 172.16.x.x to 172.31.x.x
        const parts = ip.split('.').map(Number);
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
        // Unspecified
        if (ip === '0.0.0.0') return true;
    }

    // IPv6 Checks
    if (net.isIPv6(ip)) {
        const normalized = ip.toLowerCase();
        // Loopback
        if (normalized === '::1') return true;
        // Unspecified
        if (normalized === '::' || normalized === '0:0:0:0:0:0:0:0') return true;
        // Unique Local fc00::/7 (fc00... and fd00...)
        if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
        // Link-local fe80::/10
        if (normalized.startsWith('fe80')) return true;
        // IPv4-mapped IPv6 (::ffff:127.0.0.1 etc.) - risky, block them
        if (normalized.startsWith('::ffff:')) return true;
    }

    return false;
}

/**
 * Validates a URL by checking its protocol and resolving its hostname
 * to ensure it doesn't point to a private IP (SSRF protection).
 */
export async function validateUrlWithDNS(inputUrl: string): Promise<boolean> {
    try {
        const url = new URL(inputUrl);

        // 1. Protocol Check
        if (!['http:', 'https:'].includes(url.protocol)) {
            return false;
        }

        const hostname = url.hostname;

        // 2. Block localhost explicitly
        if (hostname === 'localhost') return false;

        // 3. DNS Resolution
        // lookup returns { address, family }
        const result = await lookup(hostname);
        const address = typeof result === 'string' ? result : result.address;

        if (isPrivateIP(address)) {
            return false;
        }

        return true;
    } catch (error) {
        // Invalid URL or DNS resolution failed
        return false;
    }
}

/**
 * Returns a lookup function for http.Agent/https.Agent that validates the resolved IP.
 * This prevents DNS rebinding attacks where a domain resolves to a private IP.
 */
export function getSafeLookup() {
    return (hostname: string, options: any, callback: (err: NodeJS.ErrnoException | null, address: string, family: number) => void) => {
        dns.lookup(hostname, options, (err, address, family) => {
            if (err) {
                return callback(err, address, family);
            }

            if (typeof address === 'string' && isPrivateIP(address)) {
                const error = new Error(`DNS lookup restricted: Resolved to private IP ${address}`) as NodeJS.ErrnoException;
                error.code = 'ENOTFOUND';
                return callback(error, address, family);
            }

            callback(null, address, family);
        });
    };
}
