import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';

import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

import router from './routes/AuthRoute.js';
import router1 from './routes/AdminRoute.js';
import notificationRouter from './routes/NotificationRoute.js';

import { SocketAuth } from './middlewares/SocketAuth.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import config from './config/config.js';

const PORT = config.port;
const app = express();
const server = http.createServer(app);

/* ======================
   SOCKET.IO SETUP
====================== */
const io = new Server(server, {
  cors: {
    origin: config.frontendUrl,
    credentials: true,
  },
});

// 🔐 socket auth
io.use(SocketAuth);

// Attach io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Security and Performance Middlewares
app.use(helmet()); // Sets various HTTP headers for security
app.use(compression()); // Compress response bodies for better performance

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', limiter); // Apply rate limit to all /api routes

app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Environment
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined')); // Production-grade logging
}

/* ======================
   BASIC ROUTE
====================== */
app.get('/', (req, res) => {
  res.status(200).json({ status: 'healthy', message: 'HRM API Server' });
});

/* ======================
   ROUTES
====================== */
app.use('/api/auth', router);
app.use('/api/admin', router1);
app.use('/api/notifications', notificationRouter);


// Standard Error Handler (Always last)
app.use(errorMiddleware);



/* ======================
   SOCKET EVENTS
====================== */
io.on('connection', (socket) => {
  if (config.env === 'development') {
    console.log('🟢 Socket connected:', socket.id);
  }

  socket.on('join', () => {
    if (socket.user) {
      // The JWT payload uses 'employeeId' for employees, and we can fallback to 'tenantId' for admins
      const userId = socket.user.employeeId || socket.user.tenantId;
      if (userId) {
        socket.join(userId);
      }
      
      if (socket.user.tenantId) {
        socket.join(`tenant_${socket.user.tenantId}`);
      }
    }
  });

  socket.on('disconnect', () => {
    if (config.env === 'development') {
      console.log('🔴 Socket disconnected:', socket.id);
    }
  });
});

/* ======================
   SERVER START & GRACEFUL SHUTDOWN
====================== */
let pubClient = null;
let subClient = null;

const startServer = async () => {
  const isRedisConfigured = Boolean(config.redis && (config.redis.url || config.redis.host));

  if (isRedisConfigured) {
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
  } else {
    console.log('ℹ️  Redis is not configured. Socket.IO running in single-node (in-memory) mode.');
    console.log('💡 Required environment variables for multi-replica Socket.IO scaling: REDIS_URL or (REDIS_HOST, REDIS_PORT, REDIS_PASSWORD).');
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${config.env} mode`);
  });
};

startServer();

const gracefulShutdown = async () => {
  console.log('Closing HTTP server and Socket.IO connections...');
  server.close(async () => {
    console.log('HTTP server closed');
    if (pubClient && subClient) {
      try {
        await Promise.all([pubClient.quit(), subClient.quit()]);
        console.log('Redis pub/sub clients disconnected');
      } catch (err) {
        console.error('Error closing Redis clients:', err.message);
      }
    }
    process.exit(0);
  });
};

// Graceful Shutdown Handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  gracefulShutdown();
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received');
  gracefulShutdown();
});

