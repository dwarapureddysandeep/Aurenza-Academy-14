import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'aurenza_academy_premium_super_secret_key_12345';

/**
 * Signs a payload into a secure HS256 JWT token using native Node.js crypto.
 * @param payload Data to encode in the token.
 * @param expiryMs Expiry duration in milliseconds. Defaults to 7 days.
 */
export function signToken(payload: any, expiryMs: number = 7 * 24 * 60 * 60 * 1000): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Date.now() + expiryMs;
  const fullPayload = { ...payload, exp };
  
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a token's integrity and signature.
 * Returns the decoded payload if valid, or null if invalid or expired.
 */
export function verifyToken(token: string): any | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [header, payload, signature] = parts;
  
  const expectedSignature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
    
  if (signature !== expectedSignature) {
    return null; // Signature invalid
  }
  
  try {
    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (decodedPayload.exp && decodedPayload.exp < Date.now()) {
      return null; // Token expired
    }
    return decodedPayload;
  } catch (e) {
    return null; // Decryption failed
  }
}
