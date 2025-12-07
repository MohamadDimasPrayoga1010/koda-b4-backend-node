import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';
import pg from 'pg';

const { PrismaClient } = pkg;
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const globalForPrisma = globalThis;

let prisma;

if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({ 
    connectionString,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ 
    adapter,
    log: ['error', 'warn'],
  });
} else {
  if (!globalForPrisma.prisma) {
    const pool = new Pool({ 
      connectionString,
      max: 10,
    });
    const adapter = new PrismaPg(pool);
    globalForPrisma.prisma = new PrismaClient({ 
      adapter,
      log: ['query', 'error', 'warn'],
    });
  }
  prisma = globalForPrisma.prisma;
}

if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export default prisma;
