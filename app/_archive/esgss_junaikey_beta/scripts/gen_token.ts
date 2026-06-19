import jwt from 'jsonwebtoken';
const USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const JWT_SECRET = 'esg-sunshine-junaikey-secret-2026';
const token = jwt.sign({ id: USER_ID }, JWT_SECRET, { expiresIn: '1h' });
console.log(token);
