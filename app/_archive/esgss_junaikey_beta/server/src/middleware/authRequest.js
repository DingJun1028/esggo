import crypto from 'crypto';
import config from '../config/index.js';

const API_SECRET_TOKEN = config.security.apiSecretToken;

export const authenticateRequest = (req, res, next) => {
  // Allow health check to pass without authentication
  if (req.path === '/api/health') {
    return next();
  }

  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token) {
    // [SENTINEL] Fallback to query parameter for SSE/EventSource support
    // Handle edge case where token might be an array (duplicate param)
    const qToken = req.query.token;
    token = Array.isArray(qToken) ? qToken[0] : String(qToken);
  } else {
    return res
      .status(401)
      .json({ error: 'Unauthorized: Missing or invalid Authorization header.' });
  }

  // Use constant-time comparison to prevent timing attacks
  const tokenHash = crypto.createHash('sha256').update(token).digest();
  const secretHash = crypto.createHash('sha256').update(API_SECRET_TOKEN).digest();

  if (!crypto.timingSafeEqual(tokenHash, secretHash)) {
    return res.status(403).json({ error: 'Forbidden: Invalid token.' });
  }

  next();
};
