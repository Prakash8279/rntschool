// Simple in-memory cache middleware for GET requests
// Time Complexity: O(1) for cache hits

const cache = new Map();
const CACHE_DURATION = 60 * 1000; // 60 seconds

/**
 * Cache middleware for GET requests
 * Stores responses in memory with TTL
 * @param {number} duration - Cache duration in milliseconds (default: 60s)
 */
const cacheMiddleware = (duration = CACHE_DURATION) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedResponse = cache.get(key);

    // Return cached response if valid
    if (cachedResponse && Date.now() < cachedResponse.expiresAt) {
      console.log(`[CACHE HIT] ${key}`);
      return res.json(cachedResponse.data);
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (body) => {
      cache.set(key, {
        data: body,
        expiresAt: Date.now() + duration
      });
      console.log(`[CACHE SET] ${key} (expires in ${duration}ms)`);
      return originalJson(body);
    };

    next();
  };
};

/**
 * Clear specific cache key or all cache
 * @param {string} pattern - URL pattern to clear (optional)
 */
const clearCache = (pattern) => {
  if (!pattern) {
    cache.clear();
    console.log('[CACHE] All cache cleared');
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
      console.log(`[CACHE] Cleared: ${key}`);
    }
  }
};

/**
 * Middleware to auto-clear cache on POST/PUT/DELETE
 * @param {string} clearPattern - Pattern to clear from cache
 */
const autoClearCache = (clearPattern) => {
  return (req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      // Store original send/json functions
      const originalSend = res.send.bind(res);
      const originalJson = res.json.bind(res);

      // Override to clear cache after successful response
      const clearCacheOnSuccess = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          clearCache(clearPattern);
        }
        return body;
      };

      res.send = (body) => originalSend(clearCacheOnSuccess(body));
      res.json = (body) => originalJson(clearCacheOnSuccess(body));
    }
    next();
  };
};

module.exports = { cacheMiddleware, clearCache, autoClearCache };
