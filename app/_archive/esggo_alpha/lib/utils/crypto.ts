/**
 * Utility functions for cryptographic operations in the ESGGo 5T Protocol.
 */

/**
 * Generates a simple hash string from the input content.
 * In a real-world scenario, this would use SHA-256 or similar.
 * For this demo, we'll use a deterministic string transformation.
 */
export async function generateContentHash(content: string, salt: string = "5T-PROTOCOL-V8.1"): Promise<string> {
  const msgUint8 = new TextEncoder().encode(content + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex.slice(0, 12).toUpperCase();
}

/**
 * Validates if a hash matches the content.
 */
export async function verifyContentHash(content: string, hash: string, salt: string = "5T-PROTOCOL-V8.1"): Promise<boolean> {
  const generated = await generateContentHash(content, salt);
  return generated === hash;
}
