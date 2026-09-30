import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Redis } from '@upstash/redis';
import config from './config.js';

let pubClient = null;
let subClient = null;

/**
 * Initializes Redis Pub/Sub adapter for Socket.IO multi-replica scaling.
 * @param {import('socket.io').Server} io - Socket.IO server instance
 */
export const initRedisAdapter = async (io) => {
  const isRedisConfigured = Boolean(config.redis && (config.redis.url || config.redis.host));

  if (!isRedisConfigured) {
    console.log('ℹ️  Redis is not configured. Socket.IO running in single-node (in-memory) mode.');
    console.log('💡 Required environment variables for multi-replica Socket.IO scaling: REDIS_URL or (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD).');
    return;
  }

  try {
    const redisOptions = config.redis.url
      ? { url: config.redis.url }
      : {
          socket: {
            host: config.redis.host,
            port: config.redis.port || 6379,
          },
          ...(config.redis.password && { password: config.redis.password }),
        };

    pubClient = createClient(redisOptions);
    subClient = pubClient.duplicate();

    pubClient.on('error', (err) => console.error('❌ Redis Pub Client Error:', err.message));
    subClient.on('error', (err) => console.error('❌ Redis Sub Client Error:', err.message));

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log('⚡ Redis Adapter initialized successfully for Socket.IO multi-replica scaling!');
  } catch (error) {
    console.error('❌ Failed to initialize Redis Adapter for Socket.IO:', error.message);
    console.log('⚠️  Falling back to default in-memory Socket.IO adapter.');
  }
};

/**
 * Closes active Redis pub/sub connections gracefully.
 */
export const closeRedisClients = async () => {
  if (pubClient && subClient) {
    try {
      await Promise.all([pubClient.quit(), subClient.quit()]);
      console.log('Redis pub/sub clients disconnected');
    } catch (err) {
      console.error('Error closing Redis clients:', err.message);
    }
  }
};

/* ==========================================================================
   UPSTASH REDIS REST CACHING (DASHBOARD)
   ========================================================================== */

let upstashRedis = null;

/**
 * Initializes or returns the singleton Upstash Redis client.
 */
export const getUpstashRedis = () => {
  if (upstashRedis) return upstashRedis;

  const url = process.env.UPSTASH_REDIS_REST_URL || config.upstash?.url;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || config.upstash?.token;

  if (url && token) {
    try {
      upstashRedis = new Redis({ url, token });
    } catch (err) {
      console.warn('⚠️ [Upstash Redis] Failed to initialize client:', err.message);
      upstashRedis = null;
    }
  }
  return upstashRedis;
};

/**
 * Retrieves cached value by key.
 * Gracefully falls back (returns null) if Redis fails or key is missing.
 */
export const getCache = async (key) => {
  try {
    const client = getUpstashRedis();
    if (!client) return null;
    const data = await client.get(key);
    if (!data) return null;
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  } catch (err) {
    console.warn(`⚠️ [Cache] Failed to get key "${key}", falling back to DB:`, err.message);
    return null;
  }
};

/**
 * Caches a value with a specified TTL in seconds (defaults to 300s / 5 minutes).
 */
export const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    const client = getUpstashRedis();
    if (!client) return;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await client.set(key, serialized, { ex: ttlSeconds });
  } catch (err) {
    console.warn(`⚠️ [Cache] Failed to set key "${key}":`, err.message);
  }
};

/**
 * Invalidates all dashboard caches associated with a tenant.
 */
export const invalidateTenantDashboardCache = async (tenantId) => {
  if (!tenantId) return;
  try {
    const client = getUpstashRedis();
    if (!client) return;

    const directKeys = [
      `dashboard:admin:${tenantId}`,
      `dashboard:hr:${tenantId}`,
    ];

    let patternKeys = [];
    try {
      patternKeys = await client.keys(`dashboard:*:${tenantId}*`);
    } catch (keyErr) {
      console.warn(`⚠️ [Cache] Pattern search failed for tenant ${tenantId}:`, keyErr.message);
    }

    const allKeys = Array.from(new Set([...directKeys, ...(Array.isArray(patternKeys) ? patternKeys : [])]));

    if (allKeys.length > 0) {
      await client.del(...allKeys);
    }
  } catch (err) {
    console.warn(`⚠️ [Cache] Failed to invalidate cache for tenant ${tenantId}:`, err.message);
  }
};

