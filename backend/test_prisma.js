import { PrismaClient } from './generated/prisma/index.js';

async function testPrisma() {
  console.log('Testing Prisma connection with DATABASE_URL in .env...');
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });

  try {
    const res = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Connected successfully! DB Time:', res);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
