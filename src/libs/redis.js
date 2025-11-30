import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

export async function invalidateCache(key) {
  try {
    await redisClient.del(key);
    console.log(`Cache ${key} berhasil dihapus`);
  } catch (err) {
    console.error(`Gagal menghapus cache ${key}:`, err.message);
  }
}

export default redisClient;
