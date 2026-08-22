import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

if (env === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing in production!');
}

const getDatabaseUrl = () => {
    let rawUrl = process.env.DATABASE_URL;
    if (!rawUrl) return rawUrl;

    try {
        const urlObj = new URL(rawUrl);
        if (!urlObj.searchParams.has('connection_limit')) {
            const limit = process.env.DB_CONNECTION_LIMIT || (env === 'production' ? '15' : '10');
            urlObj.searchParams.set('connection_limit', limit);
        }
        if (!urlObj.searchParams.has('pool_timeout')) {
            const timeout = process.env.DB_POOL_TIMEOUT || '10';
            urlObj.searchParams.set('pool_timeout', timeout);
        }
        return urlObj.toString();
    } catch (e) {
        return rawUrl;
    }
};

const config = {
    env,
    port: process.env.PORT || 3000,
    jwt: {
        secret: process.env.JWT_SECRET || (env === 'production' ? undefined : 'fallback-secret-for-dev-only'),
        expiresIn: '1d',
    },
    db: {
        url: getDatabaseUrl(),
        connectionLimit: process.env.DB_CONNECTION_LIMIT || (env === 'production' ? 15 : 10),
        poolTimeout: process.env.DB_POOL_TIMEOUT || 10,
    },
    redis: {
        url: process.env.REDIS_URL,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined,
        password: process.env.REDIS_PASSWORD,
    },
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

// Simple validation to ensure essential variables are present in production
if (config.env === 'production') {
    const essential = ['DATABASE_URL', 'EMAIL_USER', 'EMAIL_PASSWORD'];
    essential.forEach((key) => {
        if (!process.env[key]) {
            console.warn(`CRITICAL: Environment variable ${key} is missing in production!`);
        }
    });
}

export default config;

