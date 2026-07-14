import redis from '../config/redis.js';

/**
 * Cache middleware generator
 * @param {string} prefix - The prefix for the cache key (e.g., 'vendors', 'categories')
 * @param {number} expiration - Expiration time in seconds (default 300s = 5m)
 */
export const cacheResponse = (prefix, expiration = 300) => {
  return async (req, res, next) => {
    // Skip cache for non-GET requests or if user is authenticated (might need fresh user-specific data)
    // Actually, public routes like getVendors can be cached, but if the response includes user-specific 
    // data like `contactAccess`, we must cache it per user role or ID.
    // For Gaya Connect, if user is logged in, their `contactAccess` status is checked.
    // We can include the user's ID or lack thereof in the cache key.
    
    const userId = req.user ? String(req.user._id) : 'guest';
    const key = `${prefix}:${userId}:${req.originalUrl}`;

    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // If not cached, override res.json to cache the response before sending
      const originalJson = res.json;
      res.json = function (body) {
        redis.set(key, JSON.stringify(body), 'EX', expiration).catch(err => console.error('Redis set error:', err));
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Redis cache error:', error);
      next(); // Fail gracefully and proceed without cache
    }
  };
};

/**
 * Utility to clear cache by prefix
 * @param {string} prefix - The prefix of keys to delete
 */
export const clearCache = async (prefix) => {
  try {
    const keys = await redis.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Redis clear cache error:', error);
  }
};
