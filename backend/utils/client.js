import { PrismaClient } from '../generated/prisma/index.js';
import config from '../config/config.js';

let prisma;

if (config.env === 'production') {
    prisma = new PrismaClient({
        log: ['error', 'warn'],
    });
} else {
    // Use global variable to prevent multiple instances in development (hot-reload compatible)
    if (!global.prisma) {
        global.prisma = new PrismaClient({
            log: ['query', 'info', 'warn', 'error'],
        });
    }
    prisma = global.prisma;
}

export default prisma;
