/**
 * 🎭 Browser-safe keccak256 mock
 * --------------------------------------------------
 * Replaces the Node.js `keccak256` npm package for browser builds.
 * Uses a simple deterministic FNV-1a hash to produce a 64-char hex string
 * that satisfies the `hash.toString('hex')` usage pattern.
 */

/** FNV-1a 64-bit hash (browser-safe, deterministic) */
function fnv1a(str: string): string {
    let h1 = 0x811c9dc5;
    let h2 = 0x89db5b;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        h1 ^= c;
        h2 ^= (c >> 4);
        h1 = Math.imul(h1, 0x01000193) >>> 0;
        h2 = Math.imul(h2, 0x01000193) >>> 0;
    }
    const toHex = (n: number) => n.toString(16).padStart(8, '0');
    // Produce 64 hex chars (32 bytes) by repeating / combining the two halves
    const half = toHex(h1) + toHex(h2) + toHex(h1 ^ h2) + toHex(h1 + h2);
    return (half + half).slice(0, 64);
}

/**
 * Browser-safe drop-in for `import keccak256 from 'keccak256'`
 * Returns a Buffer-like object with a toString('hex') method.
 */
function keccak256Mock(data: any): { toString: (enc?: string) => string } {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    const hex = fnv1a(str);
    return {
        toString: (_enc?: string) => hex,
    };
}

export default keccak256Mock;
export { keccak256Mock as keccak256 };
