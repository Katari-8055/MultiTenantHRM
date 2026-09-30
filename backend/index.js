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

import router from './routes/AuthRoute.js';
import router1 from './routes/AdminRoute.js';
import notificationRouter from './routes/NotificationRoute.js';

import { SocketAuth } from './middlewares/SocketAuth.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import config from './config/config.js';
import { initRedisAdapter, closeRedisClients } from './config/redis.js';

const PORT = config.port;
const app = express();
const server = http.createServer(app);

/* ======================
   SOCKET.IO SETUP
====================== */
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

const isOriginAllowed = (origin) => {
  if (!origin) return true;
  const cleanOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.some(o => o.replace(/\/$/, '') === cleanOrigin)) return true;
  try {
    const hostname = new URL(origin).hostname;
    if (hostname.endsWith('.vercel.app') || hostname === 'localhost') return true;
  } catch (e) {}
  return false;
};

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isOriginAllowed(origin));
    },
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

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
};

app.use(cors(corsOptions));

// Security and Performance Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  originAgentCluster: false,
}));
app.use(compression()); // Compress response bodies for better performance

// Global Rate Limiter — applies to all /api routes (skipped in dev/testing if configured)
if (process.env.SKIP_RATE_LIMIT !== 'true') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Reasonable limit
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });
  app.use('/api/', limiter);
}

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
const startServer = async () => {
  await initRedisAdapter(io);

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${config.env} mode`);
  });
};

startServer();

const gracefulShutdown = async () => {
  console.log('Closing HTTP server and Socket.IO connections...');
  server.close(async () => {
    console.log('HTTP server closed');
    await closeRedisClients();
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


