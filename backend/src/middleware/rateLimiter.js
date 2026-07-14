import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis.js';

// Only enforce Redis rate limiting in production to avoid crashing local dev environments 
// that don't have Redis installed natively (like Windows).
const isProd = process.env.NODE_ENV === 'production';

const store = isProd ? new RedisStore({
  sendCommand: (...args) => redisClient.call(...args),
}) : undefined;

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  store: store,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth requests. Try again later.' },
  store: store,
});
