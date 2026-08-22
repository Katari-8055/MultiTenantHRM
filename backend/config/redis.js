import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
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
