import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

if (env === 'production' && !process.env.JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing in production!');
}

const config = {
    env,
    port: process.env.PORT || 3000,
    jwt: {
        secret: process.env.JWT_SECRET || (env === 'production' ? undefined : 'fallback-secret-for-dev-only'),
        expiresIn: '1d',
    },
    db: {
        url: process.env.DATABASE_URL,
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

